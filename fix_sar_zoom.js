const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove SAR zoom
content = content.replace('if (activeTab === \'sar\') targetDist = 4.8;', '');

// Fix azimuth logic to just point directly to India using the exact known good coordinates
// We'll also remove the shortest path hack because OrbitControls might handle it better if we just do simple linear interpolation with standard Euler wrapping
const newAzimuthLogic = `
        let lat = 16.0;
        let lon = 70.0;
        let targetDist = 5.35;

        let targetPolar = (90 - lat) * (Math.PI / 180);
        let theta = (lon + 180) * (Math.PI / 180);
        let targetAzimuth = theta - Math.PI / 2;

        // Force shortest path mathematically
        while (targetAzimuth - startAzimuth > Math.PI) targetAzimuth -= 2 * Math.PI;
        while (targetAzimuth - startAzimuth < -Math.PI) targetAzimuth += 2 * Math.PI;
`;

// Replace the old angles block
const startIdx = content.indexOf('// Default target: India');
const endIdx = content.indexOf('const animate = () => {');
const oldBlock = content.substring(startIdx, endIdx);

content = content.replace(oldBlock, newAzimuthLogic + '\n        ');

fs.writeFileSync(file, content);
console.log('Fixed SAR zoom and azimuth wrapping');
