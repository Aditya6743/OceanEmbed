import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Ping({ point, onComplete }: { point: THREE.Vector3, onComplete: () => void }) {
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    point.clone().normalize()
  );

  return (
    <group position={point.clone().multiplyScalar(1.02)} quaternion={quaternion}>
      <Ripple delay={0} onComplete={onComplete} />
      <Ripple delay={0.15} />
      <Ripple delay={0.3} />
    </group>
  );
}

function Ripple({ delay, onComplete }: { delay: number, onComplete?: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const time = useRef(0);
  
  useFrame((_, delta) => {
    time.current += delta;
    if (time.current < delay) return;
    
    if (ref.current && matRef.current) {
      ref.current.visible = true;
      // Smooth, soothing expansion
      ref.current.scale.addScalar(delta * 2.2);
      matRef.current.opacity -= delta * 0.6;
      
      if (matRef.current.opacity <= 0 && onComplete) {
        onComplete();
      }
    }
  });

  return (
    <mesh ref={ref} visible={false}>
      {/* Thicker, more visible ring */}
      <ringGeometry args={[0.02, 0.06, 64]} />
      <meshBasicMaterial 
        ref={matRef} 
        color="#22d3ee" 
        transparent 
        opacity={1.0} 
        side={THREE.DoubleSide} 
        depthTest={false} 
        blending={THREE.AdditiveBlending} 
      />
    </mesh>
  );
}
