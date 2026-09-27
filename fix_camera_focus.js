const fs = require('fs');

// 1. Update Solutions.tsx
let f1 = 'frontend/src/pages/Solutions.tsx';
let c1 = fs.readFileSync(f1, 'utf8');

// Add recenterTrigger state
c1 = c1.replace(
  /const \[isRotationLocked, setIsRotationLocked\] = useState\(false\);/,
  `const [isRotationLocked, setIsRotationLocked] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);`
);

// Update CameraResetTrigger signature and dependencies
c1 = c1.replace(
  /function CameraResetTrigger\(\{ activeTab, climateMode: _c, isRotationLocked \}: \{ activeTab: string, climateMode: string, isRotationLocked: boolean \}\) \{/,
  `function CameraResetTrigger({ activeTab, climateMode: _c, isRotationLocked, recenterTrigger }: { activeTab: string, climateMode: string, isRotationLocked: boolean, recenterTrigger?: number }) {`
);

c1 = c1.replace(
  /useThree\(\);\n\s*useEffect\(\(\) => \{/s,
  `useThree();\n    \n    useEffect(() => {`
);

c1 = c1.replace(
  /1 - Math\.pow\(1 - progress, 3\)/,
  `1 - Math.pow(1 - progress, 3)`
);

c1 = c1.replace(
  /\}, \[activeTab, _c, controls\]\);/,
  `}, [activeTab, _c, controls, recenterTrigger]);`
);

// Pass recenterTrigger to CameraResetTrigger
c1 = c1.replace(
  /<CameraResetTrigger activeTab=\{activeTab\} climateMode=\{climateMode\} isRotationLocked=\{isRotationLocked\} \/>/g,
  `<CameraResetTrigger activeTab={activeTab} climateMode={climateMode} isRotationLocked={isRotationLocked} recenterTrigger={recenterTrigger} />`
);

// Pass focus callback to LeftPanel
c1 = c1.replace(
  /<RoutingSarLeftPanel \n               simState=\{sarSimState\}/,
  `<RoutingSarLeftPanel 
               onInteract={() => { setIsRotationLocked(true); setRecenterTrigger(p => p + 1); }}
               simState={sarSimState}`
);

fs.writeFileSync(f1, c1);

// 2. Update RoutingSarLeftPanel.tsx
let f2 = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let c2 = fs.readFileSync(f2, 'utf8');

c2 = c2.replace(
  /setShowThermalRisk: \(s: boolean\) => void;\n\}/,
  `setShowThermalRisk: (s: boolean) => void;\n  onInteract: () => void;\n}`
);

c2 = c2.replace(
  /export default function RoutingSarLeftPanel\(\{ simState, setSimState, activeMode, setActiveMode, sarTimeHour, setSarTimeHour, showCurrents, setShowCurrents, showThermalRisk, setShowThermalRisk \}: RoutingSarLeftPanelProps\) \{/,
  `export default function RoutingSarLeftPanel({ simState, setSimState, activeMode, setActiveMode, sarTimeHour, setSarTimeHour, showCurrents, setShowCurrents, showThermalRisk, setShowThermalRisk, onInteract }: RoutingSarLeftPanelProps) {`
);

// Call onInteract on startSimulation and tab switches
c2 = c2.replace(
  /const startSimulation = \(\) => \{/g,
  `const startSimulation = () => {\n    onInteract();`
);

c2 = c2.replace(
  /setActiveMode\('routing'\); reset\(\);/g,
  `setActiveMode('routing'); reset(); onInteract();`
);

c2 = c2.replace(
  /setActiveMode\('sar'\); reset\(\);/g,
  `setActiveMode('sar'); reset(); onInteract();`
);

fs.writeFileSync(f2, c2);
console.log('Fixed camera focus logic');
