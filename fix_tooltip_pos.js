const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '{iotPopupPos && !is2DMode && iotSimState && (() => {';

const newTooltips = `{iotPopupPos && !is2DMode && iotSimState && (() => {
            const isAlert = iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED';
            const isAck = iotSimState.phase === 'ACKNOWLEDGED';
            const isFail = iotSimState.phase === 'DELIVERY FAILED';

            if (iotPopupPos.id === 'gateway') {
                return (
                    <Html position={latLonToVector3(18.92, 72.82, 2.08)} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none flex flex-col mt-4 -translate-x-1/2 backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                            <span className="text-cyan-300 font-black text-[12px] tracking-wider mb-0.5">GATEWAY #01</span>
                            <span className="text-white/80">MUMBAI HUB</span>
                            <span className="text-emerald-400 font-bold tracking-widest my-0.5">LoRaWAN LINK</span>
                            <span className="text-white/80">STATUS: <span className={isAck ? 'text-cyan-400' : iotSimState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : iotSimState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></span>
                        </div>
                    </Html>
                );
            }
            if (iotPopupPos.id === 'b1') {
                return (
                    <Html position={latLonToVector3(16.0, 68.0, 2.08)} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none flex flex-col mt-4 -translate-x-1/2 backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                            <span className="text-orange-400 font-black text-[12px] tracking-wider mb-0.5">FISHERMAN #402</span>
                            <span className="text-white/80">STATUS: <span className={isFail ? 'text-slate-400' : isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isFail ? 'OFFLINE' : isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                            <span className="text-white/80">LAT: 16.0000 | LON: 68.0000</span>
                            <span className="text-white/80">SIG: {isFail ? '--' : '-67 dBm'} | BAT: 87%</span>
                        </div>
                    </Html>
                );
            }
            if (iotPopupPos.id === 'b2') {
                return (
                    <Html position={latLonToVector3(12.0, 72.0, 2.08)} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none flex flex-col mt-4 -translate-x-1/2 backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                            <span className="text-sky-400 font-black text-[12px] tracking-wider mb-0.5">TOURIST BOAT #77</span>
                            <span className="text-white/80">STATUS: <span className={isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                            <span className="text-white/80">LAT: 12.0000 | LON: 72.0000</span>
                            <span className="text-white/80">SIG: -42 dBm | BAT: 92%</span>
                        </div>
                    </Html>
                );
            }
            return null;
        })()}`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf('})()}', startIndex) + 5;

const oldSection = content.substring(startIndex, endIndex);
content = content.replace(oldSection, newTooltips);

fs.writeFileSync(file, content);
console.log('Fixed position, translation offset, and added premium glass blur');
