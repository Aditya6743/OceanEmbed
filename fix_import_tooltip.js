const fs = require('fs');
let file = 'frontend/src/components/RoutingSar2DMap.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/, Tooltip/g, '');

fs.writeFileSync(file, content);
console.log('Fixed Tooltip unused import');
