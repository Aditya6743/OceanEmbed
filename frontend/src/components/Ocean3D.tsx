import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Edges, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { PredictionResponse } from '../types/ocean';
import { useOceanStore } from '../store/oceanStore';
import ArgoTubes, { getTempColor } from './ArgoTubes';

function WaterColumn({ prediction }: { prediction: PredictionResponse }) {
  const groupRef = useRef<THREE.Group>(null);
  const { hoveredDepth, setHoveredDepth, showArgoTubes } = useOceanStore();
  const [, setAnimating] = useState(true);
  
  useFrame((state) => {
    if (groupRef.current && !hoveredDepth) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 2000);
    return () => clearTimeout(t);
  }, [prediction]);

  // Use shared getTempColor from ArgoTubes (same color ramp for prediction & ground truth)

  const layers = prediction.profile.depth
    .map((depth, idx) => ({ depth, temp: prediction.profile.temperature[idx] }))
    
    .map(layer => {
      const colorHex = `#${getTempColor(layer.temp)}`;
      const y = 2 - (layer.depth / 1000) * 4;
      return { ...layer, colorHex, y };
    });

  const thermoclineDepth = prediction.estimated_thermocline || 150;
  const nearestThermocline100 = Math.round(thermoclineDepth / 100) * 100;

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0]}>
      
      {/* 1. INVISIBLE HITBOX */}
      <mesh 
        visible={false}
        onPointerMove={(e) => {
          if (e.buttons > 0) return;
          e.stopPropagation();
          if (groupRef.current) {
            const localPoint = groupRef.current.worldToLocal(e.point.clone());
            const rawDepth = ((2 - localPoint.y) / 4) * 1000;
            const standardDepths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
            const boundedDepth = standardDepths.reduce((prev, curr) => Math.abs(curr - rawDepth) < Math.abs(prev - rawDepth) ? curr : prev);
            
            if (hoveredDepth !== boundedDepth) setHoveredDepth(boundedDepth);
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredDepth(null);
        }}
      >
        <boxGeometry args={[2.5, 4.1, 2.5]} />
        <meshBasicMaterial />
      </mesh>

      {/* 2. PREMIUM VISUAL GLASS CASING */}
      <Box args={[2.05, 4.05, 2.05]} raycast={() => null}>
        <meshPhysicalMaterial 
          color="#0ea5e9" 
          transmission={0.9} 
          opacity={1} 
          transparent
          metalness={0.1}
          roughness={0.0}
          ior={1.2}
          thickness={0.1}
          side={THREE.BackSide} 
        />
        <Edges scale={1.0} threshold={15} color="#22d3ee" opacity={0.3} transparent />
      </Box>

      {/* 3. THICK GLASS PLATES (Distinct Depth Layers) */}
      {layers.map((layer) => {
        const isHovered = hoveredDepth === layer.depth;
        const isDimmed = hoveredDepth !== null && !isHovered;
        const isThermocline = layer.depth === nearestThermocline100;
        
        // Much higher opacity for thick plates to look like solid objects
        const opacity = isDimmed ? 0.1 : (isHovered ? 0.95 : (isThermocline ? 0.8 : 0.4));

        return (
          <group key={layer.depth} position={[0, layer.y, 0]}>
            {/* Thick BoxGeometry instead of flat PlaneGeometry */}
            <mesh raycast={() => null}>
              <boxGeometry args={[1.95, 0.005, 1.95]} />
              <meshPhysicalMaterial 
                color={layer.colorHex} 
                emissive={layer.colorHex}
                emissiveIntensity={isHovered ? 1.5 : (isThermocline ? 0.8 : 0.2)}
                transmission={0.6}
                transparent 
                opacity={opacity} 
                depthWrite={false}
                roughness={0.1}
                metalness={0.2}
                ior={1.4}
              />
            </mesh>
            
            {/* HTML Label */}
            {(isHovered || (isThermocline && hoveredDepth === null)) && (
              <Html position={[1.15, 0, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <div 
                  className="flex flex-col items-start bg-black/30 border border-white/10 p-2.5 rounded backdrop-blur-md shadow-2xl whitespace-nowrap transition-all"
                  style={{ borderLeftColor: layer.colorHex, borderLeftWidth: '3px', boxShadow: `0 0 40px ${layer.colorHex}20` }}
                >
                  <div className="text-[9px] font-mono tracking-widest mb-1.5 font-bold" style={{ color: layer.colorHex }}>
                    {isHovered ? 'DEPTH LAYER' : 'THERMOCLINE'}
                  </div>
                  <div className="text-white font-mono text-sm font-black drop-shadow-md">
                    {layer.depth}m <span className="text-white/20 mx-2">|</span> {layer.temp.toFixed(1)}°C
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
      
      {/* 4. PREMIUM 3D DEPTH SCALE */}
      <group position={[-1.3, 0, 1.3]} raycast={() => null}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 4, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
        </mesh>
        {[0, 200, 400, 600, 800, 1000].map(d => {
          const y = 2 - (d/1000)*4;
          return (
            <group key={d} position={[0, y, 0]}>
              <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
              </mesh>
              <Html position={[-0.1, 0, 0]} center style={{ pointerEvents: 'none' }}>
                <div className="text-[8px] text-cyan-400 font-mono tracking-widest text-right w-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                  {d}m
                </div>
              </Html>
            </group>
          )
        })}
      </group>

      {/* 5. ARGO GROUND TRUTH TUBES */}
      {showArgoTubes && prediction.argo_floats && prediction.argo_floats.length > 0 && (
        <ArgoTubes floats={prediction.argo_floats} />
      )}
    </group>
  );
}

export default function Ocean3D({ prediction }: { prediction?: PredictionResponse }) {
  if (!prediction) return null;

  return (
    <div className="w-full h-full relative bg-transparent">
      <Canvas camera={{ position: [0, 0.5, 6.5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={1.5} color="#0ea5e9" />
        <WaterColumn prediction={prediction} />
        <OrbitControls enableZoom={false} minDistance={4} maxDistance={10} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
