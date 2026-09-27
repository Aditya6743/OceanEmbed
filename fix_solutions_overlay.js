const fs = require('fs');
const file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = /<DigitalTwinGlobe\s*viewMode=\{activeTab as any\}\s*climateSubMode=\{climateMode\}\s*isRotationLocked=\{isRotationLocked\}\s*\/>/s;

content = content.replace(target, (match) => {
  return match + `\n            {activeTab === 'sar' && <RoutingSar3DOverlay simState={sarSimState} />}`;
});

fs.writeFileSync(file, content);
console.log('Fixed Solutions overlay injection');
