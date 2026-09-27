const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

const gatewayHtml = `
        {/* PERMANENT GATEWAY TOOLTIP */}
        {!is2DMode && iotSimState && (() => {
            const isAck = iotSimState.phase === 'ACKNOWLEDGED';
            return (
                <Html position={latLonToVector3(18.92, 72.82, 2.08)} zIndexRange={[100, 0]}>
                    <div className="pointer-events-none flex flex-col ml-4 -translate-y-1/2 backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                        <span className="text-cyan-300 font-black text-[12px] tracking-wider mb-0.5">GATEWAY #01</span>
                        <span className="text-white/80">MUMBAI HUB</span>
                        <span className="text-emerald-400 font-bold tracking-widest my-0.5">LoRaWAN LINK</span>
                        <span className="text-white/80">STATUS: <span className={isAck ? 'text-cyan-400' : iotSimState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : iotSimState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></span>
                    </div>
                </Html>
            );
        })()}
`;

// Find the start of the old popup block
let oldBlockStart = content.indexOf(`{iotPopupPos && !is2DMode && iotSimState && (() => {`);
let oldGatewayIfStart = content.indexOf(`if (iotPopupPos.id === 'gateway') {`, oldBlockStart);
let oldGatewayIfEnd = content.indexOf(`if (iotPopupPos.id === 'b1') {`, oldBlockStart);

// Remove the old gateway IF statement from the popup block
let oldGatewayString = content.substring(oldGatewayIfStart, oldGatewayIfEnd);
content = content.replace(oldGatewayString, '');

// Insert the permanent gateway HTML right BEFORE the iotPopupPos block
content = content.substring(0, oldBlockStart) + gatewayHtml + '\n        ' + content.substring(oldBlockStart);

// We also don't need the onClick on the Gateway beacon anymore since it's permanently shown
content = content.replace(
    `<IotBeacon lat={18.92} lon={72.82} color="#10b981" onClick={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} />`,
    `<IotBeacon lat={18.92} lon={72.82} color="#10b981" />`
);

fs.writeFileSync(file, content);
console.log('Fixed 3D Gateway tooltip to be permanent');
