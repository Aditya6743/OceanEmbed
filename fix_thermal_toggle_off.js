const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /clearInterval\(interval\);\n\s*setSimState\('complete'\);/;
const replacement = `clearInterval(interval);\n          setSimState('complete');\n          if (activeMode === 'routing') setShowThermalRisk(false);`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Added auto thermal risk toggle off');
