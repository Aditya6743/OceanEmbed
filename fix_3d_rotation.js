const fs = require('fs');
const file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix useFrame rotation bug and apply static globe rotation
content = content.replace(
  /useFrame\(\(\{ clock \}\) => \{\s*if \(routeGroupRef\.current && simState === 'running'\) \{\s*routeGroupRef\.current\.rotation\.y = Math\.sin\(clock\.elapsedTime \* 2\) \* 0\.01;\s*\}\s*\}\);/s,
  "// Removed useFrame rotation to ensure it sticks to the globe"
);

content = content.replace(
  /<group ref=\{routeGroupRef\}>/g,
  '<group ref={routeGroupRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>'
);

fs.writeFileSync(file, content);
console.log('Fixed rotation');
