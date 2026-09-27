const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// Increase hitboxes to 0.08 (safe maximum before they overlap)
content = content.replace(
    /<sphereGeometry args=\{\[0\.05, 16, 16\]\} \/>/g,
    '<sphereGeometry args={[0.08, 16, 16]} />'
);

// Add pointerEvents: none explicitly to all Html wrappers
content = content.replaceAll(
    'zIndexRange={[100, 0]}',
    'zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}'
);

fs.writeFileSync(file, content);
console.log('Fixed Hitbox Size and Html pointer-events');
