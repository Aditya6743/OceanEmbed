const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldIotBeacon = `const IotBeacon = ({ lat, lon, color, onClick }: { lat: number, lon: number, color: string, onClick?: (e: any) => void }) => {

  const ringRef = useRef<THREE.Mesh>(null);
  
  // Convert Lat/Lon to 3D Cartesian coordinates
  const radius = 2.06;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      ringRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 - (Math.sin(state.clock.elapsedTime * 3) * 0.5);
    }
  });

  return (
    <group position={[x, y, z]} onClick={onClick}>
      {/* Outer White Border Dot */}
      <mesh>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Inner Colored Dot */}
      <mesh>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={ringRef} scale={[1, 1, 1]}>
        <ringGeometry args={[0.02, 0.025, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};`;

const newIotBeacon = `const IotBeacon = ({ lat, lon, color, onClick }: { lat: number, lon: number, color: string, onClick?: (e: any) => void }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  const radius = 2.06;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      ringRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 - (Math.sin(state.clock.elapsedTime * 3) * 0.5);
    }
  });

  // Calculate orientation looking directly away from the center of the globe
  const pos = new THREE.Vector3(x, y, z);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), pos.clone().normalize());

  return (
    <group 
        position={pos} 
        quaternion={quat}
        onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(e);
        }}
    >
      {/* Invisible Large Hitbox for incredibly easy clicking */}
      <mesh visible={false}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial />
      </mesh>
      
      {/* Outer White Border */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.022, 32]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Inner Colored Dot */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.016, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
        <ringGeometry args={[0.025, 0.035, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};`;

content = content.replace(oldIotBeacon, newIotBeacon);
fs.writeFileSync(file, content);
console.log('Fixed IotBeacon layout and hitboxes');
