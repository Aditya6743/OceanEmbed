const fs = require('fs');

let file3D = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let c3D = fs.readFileSync(file3D, 'utf8');

const oldJSX = `<mesh key={i} position={v.pos} quaternion={v.quaternion}>
                  <coneGeometry args={[0.005, 0.02, 8]} />
                  <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
               </mesh>`;

const newJSX = `<group key={i} position={v.pos} quaternion={v.quaternion}>
                  <mesh position={[0, -0.005, 0]}>
                     <cylinderGeometry args={[0.0008, 0.0008, 0.02, 4]} />
                     <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
                  </mesh>
                  <mesh position={[0, 0.01, 0]}>
                     <coneGeometry args={[0.003, 0.01, 4]} />
                     <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
                  </mesh>
               </group>`;

c3D = c3D.replace(oldJSX, newJSX);

fs.writeFileSync(file3D, c3D);
console.log('Replaced thick cones with thin arrows');
