const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const reset = \(\) => \{\n\s*\n\s*setSimState\('idle'\);\n\s*setProgress\(0\);\n\s*\};/;
const replacement = `const reset = () => {
    setSimState('idle');
    setProgress(0);
    setShowThermalRisk(false);
  };`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Fixed reset thermal');
