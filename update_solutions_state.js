const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Lift new states
content = content.replace(
  /const \[sarActiveMode, setSarActiveMode\] = useState<'routing' \| 'sar'>\('routing'\);/g,
  `const [sarActiveMode, setSarActiveMode] = useState<'routing' | 'sar'>('routing');
  const [sarTimeHour, setSarTimeHour] = useState(1);
  const [showCurrents, setShowCurrents] = useState(false);
  const [showThermalRisk, setShowThermalRisk] = useState(false);`
);

// Pass to Left Panel
content = content.replace(
  /<RoutingSarLeftPanel\s+simState=\{sarSimState\}\s+setSimState=\{setSarSimState\}\s+activeMode=\{sarActiveMode\}\s+setActiveMode=\{setSarActiveMode\}\s*\/>/s,
  `<RoutingSarLeftPanel 
               simState={sarSimState}
               setSimState={setSarSimState} 
               activeMode={sarActiveMode}
               setActiveMode={setSarActiveMode}
               sarTimeHour={sarTimeHour}
               setSarTimeHour={setSarTimeHour}
               showCurrents={showCurrents}
               setShowCurrents={setShowCurrents}
               showThermalRisk={showThermalRisk}
               setShowThermalRisk={setShowThermalRisk}
            />`
);

// Pass to Overlay
content = content.replace(
  /<RoutingSar3DOverlay simState=\{sarSimState\} activeMode=\{sarActiveMode\} \/>/g,
  `<RoutingSar3DOverlay simState={sarSimState} activeMode={sarActiveMode} sarTimeHour={sarTimeHour} showCurrents={showCurrents} showThermalRisk={showThermalRisk} />`
);

fs.writeFileSync(file, content);
console.log('Solutions patched');
