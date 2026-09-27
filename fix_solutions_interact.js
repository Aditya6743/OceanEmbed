const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    '<DigitalTwinGlobe viewMode={activeTab as any} climateSubMode={climateMode} isRotationLocked={isRotationLocked} onRequest2D={() => setIs2DMode(true)} is2DMode={is2DMode} iotSimState={simState} />',
    '<DigitalTwinGlobe viewMode={activeTab as any} climateSubMode={climateMode} isRotationLocked={isRotationLocked} onInteract={() => setIsRotationLocked(true)} onRequest2D={() => setIs2DMode(true)} is2DMode={is2DMode} iotSimState={simState} />'
);

fs.writeFileSync(file, content);
console.log('Fixed solutions interactivity locking');
