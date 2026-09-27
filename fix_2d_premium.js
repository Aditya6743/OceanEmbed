const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const newTooltip = `<Tooltip permanent direction="right" className="bg-transparent border-0 shadow-none !p-0">
                            <div className="pointer-events-none flex flex-col ml-1 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] whitespace-nowrap">
                                <span className="text-cyan-300 font-black text-[12px] tracking-wider mb-0.5 drop-shadow-md">GATEWAY #01</span>
                                <span className="text-white/80">MUMBAI HUB</span>
                                <span className="text-emerald-400 font-bold tracking-widest my-0.5">LoRaWAN LINK</span>
                                <span className="text-white/80">STATUS: <span className={isAck ? 'text-cyan-400' : simState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : simState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></span>
                            </div>
                        </Tooltip>`;

// Replace the one I just added
content = content.replace(
    /<Tooltip permanent direction="right"[\s\S]*?<\/Tooltip>/,
    newTooltip
);

const oldB1 = `<Popup className="custom-popup">
                            <div className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl">
                                <div className="text-orange-400 font-bold mb-1">FISHERMAN VESSEL #402</div>
                                <div>STATUS: <span className={isFail ? 'text-slate-500' : isAlert ? 'text-red-400' : 'text-emerald-400'}>{isFail ? 'OFFLINE' : isAlert ? 'EVACUATE' : 'ONLINE'}</span></div>
                                <div>LAT: 16.0000</div>
                                <div>LON: 68.0000</div>
                                <div>SIGNAL: {isFail ? '--' : '-67 dBm'}</div>
                                <div>BATTERY: 87%</div>
                            </div>
                        </Popup>`;

const newB1 = `<Popup className="custom-popup bg-transparent border-0 shadow-none !p-0">
                            <div className="flex flex-col text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] whitespace-nowrap">
                                <span className="text-orange-400 font-black text-[12px] tracking-wider mb-0.5 drop-shadow-md">FISHERMAN #402</span>
                                <span className="text-white/80">STATUS: <span className={isFail ? 'text-slate-400' : isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isFail ? 'OFFLINE' : isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                                <span className="text-white/80">LAT: 16.0000 | LON: 68.0000</span>
                                <span className="text-white/80">SIG: {isFail ? '--' : '-67 dBm'} | BAT: 87%</span>
                            </div>
                        </Popup>`;

content = content.replace(oldB1, newB1);

const oldB2 = `<Popup className="custom-popup">
                            <div className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl">
                                <div className="text-sky-400 font-bold mb-1">TOURIST BOAT #77</div>
                                <div>STATUS: <span className={isAlert ? 'text-red-400' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></div>
                                <div>LAT: 12.0000</div>
                                <div>LON: 72.0000</div>
                                <div>SIGNAL: -42 dBm</div>
                                <div>BATTERY: 92%</div>
                            </div>
                        </Popup>`;

const newB2 = `<Popup className="custom-popup bg-transparent border-0 shadow-none !p-0">
                            <div className="flex flex-col text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] whitespace-nowrap">
                                <span className="text-sky-400 font-black text-[12px] tracking-wider mb-0.5 drop-shadow-md">TOURIST BOAT #77</span>
                                <span className="text-white/80">STATUS: <span className={isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                                <span className="text-white/80">LAT: 12.0000 | LON: 72.0000</span>
                                <span className="text-white/80">SIG: -42 dBm | BAT: 92%</span>
                            </div>
                        </Popup>`;

content = content.replace(oldB2, newB2);
fs.writeFileSync(file, content);
console.log('Fixed 2D tooltips styling');
