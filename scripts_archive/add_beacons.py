import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Add the IoT Beacon Component at the top (after imports)
beacon_component = """
// ----------------------------------------------------
// IOT BEACON COMPONENT (Simulates physical hardware on globe)
// ----------------------------------------------------
const IotBeacon = ({ lat, lon, color, label }: { lat: number, lon: number, color: string, label: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  // Convert Lat/Lon to 3D Cartesian coordinates (matches the shader's inverse projection)
  const radius = 2.02; // Slightly above the surface
  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);
  
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad);
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);

  useFrame((state) => {
    if (ringRef.current) {
      // Pulse animation for the radio wave ring
      const scale = 1.0 + (Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5) * 1.5;
      ringRef.current.scale.set(scale, scale, scale);
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 1.0 - (scale - 1.0) / 1.5;
    }
  });

  return (
    <group position={[x, y, z]} lookAt={() => new THREE.Vector3(0, 0, 0)}>
      {/* Center Hardware Node */}
      <mesh>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Pulsing Radio Wave Ring */}
      <mesh ref={ringRef} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.02, 0.025, 32]} />
        <meshBasicMaterial color={color} transparent={true} opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
"""

# Insert it right after the imports
code = code.replace("export default function MosdacGlobe(", beacon_component + "\nexport default function MosdacGlobe(")

# 2. Add the Beacons to the JSX when viewMode === 'iot'
# Let's place them inside the main <group ref={globeRef}> right after the Earth mesh
beacon_jsx = """
      {/* IOT HARDWARE BEACONS */}
      {viewMode === 'iot' && (
        <group>
          {/* Mumbai Siren */}
          <IotBeacon lat={18.922} lon={72.8347} color="#f43f5e" label="Mumbai Siren" />
          {/* Offline Fisherman at Sea */}
          <IotBeacon lat={15.5} lon={68.0} color="#f43f5e" label="Fisherman 402" />
          {/* Coast Guard Terminal (Chennai) */}
          <IotBeacon lat={13.0827} lon={80.2707} color="#38bdf8" label="Coast Guard" />
          {/* Additional Coastal Sensors */}
          <IotBeacon lat={22.309} lon={70.802} color="#10b981" label="Gujarat Sensor" />
          <IotBeacon lat={8.524} lon={76.936} color="#10b981" label="Kerala Sensor" />
        </group>
      )}
"""

target_insert = "      <mesh raycast={() => null}>\n        <sphereGeometry args={[2, 128, 128]} />"
code = code.replace(target_insert, beacon_jsx + "\n" + target_insert)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
