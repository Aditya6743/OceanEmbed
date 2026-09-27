const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onRequest2D }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void }) {`;
const newStr = `export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onRequest2D, is2DMode }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void, is2DMode?: boolean }) {`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(file, content);
console.log('Fixed globe inline props');
