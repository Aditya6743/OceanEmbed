const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace IotBeacon entirely to ensure onClick is used
const iotBeaconOriginal = /const IotBeacon = \(\{ lat, lon, color, onClick \}: \{ lat: number, lon: number, color: string, onClick\?: \(e: any\) => void \}\) => \{\n\s*const pos = useMemo\(\(\) => \{\n\s*const phi = \(90 - lat\) \* \(Math\.PI \/ 180\);\n\s*const theta = \(lon \+ 180\) \* \(Math\.PI \/ 180\);\n\s*const r = 2.015;\n\s*return new THREE\.Vector3\(r \* Math\.sin\(phi\) \* Math\.cos\(theta\), r \* Math\.cos\(phi\), r \* Math\.sin\(phi\) \* Math\.sin\(theta\)\);\n\s*\}, \[lat, lon\]\);\n\s*return \(\n\s*<group position=\{pos\}>\n\s*<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.015, 16, 16\]\} \/><meshBasicMaterial color=\{color\} depthTest=\{false\} \/><\/mesh>\n\s*<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.035, 16, 16\]\} \/><meshBasicMaterial color=\{color\} transparent opacity=\{0.3\} depthTest=\{false\} \/><\/mesh>\n\s*<\/group>\n\s*\);\n\};/;

const iotBeaconNew = `const IotBeacon = ({ lat, lon, color, onClick }: { lat: number, lon: number, color: string, onClick?: (e: any) => void }) => {
  const pos = useMemo(() => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const r = 2.015;
    return new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
  }, [lat, lon]);
  return (
    <group position={pos}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color={color} depthTest={false} /></mesh>
      <mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color={color} transparent opacity={0.3} depthTest={false} /></mesh>
    </group>
  );
};`;

content = content.replace(iotBeaconOriginal, iotBeaconNew);

// Remove unused isRotationLocked from destructured args
content = content.replace(/isRotationLocked = false, /g, '');

fs.writeFileSync(file, content);
console.log('Fixed unused vars');
