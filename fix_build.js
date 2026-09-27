const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { RadioReceiver, CheckCircle2, ShieldAlert, Bell } from 'lucide-react';\n", "");

const badStr = "export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onRequest2D, is2DMode, iotSimState, onIotAck }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void, is2DMode?: boolean, iotSimState?: any, onIotAck?: () => void }) {\n  // @ts-ignore\n  const _dummy = onRequest2D;";
const goodStr = "export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onRequest2D, is2DMode, iotSimState }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void, is2DMode?: boolean, iotSimState?: any }) {\n  // @ts-ignore\n  const _dummy = onRequest2D;";

content = content.replace(badStr, goodStr);

fs.writeFileSync(file, content);

let solFile = 'frontend/src/pages/Solutions.tsx';
let solContent = fs.readFileSync(solFile, 'utf8');
solContent = solContent.replace(" iotSimState={simState} onIotAck={handleIotAck} />", " iotSimState={simState} />");
fs.writeFileSync(solFile, solContent);

console.log('Fixed build');
