const fs = require('fs');

// 1. Fix Ocean3D.tsx exact matching
let file3D = 'frontend/src/components/Ocean3D.tsx';
let c3D = fs.readFileSync(file3D, 'utf8');

c3D = c3D.replace(
  /const nearestThermocline100 = Math\.round\(thermoclineDepth \/ 100\) \* 100;/g,
  ''
);
c3D = c3D.replace(
  /isThermocline=\{layer\.depth === nearestThermocline100\}/g,
  'isThermocline={layer.depth === thermoclineDepth}'
);

fs.writeFileSync(file3D, c3D);


// 2. Add 175 to api.ts depths array
let fileApi = 'frontend/src/lib/api.ts';
let cApi = fs.readFileSync(fileApi, 'utf8');
cApi = cApi.replace(
  /const depths = \[0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 250/g,
  'const depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 175, 200, 250'
);
fs.writeFileSync(fileApi, cApi);

// 3. Add 175 to backend inference.py DEPTHS array if possible
let fileBackend = 'backend/app/services/inference.py';
let cBackend = fs.readFileSync(fileBackend, 'utf8');
cBackend = cBackend.replace(
  /DEPTHS = \[0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 250/g,
  'DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 175, 200, 250'
);
fs.writeFileSync(fileBackend, cBackend);

console.log('Fixed 3D Visual snapping and missing depths');
