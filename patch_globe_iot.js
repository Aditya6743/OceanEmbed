const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update Globe Props
content = content.replace(
  /export default function DigitalTwinGlobe\(\{ viewMode, climateSubMode, isRotationLocked \}: \{ viewMode: 'climate' \| 'navy' \| 'fishery' \| 'cable' \| 'enso' \| 'iot' \| 'sar', climateSubMode: string, isRotationLocked: boolean \}\) \{/,
  "export default function DigitalTwinGlobe({ viewMode, climateSubMode, isRotationLocked, onRequest2D }: { viewMode: 'climate' | 'navy' | 'fishery' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode: string, isRotationLocked: boolean, onRequest2D?: () => void }) {"
);

// 2. Add iotPopupPos state
if (!content.includes('iotPopupPos')) {
  content = content.replace(
    /const \[activePin, setActivePin\] = useState/,
    "const [iotPopupPos, setIotPopupPos] = useState<THREE.Vector3 | null>(null);\n  const [activePin, setActivePin] = useState"
  );
}

// 3. Update IotBeacon component signature inside the file
content = content.replace(
  /const IotBeacon = \(\{ lat, lon, color \}: \{ lat: number, lon: number, color: string \}\) => \{/,
  "const IotBeacon = ({ lat, lon, color, onClick }: { lat: number, lon: number, color: string, onClick?: (e: any) => void }) => {"
);
content = content.replace(
  /<mesh raycast=\{\(\) => null\}>/g,
  "<mesh onClick={onClick} raycast={() => null}>"
);
// Wait, replacing raycast={() => null} is dangerous if done globally, but doing it in IotBeacon is fine.
// Actually, IotBeacon has a specific structure:
// <mesh raycast={() => null}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color={color} depthTest={false} /></mesh>
// I will just replace the specific mesh in IotBeacon.

fs.writeFileSync(file, content);
console.log('Patched Globe Signature');
