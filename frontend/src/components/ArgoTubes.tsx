import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ArgoFloat } from '../types/ocean';
export function getTempColor(temp: number): string {
  const t = Math.max(0, Math.min(1, temp / 30));
  let hue;
  if (t < 0.3) {
    hue = 0.65 - (t / 0.3) * 0.15; // Deep Blue -> Cyan
  } else if (t < 0.7) {
    hue = 0.5 - ((t - 0.3) / 0.4) * 0.35; // Cyan -> Yellow
  } else {
    hue = 0.15 - ((t - 0.7) / 0.3) * 0.18; // Yellow -> Vivid Crimson
  }
  const finalHue = hue < 0 ? hue + 1 : hue;
  return new THREE.Color().setHSL(finalHue, 1.0, 0.55).getHexString();
}
interface ArgoTubeProps {
  float: ArgoFloat;
  index: number;
  totalFloats: number;
}
function ArgoTube({ float, index, totalFloats }: ArgoTubeProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const angle = (index / totalFloats) * Math.PI * 2 + Math.PI / 4;
  const radius = 0.55;
  const xPos = Math.cos(angle) * radius;
  const zPos = Math.sin(angle) * radius;
  const tubeRadius = 0.055;
  return (
    <group ref={groupRef} position={[xPos, 0, zPos]}>
      {/* Surface drop-point ring — glowing lime marker */}
      <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[tubeRadius + 0.01, tubeRadius + 0.04, 24]} />
        <meshBasicMaterial color="#a3e635" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Pulsing outer glow ring */}
      <mesh position={[0, 2.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[tubeRadius + 0.04, tubeRadius + 0.09, 24]} />
        <meshBasicMaterial color="#a3e635" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* Float ID label at surface */}
      <Html position={[0, 2.15, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div className="text-[7px] font-mono text-lime-400 tracking-widest whitespace-nowrap drop-shadow-[0_0_8px_rgba(163,230,53,0.6)] font-bold opacity-80">
          {float.id}
        </div>
      </Html>
      {/* Cylinder segments — one per depth interval */}
      {float.depths.map((depth, i) => {
        if (i >= float.depths.length - 1) return null;
        const nextDepth = float.depths[i + 1];
        const yTop = 2 - (depth / 1000) * 4;
        const yBottom = 2 - (nextDepth / 1000) * 4;
        const segmentHeight = Math.abs(yTop - yBottom);
        const yCenter = (yTop + yBottom) / 2;
        const temp = (float.temperatures[i] + float.temperatures[i + 1]) / 2;
        const colorHex = `#${getTempColor(temp)}`;
        const isHovered = hoveredSegment === i;
        return (
          <group key={`${float.id}-seg-${i}`}>
            <mesh
              position={[0, yCenter, 0]}
              onPointerEnter={(e) => { e.stopPropagation(); setHoveredSegment(i); }}
              onPointerLeave={(e) => { e.stopPropagation(); setHoveredSegment(null); }}
            >
              <cylinderGeometry args={[tubeRadius, tubeRadius, segmentHeight, 16, 1, false]} />
              <meshStandardMaterial
                color={colorHex}
                emissive={colorHex}
                emissiveIntensity={isHovered ? 1.2 : 0.35}
                metalness={0.3}
                roughness={0.4}
                transparent
                opacity={isHovered ? 1.0 : 0.85}
              />
            </mesh>
            {/* Hover tooltip */}
            {isHovered && (
              <Html position={[0.2, yCenter, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <div
                  className="flex flex-col bg-black/60 border border-lime-500/30 p-2 rounded backdrop-blur-md shadow-2xl whitespace-nowrap"
                  style={{ borderLeftColor: colorHex, borderLeftWidth: '3px' }}
                >
                  <div className="text-[8px] font-mono tracking-widest text-lime-400 font-bold mb-1">ARGO GROUND TRUTH</div>
                  <div className="text-white font-mono text-[11px] font-black">
                    {depth}–{nextDepth}m <span className="text-white/20 mx-1">|</span> {temp.toFixed(1)}°C
                  </div>
                  <div className="text-[7px] font-mono text-white/40 mt-0.5">{float.id}</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[tubeRadius + 0.002, tubeRadius + 0.002, 4, 16, 1, true]} />
        <meshBasicMaterial color="#a3e635" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}
interface ArgoTubesProps {
  floats: ArgoFloat[];
}
export default function ArgoTubes({ floats }: ArgoTubesProps) {
  if (!floats || floats.length === 0) return null;
  return (
    <group>
      {/* Legend label */}
      <Html position={[1.15, 2.2, 0]} center zIndexRange={[50, 0]} style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.8)]" />
          <span className="text-[7px] font-mono text-lime-400/80 tracking-[0.2em] font-bold">ARGO GROUND TRUTH</span>
        </div>
      </Html>
      {floats.map((float, index) => (
        <ArgoTube
          key={float.id}
          float={float}
          index={index}
          totalFloats={floats.length}
        />
      ))}
    </group>
  );
}
