const fs = require('fs');

// 1. Update Solutions.tsx
let fSol = 'frontend/src/pages/Solutions.tsx';
let cSol = fs.readFileSync(fSol, 'utf8');

cSol = cSol.replace(
  "import { IotLeftPanel, IotRightView, useIotSimulation } from '../components/IotBeaconsPanel';",
  "import { IotLeftPanel, IotRightView, IotOverlays, useIotSimulation } from '../components/IotBeaconsPanel';"
);

cSol = cSol.replace(
  /<Canvas className="w-full h-full"/,
  "{!is2DMode && activeTab === 'iot' && <IotOverlays simState={simState} handleIotAck={handleIotAck} />}\n          <Canvas className=\"w-full h-full\""
);

fs.writeFileSync(fSol, cSol);


// 2. Update DigitalTwinGlobe.tsx
let fGlobe = 'frontend/src/components/DigitalTwinGlobe.tsx';
let cGlobe = fs.readFileSync(fGlobe, 'utf8');

const targetBlock = cGlobe.substring(cGlobe.indexOf("{/* IOT HARDWARE BEACONS */}"), cGlobe.indexOf("<directionalLight position={[10, 5, 10]}"));

const newIotBlock = `{/* IOT HARDWARE BEACONS */}
      {viewMode === 'iot' && (
        <group>
          <IotBeacon lat={18.92} lon={72.82} color={iotSimState && iotSimState.step >= 8 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} />
          <IotBeacon lat={17.5} lon={70.0} color={iotSimState && iotSimState.phase === 'DELIVERY FAILED' ? "#64748b" : (iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981")} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} />
          <IotBeacon lat={15.0} lon={71.5} color={iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} />
        
        {iotPopupPos && !is2DMode && iotSimState && (() => {
            const isAlert = iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED';
            const isAck = iotSimState.phase === 'ACKNOWLEDGED';
            const isFail = iotSimState.phase === 'DELIVERY FAILED';

            if (iotPopupPos.id === 'gateway') {
                return (
                    <Html position={iotPopupPos.point} center zIndexRange={[100, 0]}>
                        <div className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl pointer-events-auto min-w-[150px]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-cyan-400 font-bold">GATEWAY #01</span>
                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white/50 hover:text-white">✕</button>
                            </div>
                            <div>MUMBAI HUB</div>
                            <div className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded my-1 w-fit border border-emerald-500/30">LoRaWAN (No WiFi Req)</div>
                            <div>STATUS: <span className={isAck ? 'text-cyan-400' : iotSimState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : iotSimState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></div>
                        </div>
                    </Html>
                );
            }
            if (iotPopupPos.id === 'b1') {
                return (
                    <Html position={iotPopupPos.point} center zIndexRange={[100, 0]}>
                        <div className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl pointer-events-auto min-w-[170px]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-orange-400 font-bold">FISHERMAN VESSEL #402</span>
                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white/50 hover:text-white">✕</button>
                            </div>
                            <div>STATUS: <span className={isFail ? 'text-slate-500' : isAlert ? 'text-red-400' : 'text-emerald-400'}>{isFail ? 'OFFLINE' : isAlert ? 'EVACUATE' : 'ONLINE'}</span></div>
                            <div>LAT: 17.5000</div>
                            <div>LON: 70.0000</div>
                            <div>SIGNAL: {isFail ? '--' : '-67 dBm'}</div>
                            <div>BATTERY: 87%</div>
                        </div>
                    </Html>
                );
            }
            if (iotPopupPos.id === 'b2') {
                return (
                    <Html position={iotPopupPos.point} center zIndexRange={[100, 0]}>
                        <div className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl pointer-events-auto min-w-[150px]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sky-400 font-bold">TOURIST BOAT #77</span>
                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white/50 hover:text-white">✕</button>
                            </div>
                            <div>STATUS: <span className={isAlert ? 'text-red-400' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></div>
                            <div>LAT: 15.0000</div>
                            <div>LON: 71.5000</div>
                            <div>SIGNAL: -72 dBm</div>
                            <div>BATTERY: 92%</div>
                        </div>
                    </Html>
                );
            }
            return null;
        })()}

        </group>
      )}

      `;

cGlobe = cGlobe.replace(targetBlock, newIotBlock);
fs.writeFileSync(fGlobe, cGlobe);
console.log('Fixed solutions overlays and globe popups');
