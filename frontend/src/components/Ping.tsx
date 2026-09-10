import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Ping({ point, onComplete }: { point: THREE.Vector3, onComplete: () => void }) {
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    point.clone().normalize()
  );

  return (
    <group position={point.clone().multiplyScalar(1.01)} quaternion={quaternion}>
      <Ripple delay={0} onComplete={onComplete} />
      <Ripple delay={0.2} />
      <Ripple delay={0.4} />
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
      // Premium smooth expansion
      ref.current.scale.addScalar(delta * 1.5);
      matRef.current.opacity -= delta * 0.45;
      
      if (matRef.current.opacity <= 0 && onComplete) {
        onComplete();
      }
    }
  });

  return (
    <mesh ref={ref} visible={false}>
      {/* Extremely slim, elegant ring */}
      <ringGeometry args={[0.02, 0.023, 64]} />
      <meshBasicMaterial 
        ref={matRef} 
        color="#00E5FF" 
        transparent 
        opacity={0.8} 
        side={THREE.DoubleSide} 
        depthTest={false} 
        blending={THREE.AdditiveBlending} 
      />
    </mesh>
  );
}
