const fs = require('fs');
let file = 'frontend/src/components/landing/ProjectVisionSection.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = 'Naval Submarine Stealth, Cyclone Intensification, Marine Heatwaves, Subsea Cable Routing, SAR Drift Prediction, Sustainable Fisheries, and IoT Evacuation Alerts.';
const newStr = 'Disaster Mgmt, Naval Ops, Fisheries, Benthic Cable, IOD Climate, IoT Beacons, and Routing & SAR.';

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Fixed ProjectVisionSection.tsx with exact tab names');
} else {
    console.log('Could not find string to replace.');
}
