const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// The globe mesh is manually rotated by [17.5, 195, 0] degrees in DigitalTwinGlobe.tsx!
// This means Azimuth 0 is ALREADY PERFECTLY CENTERED ON INDIA!
// Any manual math offset was sending the camera to the opposite side of the Earth.

const oldBlockStart = `        let lat = 16.0;`;
const oldBlockEnd = `while (targetAzimuth - startAzimuth < -Math.PI) targetAzimuth += 2 * Math.PI;`;
const oldBlock = content.substring(content.indexOf(oldBlockStart), content.indexOf(oldBlockEnd) + oldBlockEnd.length);

const newBlock = `        let targetAzimuth = 0; // Due to DigitalTwinGlobe's group rotation of 195deg, Azimuth 0 is dead-center on India
        let targetPolar = Math.PI / 2; // Equator (India is slightly tilted via the group X-rotation)
        let targetDist = 5.35; // Default distance, no SAR zoom

        // Force shortest path mathematically
        while (targetAzimuth - startAzimuth > Math.PI) targetAzimuth -= 2 * Math.PI;
        while (targetAzimuth - startAzimuth < -Math.PI) targetAzimuth += 2 * Math.PI;`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(file, content);
console.log('Fixed rotation logic');
