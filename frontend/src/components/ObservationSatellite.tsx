import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ObservationSatellite({ radius = 2.4, speed = 0.4 }) {
  const satelliteRef = useRef<THREE.Group>(null);
  const mountTimeRef = useRef<number | null>(null);
    
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  useFrame((state) => {
    if (!satelliteRef.current) return;
    
    if (mountTimeRef.current === null) {
      mountTimeRef.current = state.clock.elapsedTime;
    }
    
    const localTime = prefersReducedMotion ? 0 : state.clock.elapsedTime - mountTimeRef.current;
    
    // Decreased speed
    const currentSpeed = speed * 0.7;
    // Starts at Math.PI (Left side) and decreases to 0 (Right side).
    // Because Z = sin(angle), it passes IN FRONT of the Earth (Z > 0) while moving left to right!
    const angle = -localTime * currentSpeed + Math.PI;
    
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    
    const baseRotationY = -(angle - Math.PI / 2);
    
    // Entrance Roll (Shows top initially, snaps to side)
    const decay = Math.exp(-localTime * 1.5);
    const entranceRoll = decay * (-Math.PI / 2);
    
    satelliteRef.current.position.set(x, 0, z);
    
    // Apply rotations
    satelliteRef.current.rotation.x = 0;
    satelliteRef.current.rotation.y = baseRotationY;
    satelliteRef.current.rotation.z = entranceRoll;
  });

  return (
    // Specifically rotated to create a Bottom-Left to Top-Right diagonal arc!
    // X tilt: slight inclination
    // Y tilt: slight swivel
    // Z tilt (-Math.PI / 6): Tilts the left side down and the right side up!
    <group rotation={[Math.PI / 36, 0, Math.PI / 6]}>
      
      {/* Orbital Plane Line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.002, 64, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
      </mesh>

      <group ref={satelliteRef}>
        <group>
          {/* Core Body */}
          <mesh>
            <boxGeometry args={[0.08, 0.08, 0.12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Solar Panels */}
          <mesh position={[0, 0, 0.15]}>
            <boxGeometry args={[0.2, 0.01, 0.12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.4} />
            <lineSegments>
               <edgesGeometry args={[new THREE.BoxGeometry(0.2, 0.01, 0.12)]} />
               <lineBasicMaterial color="#38bdf8" transparent opacity={0.3} />
            </lineSegments>
          </mesh>

          <mesh position={[0, 0, -0.15]}>
            <boxGeometry args={[0.2, 0.01, 0.12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.4} />
            <lineSegments>
               <edgesGeometry args={[new THREE.BoxGeometry(0.2, 0.01, 0.12)]} />
               <lineBasicMaterial color="#38bdf8" transparent opacity={0.3} />
            </lineSegments>
          </mesh>

          {/* Static Antenna */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.015, 0.03, 0.06, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          
          <mesh position={[0.04, 0.04, 0.04]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
