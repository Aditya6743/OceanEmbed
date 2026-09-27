const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove hover triggers from IotBeacon calls
const oldGateway = `<IotBeacon lat={18.92} lon={72.82} color="#10b981" onClick={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} onPointerEnter={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} onPointerLeave={() => setIotPopupPos(null)} />`;
const newGateway = `<IotBeacon lat={18.92} lon={72.82} color="#10b981" onClick={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} />`;
content = content.replace(oldGateway, newGateway);

const oldB1 = `<IotBeacon lat={16.0} lon={68.0} color={iotSimState && iotSimState.phase === 'DELIVERY FAILED' ? "#64748b" : (iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981")} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} onPointerEnter={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} onPointerLeave={() => setIotPopupPos(null)} />`;
const newB1 = `<IotBeacon lat={16.0} lon={68.0} color={iotSimState && iotSimState.phase === 'DELIVERY FAILED' ? "#64748b" : (iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981")} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} />`;
content = content.replace(oldB1, newB1);

const oldB2 = `<IotBeacon lat={12.0} lon={72.0} color={iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} onPointerEnter={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} onPointerLeave={() => setIotPopupPos(null)} />`;
const newB2 = `<IotBeacon lat={12.0} lon={72.0} color={iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} />`;
content = content.replace(oldB2, newB2);

// 2. Restore X close buttons
const oldGatewayPopup = `<span className="text-cyan-400 font-bold">GATEWAY #01</span>
                            </div>`;
const newGatewayPopup = `<span className="text-cyan-400 font-bold">GATEWAY #01</span>
                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white/50 hover:text-white cursor-pointer pointer-events-auto">✕</button>
                            </div>`;
content = content.replace(oldGatewayPopup, newGatewayPopup);

const oldB1Popup = `<span className="text-orange-400 font-bold">FISHERMAN VESSEL #402</span>
                            </div>`;
const newB1Popup = `<span className="text-orange-400 font-bold">FISHERMAN VESSEL #402</span>
                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white/50 hover:text-white cursor-pointer pointer-events-auto">✕</button>
                            </div>`;
content = content.replace(oldB1Popup, newB1Popup);

const oldB2Popup = `<span className="text-sky-400 font-bold">TOURIST BOAT #77</span>
                            </div>`;
const newB2Popup = `<span className="text-sky-400 font-bold">TOURIST BOAT #77</span>
                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white/50 hover:text-white cursor-pointer pointer-events-auto">✕</button>
                            </div>`;
content = content.replace(oldB2Popup, newB2Popup);

fs.writeFileSync(file, content);
console.log('Hover removed and X buttons restored');
