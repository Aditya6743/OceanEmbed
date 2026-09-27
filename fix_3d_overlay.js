const fs = require('fs');
const file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import React, \{ useMemo, useRef \} from 'react';/g,
  "import { useMemo, useRef } from 'react';\nimport { Line } from '@react-three/drei';"
);

content = content.replace(
  /const routeMaterial = [^\n]+/g,
  ""
);
content = content.replace(
  /const hazardMaterial = [^\n]+/g,
  ""
);
content = content.replace(
  /const sarMaterial = [^\n]+/g,
  ""
);

content = content.replace(
  /<line geometry=\{routeGeometry\} material=\{routeMaterial\} \/>/g,
  '<Line points={routePoints} color="#22d3ee" lineWidth={2} transparent opacity={0.8} />'
);

fs.writeFileSync(file, content);
console.log('Fixed 3D Overlay');
