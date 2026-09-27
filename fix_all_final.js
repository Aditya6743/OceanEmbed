const fs = require('fs');

// 1. Fix IotBeaconsPanel.tsx Radio import
let file1 = 'frontend/src/components/IotBeaconsPanel.tsx';
let c1 = fs.readFileSync(file1, 'utf8');
if (!c1.includes('Radio, ArrowLeft')) {
  c1 = c1.replace(/Activity, Wifi, ArrowLeft/, "Activity, Wifi, ArrowLeft, Radio");
}
fs.writeFileSync(file1, c1);

// 2. Fix DigitalTwinGlobe.tsx Signature & onClick
let file2 = 'frontend/src/components/DigitalTwinGlobe.tsx';
let c2 = fs.readFileSync(file2, 'utf8');

const globeSigRegex = /export default function DigitalTwinGlobe\(\{ viewMode = 'climate', climateSubMode = 'cyclone', \}: \{ viewMode\?: 'navy' \| 'fishery' \| 'climate' \| 'cable' \| 'enso' \| 'iot', climateSubMode\?: 'cyclone' \| 'flood' \| 'heatwave' \| 'erosion', isRotationLocked\?: boolean \}\) \{/;
const newGlobeSig = "export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', isRotationLocked = false, onRequest2D }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void }) {";
c2 = c2.replace(globeSigRegex, newGlobeSig);

// IotBeacon onClick was unused because the regex replacement for it failed in the earlier script.
// Let's replace the mesh directly inside IotBeacon manually
const iotBeaconRegex = /<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.015, 16, 16\]\} \/><meshBasicMaterial color=\{color\} depthTest=\{false\} \/><\/mesh>/g;
c2 = c2.replace(iotBeaconRegex, `<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color={color} depthTest={false} /></mesh>`);

const iotBeaconRegex2 = /<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.035, 16, 16\]\} \/><meshBasicMaterial color=\{color\} transparent opacity=\{0.3\} depthTest=\{false\} \/><\/mesh>/g;
c2 = c2.replace(iotBeaconRegex2, `<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color={color} transparent opacity={0.3} depthTest={false} /></mesh>`);

fs.writeFileSync(file2, c2);

console.log('Fixed all TS errors');
