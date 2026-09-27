const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove from toggles and basic buttons
content = content.replace(/ playUISound\('click'\);/g, '');
content = content.replace(/ onClick=\{\(\) => playUISound\('click'\)\}/g, '');

fs.writeFileSync(file, content);
console.log('Removed normal click sounds');
