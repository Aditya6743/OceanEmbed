const fs = require('fs');

// 1. Fix default state in Solutions.tsx
let f1 = 'frontend/src/pages/Solutions.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(/const \[sarTimeHour, setSarTimeHour\] = useState\(1\);/, "const [sarTimeHour, setSarTimeHour] = useState(6);");
fs.writeFileSync(f1, c1);

// 2. Fix animation limit in RoutingSar3DOverlay.tsx
let f2 = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let c2 = fs.readFileSync(f2, 'utf8');

const regex = /const animT = Math\.min\(elapsed \/ 1\.5, 1\.0\);/;
const replacement = `const maxProgress = sarTimeHour / 24;\n        const animT = Math.min(elapsed / 1.5, 1.0) * maxProgress;`;

c2 = c2.replace(regex, replacement);
fs.writeFileSync(f2, c2);

console.log('Fixed SAR time bug');
