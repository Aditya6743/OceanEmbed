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
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Prevent clipping/distortion at the start using a Master Compressor
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-15, now);
    compressor.knee.setValueAtTime(10, now);
    compressor.ratio.setValueAtTime(12, now);
    compressor.attack.setValueAtTime(0.01, now);
    compressor.release.setValueAtTime(0.25, now);
    compressor.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator(); 
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Main tone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 4.5);
    
    // Enhanced Vibrations: Triangle wave adds a tactile "growl/rumble"
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(55, now);
    subOsc.frequency.exponentialRampToValueAtTime(10, now + 4.5); // Drops into 10Hz physical infra-sound
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now); // Smoothed from 500Hz to reduce initial harshness
    filter.frequency.exponentialRampToValueAtTime(60, now + 4.5);
    
    // Fix initial distortion: lowered peak volume and softened attack
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.8); // Slower 0.8s fade-in prevents clipping
    gain.gain.exponentialRampToValueAtTime(0.01, now + 5.5);
    
    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(compressor); // Route through safety compressor
    
    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 6.5);
    subOsc.stop(now + 6.5);

    for(let i=0; i<20; i++) {
      const bTime = now + (Math.random() * 4.0); 
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      
      bOsc.type = 'sine';
      bOsc.frequency.setValueAtTime(300 + Math.random()*500, bTime);
      bOsc.frequency.exponentialRampToValueAtTime(600 + Math.random()*500, bTime + 0.1);
      
      bGain.gain.setValueAtTime(0, bTime);
      bGain.gain.linearRampToValueAtTime(0.08, bTime + 0.03);
      bGain.gain.exponentialRampToValueAtTime(0.01, bTime + 0.1);
      
      bOsc.connect(bGain);
      bGain.connect(compressor); // Route bubbles through compressor
      
      bOsc.start(bTime);
      bOsc.stop(bTime + 0.15);
    }
  } catch (e) {}
};



function ScannerPlane({ isDiving, hoveredDepth }: { isDiving: boolean, hoveredDepth: number | null }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // If diving, calculate physical Y target based on depth
      const targetY = hoveredDepth !== null ? 2 - (hoveredDepth / 1000) * 4 : 2;
      const targetOpacity = (isDiving && hoveredDepth !== null) ? 0.8 : 0.0;
      
      // Glide smoothly to the depth layer
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 6 * delta);
      
      // Fade in/out the laser
      meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, targetOpacity, 10 * delta);
      
      // Pulse scale slightly for a scanning effect
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 20) * 0.02;
      meshRef.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 2, 0]} raycast={() => null} renderOrder={2000}>
      <boxGeometry args={[2.08, 0.02, 2.08]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function DepthPlate({ layer, isHovered, isDimmed, isThermocline, hoveredDepth }: { layer: any, isHovered: boolean, isDimmed: boolean, isThermocline: boolean, hoveredDepth: number | null }) {
  const materialRef = useRef<any>(null);
  
  const targetOpacity = isDimmed ? 0.05 : (isHovered ? 0.95 : (isThermocline ? 0.8 : 0.4));
  const targetEmissive = isHovered ? 2.5 : (isThermocline ? 0.8 : 0.2);

  useFrame((_state, delta) => {
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 12 * delta);
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, targetEmissive, 12 * delta);
    }
  });

  const showLabel = isHovered || (isThermocline && hoveredDepth === null);

  return (
    <group position={[0, layer.y, 0]}>
      <mesh raycast={() => null} renderOrder={1000 - layer.depth}>
        <boxGeometry args={[1.95, 0.005, 1.95]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color={layer.colorHex} 
          emissive={layer.colorHex}
          emissiveIntensity={targetEmissive}
          transmission={0.6}
          transparent 
          opacity={targetOpacity} 
          depthWrite={false}
          roughness={0.1}
          metalness={0.2}
          ior={1.4}
        />
      </mesh>
      
      <Html position={[1.15, 0, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div 
          className={`flex flex-col items-start bg-black/40 border border-white/10 p-2.5 rounded backdrop-blur-md shadow-2xl whitespace-nowrap transition-all duration-500 ease-out ${showLabel ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'}`}
          style={{ borderLeftColor: layer.colorHex, borderLeftWidth: '3px', boxShadow: showLabel ? `0 0 40px ${layer.colorHex}40` : 'none' }}
        >
          <div className="text-[9px] font-mono tracking-widest mb-1.5 font-bold" style={{ color: layer.colorHex }}>
            {isHovered ? 'DEPTH LAYER' : 'THERMOCLINE'}
          </div>
          <div className="text-white font-mono text-sm font-black drop-shadow-md">
            {layer.depth}m <span className="text-white/20 mx-2">|</span> {layer.temp.toFixed(1)}°C
          </div>
        </div>
      </Html>
    </group>
  );
}

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

  // Enhanced, highly saturated premium color map

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
