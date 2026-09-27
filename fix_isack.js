const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// I need to add back the `const isAck = iotSimState.phase === 'ACKNOWLEDGED';` to the gateway block!
const gatewaySearch = `{/* PERMANENT GATEWAY TOOLTIP */}
        {!is2DMode && iotSimState && (() => {
            
            return (`;
            
const gatewayReplace = `{/* PERMANENT GATEWAY TOOLTIP */}
        {!is2DMode && iotSimState && (() => {
            const isAck = iotSimState.phase === 'ACKNOWLEDGED';
            return (`;

content = content.replace(gatewaySearch, gatewayReplace);

// And make sure it is NOT in the iotPopupPos block
const popupSearch = `{iotPopupPos && !is2DMode && iotSimState && (() => {
            const isAlert = iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED';
            const isAck = iotSimState.phase === 'ACKNOWLEDGED';`;
            
const popupReplace = `{iotPopupPos && !is2DMode && iotSimState && (() => {
            const isAlert = iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED';`;

content = content.replace(popupSearch, popupReplace);

fs.writeFileSync(file, content);
console.log('Fixed isAck scoping');
