const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const startSimulation = \(\) => \{\n\s*onInteract\(\);/;
const replacement = `const startSimulation = () => {
    if (activeMode === 'routing') {
      setShowThermalRisk(true);
    }
    onInteract();`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Added auto thermal risk toggle');
