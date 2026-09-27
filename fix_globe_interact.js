const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update the signature
const oldSig = `export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onRequest2D, is2DMode, iotSimState }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void, is2DMode?: boolean, iotSimState?: any }) {`;
const newSig = `export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onInteract, onRequest2D, is2DMode, iotSimState }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onInteract?: () => void, onRequest2D?: () => void, is2DMode?: boolean, iotSimState?: any }) {`;

content = content.replace(oldSig, newSig);

// 2. Add to globe click
const oldHandleGlobe = `const handleGlobeClick = (e: any) => {
    e.stopPropagation();`;
const newHandleGlobe = `const handleGlobeClick = (e: any) => {
    e.stopPropagation();
    if (onInteract) onInteract();`;

content = content.replace(oldHandleGlobe, newHandleGlobe);

// 3. Add to Beacon clicks
const oldB1Click = `onClick={(e) => setIotPopupPos(prev => prev?.id === 'b1' ? null : { point: e.point, id: 'b1' })}`;
const newB1Click = `onClick={(e) => { if (onInteract) onInteract(); setIotPopupPos(prev => prev?.id === 'b1' ? null : { point: e.point, id: 'b1' }); }}`;
content = content.replace(oldB1Click, newB1Click);

const oldB2Click = `onClick={(e) => setIotPopupPos(prev => prev?.id === 'b2' ? null : { point: e.point, id: 'b2' })}`;
const newB2Click = `onClick={(e) => { if (onInteract) onInteract(); setIotPopupPos(prev => prev?.id === 'b2' ? null : { point: e.point, id: 'b2' }); }}`;
content = content.replace(oldB2Click, newB2Click);

fs.writeFileSync(file, content);
console.log('Fixed globe interactivity locking');
