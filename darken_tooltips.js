const fs = require('fs');

// 1. DigitalTwinGlobe (3D)
let file3d = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content3d = fs.readFileSync(file3d, 'utf8');
content3d = content3d.replaceAll('backdrop-blur-md bg-black/40 border border-white/10', 'backdrop-blur-md bg-black/85 border border-white/10');
fs.writeFileSync(file3d, content3d);

// 2. IotBeaconsPanel (2D)
let file2d = 'frontend/src/components/IotBeaconsPanel.tsx';
let content2d = fs.readFileSync(file2d, 'utf8');
content2d = content2d.replaceAll('backdrop-blur-md bg-black/40 border border-white/10', 'backdrop-blur-md bg-black/85 border border-white/10');
fs.writeFileSync(file2d, content2d);

console.log('Darkened background for all tooltip cards');
