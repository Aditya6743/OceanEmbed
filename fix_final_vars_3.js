const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<mesh>\n\s*<sphereGeometry args=\{\[0.015, 16, 16\]\} \/>\n\s*<meshBasicMaterial color=\{color\} \/>\n\s*<\/mesh>/g;
content = content.replace(regex, '<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color={color} /></mesh>');

fs.writeFileSync(file, content);
console.log('Fixed IotBeacon clicks FINALLY');
