const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change back from massive circle to a tight sphere hitbox
content = content.replace(
    /<circleGeometry args=\{\[0\.2, 16\]\} \/>/g,
    '<sphereGeometry args={[0.05, 16, 16]} />'
);

fs.writeFileSync(file, content);
console.log('Fixed hitboxes');
