const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('RoutingSar2DMap')) {
  content = content.replace(
    /import RoutingSar3DOverlay from '\.\.\/components\/RoutingSar3DOverlay';/,
    "import RoutingSar3DOverlay from '../components/RoutingSar3DOverlay';\nimport RoutingSar2DMap from '../components/RoutingSar2DMap';"
  );
}

// Add state
content = content.replace(
  /const \[sarTimeHour, setSarTimeHour\] = useState\(1\);/,
  "const [sarTimeHour, setSarTimeHour] = useState(1);\n  const [is2DMode, setIs2DMode] = useState(false);"
);

// Reset 2D mode when changing tabs
content = content.replace(
  /reset\(\); \/\/ Dismiss the Target Box when changing sections/,
  "reset(); // Dismiss the Target Box when changing sections\n    setIs2DMode(false);"
);

// Update RoutingSar3DOverlay props
content = content.replace(
  /<RoutingSar3DOverlay \n\s*simState=\{sarSimState\}\n\s*activeMode=\{sarActiveMode\}\n\s*sarTimeHour=\{sarTimeHour\}\n\s*showCurrents=\{showCurrents\}\n\s*showThermalRisk=\{showThermalRisk\}\n\s*\/>/g,
  `<RoutingSar3DOverlay 
               simState={sarSimState}
               activeMode={sarActiveMode}
               sarTimeHour={sarTimeHour}
               showCurrents={showCurrents}
               showThermalRisk={showThermalRisk}
               onRequest2D={() => setIs2DMode(true)}
             />`
);

// Inject the 2D map over the Canvas when active
const renderCanvas = /{activeTab !== 'iot' && \(\n\s*<div className="absolute inset-0 z-0">/g;
const renderReplacement = `{activeTab !== 'iot' && (
           <div className="absolute inset-0 z-0">
             {is2DMode && activeTab === 'sar' && (
                <RoutingSar2DMap 
                  activeMode={sarActiveMode}
                  simState={sarSimState}
                  sarTimeHour={sarTimeHour}
                  showThermalRisk={showThermalRisk}
                  onClose={() => setIs2DMode(false)}
                />
             )}
`;
content = content.replace(renderCanvas, renderReplacement);

fs.writeFileSync(file, content);
console.log('Updated Solutions state');
