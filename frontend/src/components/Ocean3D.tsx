import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Edges, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { PredictionResponse } from '../types/ocean';
import { useOceanStore } from '../store/oceanStore';
import { ArrowDownCircle } from 'lucide-react';
import ArgoTubes, { getTempColor } from './ArgoTubes';

const playDiveSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Low frequency rumble (submarine dive)
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 6.0);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 6.0);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 6.0);
  } catch (e) {
    console.error("Audio failed", e);
  }
};

function WaterColumn({ prediction, isDiving, setIsDiving }: { prediction: PredictionResponse, isDiving: boolean, setIsDiving: (d: boolean) => void }) {

  const groupRef = useRef<THREE.Group>(null);
  const { hoveredDepth, setHoveredDepth, showArgoTubes } = useOceanStore();
  const [, setAnimating] = useState(true);
  

  // HAPTICS: Trigger physical device vibrations when passing depth layers
  useEffect(() => {
    if (isDiving && hoveredDepth !== null && navigator.vibrate) {
      try {
        if (hoveredDepth === 1000) {
          navigator.vibrate([100, 40, 150]); // Heavy thud at the bottom
        } else if (hoveredDepth > 0) {
          navigator.vibrate(15); // Light mechanical click passing each layer
        }
      } catch (e) {}
    }
  }, [hoveredDepth, isDiving]);

  // Linearly physical dive sequence synced EXACTLY with audio
  const diveProgressRef = useRef(0);
  const isEndingDiveRef = useRef(false);
  
  useEffect(() => {
    if (isDiving) {
      diveProgressRef.current = 0;
      isEndingDiveRef.current = false;
      setHoveredDepth(0);
    } else {
      setHoveredDepth(null);
    }
  }, [isDiving, setHoveredDepth]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (!hoveredDepth && !isDiving) {
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      }
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 4 * delta);
    }
    
    // Drive the dive physically to perfectly sync with the 6.0s audio sweep
    if (isDiving) {
      diveProgressRef.current += delta / 4.5; // Slowed down to 6.0 seconds for smoother descent
      if (diveProgressRef.current >= 1.0) {
        diveProgressRef.current = 1.0;
        if (hoveredDepth !== 1000) setHoveredDepth(1000);
        
        if (!isEndingDiveRef.current) {
          isEndingDiveRef.current = true;
          setTimeout(() => setIsDiving(false), 1500); // Wait at bottom before clearing
        }
      } else {
        const currentPhysicalDepth = diveProgressRef.current * 1000; // Linear physical drop
        const standardDepths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
        const boundedDepth = standardDepths.reduce((prev, curr) => Math.abs(curr - currentPhysicalDepth) < Math.abs(prev - currentPhysicalDepth) ? curr : prev);
        
        if (hoveredDepth !== boundedDepth) {
          setHoveredDepth(boundedDepth);
        }
      }
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

      <ScannerPlane isDiving={isDiving} hoveredDepth={hoveredDepth} />

      {/* 2. PREMIUM VISUAL GLASS CASING */}
      <Box args={[2.05, 4.05, 2.05]} raycast={() => null} renderOrder={-100}>
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
        <Edges renderOrder={3000} scale={1.0} threshold={15} color="#22d3ee" opacity={0.3} transparent />
      </Box>

      {/* 3. THICK GLASS PLATES (Distinct Depth Layers) */}
      {layers.map((layer) => (
        <DepthPlate 
          key={layer.depth} 
          layer={layer} 
          isHovered={hoveredDepth === layer.depth} 
          isDimmed={hoveredDepth !== null && hoveredDepth !== layer.depth} 
          isThermocline={layer.depth === nearestThermocline100}
          hoveredDepth={hoveredDepth}
        />
      ))}
      
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
  const [isDiving, setIsDiving] = useState(false);

  if (!prediction) return null;

  const handleDive = () => {
    if (isDiving) return;
    setIsDiving(true);
    if (navigator.vibrate) try { navigator.vibrate([40, 50, 40]); } catch(e) {}
    playDiveSound();
  };

  return (
    <div className="w-full h-full relative bg-transparent group">
      {/* Interactive Dive Button */}
      <button 
        onClick={handleDive}
        disabled={isDiving}
        className="absolute top-4 right-4 z-50 bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900 hover:scale-105 transition-all text-cyan-400 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowDownCircle size={14} className={isDiving ? "animate-bounce" : ""} />
        {isDiving ? "DIVING..." : "DEEP DIVE"}
      </button>

      <Canvas camera={{ position: [0, 0.5, 6.5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={1.5} color="#0ea5e9" />
        <WaterColumn prediction={prediction} isDiving={isDiving} setIsDiving={setIsDiving} />
        <OrbitControls enableZoom={false} minDistance={4} maxDistance={10} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
