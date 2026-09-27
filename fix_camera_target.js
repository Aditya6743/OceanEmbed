const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldAngles = `        let targetAzimuth = 0; 
        let targetPolar = Math.PI / 2; 
        let targetDist = 5.35;

        if (activeTab === 'iot' || activeTab === 'sar') {
            const lat = activeTab === 'iot' ? 14.5 : 12.5;
            const lon = activeTab === 'iot' ? 69.5 : 68.0;
            targetPolar = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            targetAzimuth = theta - Math.PI / 2;
            if (activeTab === 'sar') targetDist = 4.8;
        }`;

const newAngles = `        // Default target: India / Arabian Sea
        let lat = 16.0;
        let lon = 70.0;
        let targetDist = 5.35;

        if (activeTab === 'iot') {
            lat = 14.5;
            lon = 69.5;
        } else if (activeTab === 'sar') {
            lat = 12.5;
            lon = 68.0;
            targetDist = 4.8;
        }

        let targetPolar = (90 - lat) * (Math.PI / 180);
        let theta = (lon + 180) * (Math.PI / 180);
        let targetAzimuth = theta - Math.PI / 2;`;

content = content.replace(oldAngles, newAngles);
fs.writeFileSync(file, content);
console.log('Fixed default camera target to India for all tabs');
