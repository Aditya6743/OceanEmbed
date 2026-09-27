const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Make Hitboxes Bigger
content = content.replace(
    /<circleGeometry args=\{\[0\.1, 16\]\} \/>/g,
    '<circleGeometry args={[0.2, 16]} />'
);

// 2. Add Toggle Logic for Fisherman and Tourist Boat
const oldB1Click = `onClick={(e) => setIotPopupPos({ point: e.point, id: 'b1' })}`;
const newB1Click = `onClick={(e) => setIotPopupPos(prev => prev?.id === 'b1' ? null : { point: e.point, id: 'b1' })}`;
content = content.replace(oldB1Click, newB1Click);

const oldB2Click = `onClick={(e) => setIotPopupPos({ point: e.point, id: 'b2' })}`;
const newB2Click = `onClick={(e) => setIotPopupPos(prev => prev?.id === 'b2' ? null : { point: e.point, id: 'b2' })}`;
content = content.replace(oldB2Click, newB2Click);

fs.writeFileSync(file, content);
console.log('Fixed toggle logic and expanded hitboxes');
