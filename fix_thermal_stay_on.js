const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /if \(activeMode === 'routing'\) setShowThermalRisk\(false\);/;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log('Fixed thermal risk to stay on');
