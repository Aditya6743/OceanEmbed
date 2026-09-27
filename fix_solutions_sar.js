const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    '<RoutingSar3DOverlay simState={sarSimState} activeMode={sarActiveMode} sarTimeHour={sarTimeHour} showCurrents={showCurrents} showThermalRisk={showThermalRisk} onRequest2D={() => setIs2DMode(true)} is2DMode={is2DMode} />',
    '<RoutingSar3DOverlay simState={sarSimState} activeMode={sarActiveMode} sarTimeHour={sarTimeHour} showCurrents={showCurrents} showThermalRisk={showThermalRisk} onRequest2D={() => setIs2DMode(true)} is2DMode={is2DMode} onInteract={() => setIsRotationLocked(true)} />'
);

fs.writeFileSync(file, content);
console.log('Passed onInteract to SAR overlay');
