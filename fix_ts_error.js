const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("useFrame((state, delta) => {", "useFrame((_state, delta) => {");

fs.writeFileSync(file, content);
console.log('Fixed TS error');
