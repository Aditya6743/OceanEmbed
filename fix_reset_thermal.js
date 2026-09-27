const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const reset = \(\) => \{\n\s*playUISound\('click'\);\n\s*setSimState\('idle'\);/;
const replacement = `const reset = () => {\n    setSimState('idle');\n    setShowThermalRisk(false);`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Fixed reset thermal');
