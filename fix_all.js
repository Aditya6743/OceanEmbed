const fs = require('fs');

// Fix 3D Overlay unused import
let f1 = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(/import \{ useFrame \} from '@react-three\/fiber';\n/, '');
fs.writeFileSync(f1, c1);

// Fix Solutions.tsx
let f2 = 'frontend/src/pages/Solutions.tsx';
let c2 = fs.readFileSync(f2, 'utf8');

// Restore IotLeftPanel props
c2 = c2.replace(
  /simState=\{sarSimState\} \n               setSimState=\{setSarSimState\}\n                simState=\{simState\}/s,
  "runSimulation={runSimulation}\n                resetSimulation={resetSimulation}\n                simState={simState}"
);

// Fix RoutingSarLeftPanel props
c2 = c2.replace(
  /runSimulation=\{\(\) => setSarSimState\('running'\)\}\s*resetSimulation=\{\(\) => setSarSimState\('idle'\)\}/s,
  "simState={sarSimState}\n               setSimState={setSarSimState}"
);

fs.writeFileSync(f2, c2);
console.log('Fixed TS errors');
