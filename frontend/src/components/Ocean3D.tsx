import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useOceanStore } from '../store/oceanStore';

const getTemperatureColor = (temp: number, minTemp: number, maxTemp: number) => {
  const t = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
  const color = new THREE.Color();
  if (t < 0.5) {
    color.lerpColors(new THREE.Color('#020617'), new THREE.Color('#0ea5e9'), t * 2);
  } else {
    color.lerpColors(new THREE.Color('#0ea5e9'), new THREE.Color('#ef4444'), (t - 0.5) * 2);
  }
  return color;
};

function WaterColumn({ depth, temperature, estimatedThermocline }: { depth: number[], temperature: number[], estimatedThermocline?: number }) {
  const maxDepth = Math.max(...depth);
  const minTemp = Math.min(...temperature);
  const maxTemp = Math.max(...temperature);

  const layers = useMemo(() => {
    return depth.map((d, i) => {
      const height = 4; 
      const y = -(d / maxDepth) * height;
      
      let thickness = 0;
      if (i < depth.length - 1) {
        thickness = ((depth[i+1] - d) / maxDepth) * height;
      } else {
        thickness = height / depth.length;
      }

      return {
        d,
        y: y - (thickness / 2),
        thickness,
        temp: temperature[i],
        color: getTemperatureColor(temperature[i], minTemp, maxTemp)
      };
    });
  }, [depth, temperature]);

  return (
    <group position={[0, 2, 0]}>
      {layers.map((layer, i) => (
        <mesh key={i} position={[0, layer.y, 0]}>
          <boxGeometry args={[1.5, layer.thickness, 1.5]} />
          <meshPhysicalMaterial 
            color={layer.color} 
            transparent 
            opacity={0.8} 
            transmission={0.4} 
            roughness={0.1}
          />
          <Html position={[1.0, 0, 0]} center className="pointer-events-none">
            <div className="flex flex-col items-start translate-x-4">
              <div className="text-[10px] font-mono text-white/70 whitespace-nowrap">{layer.d}m • {layer.temp.toFixed(1)}°C</div>
              {estimatedThermocline === layer.d && (
                <div className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-1 rounded whitespace-nowrap mt-1 border border-cyan-800">
                  ~ THERMOCLINE (ESTIMATED)
                </div>
              )}
            </div>
          </Html>
        </mesh>
      ))}
      
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[1.52, 4.02, 1.52]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export default function Ocean3D() {
  const prediction = useOceanStore(state => state.prediction);

  if (!prediction) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white/40 bg-card rounded-xl border border-white/5">
        <p className="text-sm font-mono uppercase tracking-widest text-white/30">Awaiting Prediction Data</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-card rounded-xl border border-white/5 relative overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/5 bg-white/[0.01]">
        <h2 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
          1D Subsurface Temperature Profile
        </h2>
        <p className="text-[10px] text-white/40 mt-1">Visualized as a 3D water column (0–2000m)</p>
      </div>
      
      <div className="flex-1 relative">
        <Canvas camera={{ position: [4, 1, 4], fov: 40 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#0ea5e9" />
          
          <Suspense fallback={null}>
            <WaterColumn 
              depth={prediction.profile.depth} 
              temperature={prediction.profile.temperature} 
              estimatedThermocline={prediction.estimated_thermocline}
            />
            <OrbitControls 
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
