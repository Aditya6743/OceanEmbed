const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Revert ArgoFloat breakage (lines ~653)
content = content.replace(
  /<mesh onClick=\{onClick\} raycast=\{\(\) => null\}><sphereGeometry args=\{\[isSelected \? 0\.009 : 0\.005, 12, 12\]\} \/><meshBasicMaterial color=\{isSelected \? "#a3e635" : "#4ade80"\} \/><\/mesh>/g,
  '<mesh raycast={() => null}><sphereGeometry args={[isSelected ? 0.009 : 0.005, 12, 12]} /><meshBasicMaterial color={isSelected ? "#a3e635" : "#4ade80"} /></mesh>'
);
content = content.replace(
  /<mesh onClick=\{onClick\} raycast=\{\(\) => null\}><sphereGeometry args=\{\[isSelected \? 0\.016 : \(hovered \? 0\.013 : 0\.008\), 12, 12\]\} \/><meshBasicMaterial color="#a3e635" transparent opacity=\{isSelected \? 0\.6 : \(hovered \? 0\.45 : 0\.25\)\} \/><\/mesh>/g,
  '<mesh raycast={() => null}><sphereGeometry args={[isSelected ? 0.016 : (hovered ? 0.013 : 0.008), 12, 12]} /><meshBasicMaterial color="#a3e635" transparent opacity={isSelected ? 0.6 : (hovered ? 0.45 : 0.25)} /></mesh>'
);

// 2. Fix IotBeacon onClick
content = content.replace(
  /const IotBeacon = \(\{ lat, lon, color, onClick \}: \{ lat: number, lon: number, color: string, onClick\?: \(e: any\) => void \}\) => \{([\s\S]*?)<group position=\{pos\}>([\s\S]*?)<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.015, 16, 16\]\} \/><meshBasicMaterial color=\{color\} depthTest=\{false\} \/><\/mesh>/g,
  `const IotBeacon = ({ lat, lon, color, onClick }: { lat: number, lon: number, color: string, onClick?: (e: any) => void }) => {$1<group position={pos}>$2<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color={color} depthTest={false} /></mesh>`
);

content = content.replace(
  /<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.035, 16, 16\]\} \/><meshBasicMaterial color=\{color\} transparent opacity=\{0.3\} depthTest=\{false\} \/><\/mesh>/g,
  `<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color={color} transparent opacity={0.3} depthTest={false} /></mesh>`
);

// 3. Fix DigitalTwinGlobe signature
const globeSig = /export default function DigitalTwinGlobe\(\{ viewMode = 'climate', climateSubMode = 'cyclone', \}: \{ viewMode\?: 'navy' \| 'fishery' \| 'climate' \| 'cable' \| 'enso' \| 'iot' \| 'sar', climateSubMode\?: 'cyclone' \| 'flood' \| 'heatwave' \| 'erosion', isRotationLocked\?: boolean \}\) \{/;

content = content.replace(
  globeSig,
  "export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', isRotationLocked = false, onRequest2D }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void }) {"
);

fs.writeFileSync(file, content);
console.log('Fixed Globe Errors');
