const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Interface
const oldInt = `  is2DMode?: boolean;
}`;
const newInt = `  is2DMode?: boolean;
  onInteract?: () => void;
}`;
content = content.replace(oldInt, newInt);

// Update Signature
const oldSig = `export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk, onRequest2D, is2DMode }: RoutingSar3DOverlayProps) {`;
const newSig = `export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk, onRequest2D, is2DMode, onInteract }: RoutingSar3DOverlayProps) {`;
content = content.replace(oldSig, newSig);

fs.writeFileSync(file, content);
console.log('Fixed SAR props');
