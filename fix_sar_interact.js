const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSig = `export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk, onRequest2D, is2DMode }: { simState: string, activeMode: 'routing' | 'sar', sarTimeHour: number, showCurrents: boolean, showThermalRisk: boolean, onRequest2D: () => void, is2DMode?: boolean }) {`;
const newSig = `export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk, onRequest2D, is2DMode, onInteract }: { simState: string, activeMode: 'routing' | 'sar', sarTimeHour: number, showCurrents: boolean, showThermalRisk: boolean, onRequest2D: () => void, is2DMode?: boolean, onInteract?: () => void }) {`;

content = content.replace(oldSig, newSig);

// Replace onClick events to call onInteract
content = content.replaceAll(
    'onClick={(e) => { e.stopPropagation(); setPopupPos(e.point); }}',
    'onClick={(e) => { if (onInteract) onInteract(); e.stopPropagation(); setPopupPos(prev => prev ? null : e.point); }}' // also added toggle logic!
);

content = content.replaceAll(
    'onClick={(e) => { e.stopPropagation(); setPopupPos(null); onRequest2D(); }}',
    'onClick={(e) => { if (onInteract) onInteract(); e.stopPropagation(); setPopupPos(null); onRequest2D(); }}'
);

fs.writeFileSync(file, content);
console.log('Fixed SAR overlay interactivity');
