const fs = require('fs');
let file = 'frontend/src/components/RoutingSar2DMap.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all L.divIcon configurations to include `iconSize: null`
content = content.replace(/L\.divIcon\(\{\n    className: '',/g, "L.divIcon({\n    className: '',\n    iconSize: null as any,");

fs.writeFileSync(file, content);
console.log('Added iconSize: null to all divIcons');
