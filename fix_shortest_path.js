const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldAngles = `        if (activeTab === 'iot' || activeTab === 'sar') {
            const lat = activeTab === 'iot' ? 14.5 : 12.5;
            const lon = activeTab === 'iot' ? 69.5 : 68.0;
            targetPolar = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            targetAzimuth = theta - Math.PI / 2;
            if (activeTab === 'sar') targetDist = 4.8;
        }`;

const newAngles = `        if (activeTab === 'iot' || activeTab === 'sar') {
            const lat = activeTab === 'iot' ? 14.5 : 12.5;
            const lon = activeTab === 'iot' ? 69.5 : 68.0;
            targetPolar = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            targetAzimuth = theta - Math.PI / 2;
            if (activeTab === 'sar') targetDist = 4.8;
        }

        // Shortest path interpolation for azimuth
        targetAzimuth = targetAzimuth % (2 * Math.PI);
        if (targetAzimuth > Math.PI) targetAzimuth -= 2 * Math.PI;
        if (targetAzimuth < -Math.PI) targetAzimuth += 2 * Math.PI;
        
        if (targetAzimuth - startAzimuth > Math.PI) {
            targetAzimuth -= 2 * Math.PI;
        } else if (targetAzimuth - startAzimuth < -Math.PI) {
            targetAzimuth += 2 * Math.PI;
        }`;

content = content.replace(oldAngles, newAngles);
fs.writeFileSync(file, content);
console.log('Fixed shortest path');
