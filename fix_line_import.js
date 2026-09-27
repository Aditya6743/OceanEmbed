const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { Html } from '@react-three/drei';", "import { Html, Line } from '@react-three/drei';");

fs.writeFileSync(file, content);
console.log('Fixed Line import');
