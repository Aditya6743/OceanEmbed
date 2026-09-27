const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// IotBeacon starts around line 672
// I will just use a generic replace
content = content.replace(
  /<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.015, 16, 16\]\} \/><meshBasicMaterial color=\{color\} depthTest=\{false\} \/><\/mesh>/g,
  '<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color={color} depthTest={false} /></mesh>'
);

content = content.replace(
  /<mesh raycast=\{\(\) => null\}><sphereGeometry args=\{\[0.035, 16, 16\]\} \/><meshBasicMaterial color=\{color\} transparent opacity=\{0.3\} depthTest=\{false\} \/><\/mesh>/g,
  '<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color={color} transparent opacity={0.3} depthTest={false} /></mesh>'
);

fs.writeFileSync(file, content);
console.log('Fixed IotBeacon clicks again');
