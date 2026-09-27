const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStyle = 'flex flex-col backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap';

const gatewayOld = 'pointer-events-none flex flex-col ml-1 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] whitespace-nowrap';
content = content.replace(gatewayOld, 'pointer-events-none ml-2 ' + targetStyle);

const b1Old = 'flex flex-col text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] whitespace-nowrap';
content = content.replace(b1Old, targetStyle);

const b2OldBlock = `<Popup className="custom-popup">
                            <div className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl">
                                <div className="text-sky-400 font-bold mb-1">TOURIST BOAT #77</div>
                                <div>STATUS: <span className={isAlert ? 'text-red-400' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></div>
                                <div>LAT: 12.0000</div>
                                <div>LON: 72.0000</div>
                                <div>SIGNAL: -72 dBm</div>
                                <div>BATTERY: 92%</div>
                            </div>
                        </Popup>`;

const b2NewBlock = `<Popup className="custom-popup bg-transparent border-0 shadow-none !p-0">
                            <div className="` + targetStyle + `">
                                <span className="text-sky-400 font-black text-[12px] tracking-wider mb-0.5">TOURIST BOAT #77</span>
                                <span className="text-white/80">STATUS: <span className={isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                                <span className="text-white/80">LAT: 12.0000 | LON: 72.0000</span>
                                <span className="text-white/80">SIG: -42 dBm | BAT: 92%</span>
                            </div>
                        </Popup>`;

content = content.replace(b2OldBlock, b2NewBlock);

fs.writeFileSync(file, content);
console.log('Synchronized 2D tooltips with exact 3D styles');
