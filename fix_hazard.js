const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldBlock = `<mesh>
                  <circleGeometry args={[0.22, 64]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>`;
                
const newBlock = `<mesh raycast={() => null}>
                  <circleGeometry args={[0.22, 64]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(file, content);
console.log('Fixed hazard circle raycasting');
