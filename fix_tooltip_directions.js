const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// For b1 (Fisherman)
let b1Start = content.indexOf(`if (iotPopupPos.id === 'b1') {`);
let b1End = content.indexOf('</Html>', b1Start);
let b1Section = content.substring(b1Start, b1End);
let newB1Section = b1Section.replace(
    'ml-4 -translate-y-1/2', 
    '-ml-4 -translate-x-full -translate-y-1/2'
);
content = content.replace(b1Section, newB1Section);

// For b2 (Tourist Boat)
let b2Start = content.indexOf(`if (iotPopupPos.id === 'b2') {`);
let b2End = content.indexOf('</Html>', b2Start);
let b2Section = content.substring(b2Start, b2End);
let newB2Section = b2Section.replace(
    'ml-4 -translate-y-1/2', 
    'mt-4 -translate-x-1/2'
);
content = content.replace(b2Section, newB2Section);

fs.writeFileSync(file, content);
console.log('Fixed tooltip directional anchoring for all 3 beacons');
