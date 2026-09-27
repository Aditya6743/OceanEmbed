const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldPopup = `<Popup className="custom-popup">
                            <div className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl">
                                <div className="text-cyan-400 font-bold mb-1">GATEWAY #01</div>
                                <div>MUMBAI HUB</div>
                                <div className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded my-1 w-fit border border-emerald-500/30">LoRaWAN (No WiFi Req)</div>
                                <div>STATUS: <span className={isAck ? 'text-cyan-400' : simState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : simState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></div>
                            </div>
                        </Popup>`;

const newTooltip = `<Tooltip permanent direction="right" className="bg-transparent border-0 shadow-none">
                            <div className="text-[10px] font-mono bg-black/80 backdrop-blur-md text-white p-2 rounded-lg border border-white/10 shadow-xl ml-2">
                                <div className="text-cyan-400 font-bold mb-1">GATEWAY #01</div>
                                <div>MUMBAI HUB</div>
                                <div className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded my-1 w-fit border border-emerald-500/30">LoRaWAN (No WiFi Req)</div>
                                <div>STATUS: <span className={isAck ? 'text-cyan-400' : simState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : simState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></div>
                            </div>
                        </Tooltip>`;

content = content.replace(oldPopup, newTooltip);
fs.writeFileSync(file, content);
console.log('Fixed 2D Gateway Tooltip');
