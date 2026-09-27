const fs = require('fs');

// 1. Fix Solutions.tsx
let fSolutions = 'frontend/src/pages/Solutions.tsx';
let cSolutions = fs.readFileSync(fSolutions, 'utf8');

cSolutions = cSolutions.replace(
  /\{selectedLocation && clickPosition && \(/,
  '{selectedLocation && clickPosition && !is2DMode && ('
);

cSolutions = cSolutions.replace(
  /<DigitalTwinGlobe \s*viewMode=\{activeTab as any\} \s*climateSubMode=\{climateMode\} \s*isRotationLocked=\{isRotationLocked\}\s*onRequest2D=\{\(\) => setIs2DMode\(true\)\}\s*\/>/g,
  '<DigitalTwinGlobe viewMode={activeTab as any} climateSubMode={climateMode} isRotationLocked={isRotationLocked} onRequest2D={() => setIs2DMode(true)} is2DMode={is2DMode} />'
);

cSolutions = cSolutions.replace(
  /<RoutingSar3DOverlay simState=\{sarSimState\} activeMode=\{sarActiveMode\} sarTimeHour=\{sarTimeHour\} showCurrents=\{showCurrents\} showThermalRisk=\{showThermalRisk\} onRequest2D=\{\(\) => setIs2DMode\(true\)\} \/>/g,
  '<RoutingSar3DOverlay simState={sarSimState} activeMode={sarActiveMode} sarTimeHour={sarTimeHour} showCurrents={showCurrents} showThermalRisk={showThermalRisk} onRequest2D={() => setIs2DMode(true)} is2DMode={is2DMode} />'
);

fs.writeFileSync(fSolutions, cSolutions);


// 2. Fix DigitalTwinGlobe.tsx
let fGlobe = 'frontend/src/components/DigitalTwinGlobe.tsx';
let cGlobe = fs.readFileSync(fGlobe, 'utf8');

cGlobe = cGlobe.replace(
  /interface DigitalTwinGlobeProps \{\n  viewMode: 'climate' \| 'iot' \| 'sar';\n  climateSubMode: 'temp' \| 'salinity' \| 'currents' \| 'cyclone';\n  isRotationLocked: boolean;\n  onRequest2D\?: \(\) => void;\n\}/g,
  "interface DigitalTwinGlobeProps {\n  viewMode: 'climate' | 'iot' | 'sar';\n  climateSubMode: 'temp' | 'salinity' | 'currents' | 'cyclone';\n  isRotationLocked: boolean;\n  onRequest2D?: () => void;\n  is2DMode?: boolean;\n}"
);

cGlobe = cGlobe.replace(
  /export default function DigitalTwinGlobe\(\{ viewMode, climateSubMode, isRotationLocked, onRequest2D \}: DigitalTwinGlobeProps\) \{/g,
  'export default function DigitalTwinGlobe({ viewMode, climateSubMode, isRotationLocked, onRequest2D, is2DMode }: DigitalTwinGlobeProps) {'
);

cGlobe = cGlobe.replace(/\{activePin && \(/g, '{activePin && !is2DMode && (');
cGlobe = cGlobe.replace(/\{iotPopupPos && \(/g, '{iotPopupPos && !is2DMode && (');

// Also the activePin's little circle and marker? 
// They are fine since they are in 3D and the 2D map has a black background covering them. The <Html> bleeds through DOM.
fs.writeFileSync(fGlobe, cGlobe);


// 3. Fix RoutingSar3DOverlay.tsx
let fSar = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let cSar = fs.readFileSync(fSar, 'utf8');

cSar = cSar.replace(
  /interface RoutingSar3DOverlayProps \{\n  simState: 'idle' \| 'running' \| 'complete';\n  activeMode: 'routing' \| 'sar';\n  sarTimeHour: number;\n  showCurrents: boolean;\n  showThermalRisk: boolean;\n  onRequest2D: \(\) => void;\n\}/g,
  "interface RoutingSar3DOverlayProps {\n  simState: 'idle' | 'running' | 'complete';\n  activeMode: 'routing' | 'sar';\n  sarTimeHour: number;\n  showCurrents: boolean;\n  showThermalRisk: boolean;\n  onRequest2D: () => void;\n  is2DMode?: boolean;\n}"
);

cSar = cSar.replace(
  /export default function RoutingSar3DOverlay\(\{ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk, onRequest2D \}: RoutingSar3DOverlayProps\) \{/g,
  'export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk, onRequest2D, is2DMode }: RoutingSar3DOverlayProps) {'
);

cSar = cSar.replace(/\{popupPos && \(/g, '{popupPos && !is2DMode && (');

fs.writeFileSync(fSar, cSar);

console.log('Fixed Html bleeding across 2D map');
