const fs = require('fs');

// 1. Update Solutions.tsx to pass iotSimState and handleIotAck
let fSol = 'frontend/src/pages/Solutions.tsx';
let cSol = fs.readFileSync(fSol, 'utf8');
cSol = cSol.replace(
  /<DigitalTwinGlobe viewMode=\{activeTab as any\} climateSubMode=\{climateMode\} isRotationLocked=\{isRotationLocked\} onRequest2D=\{\(\) => setIs2DMode\(true\)\} is2DMode=\{is2DMode\} \/>/g,
  '<DigitalTwinGlobe viewMode={activeTab as any} climateSubMode={climateMode} isRotationLocked={isRotationLocked} onRequest2D={() => setIs2DMode(true)} is2DMode={is2DMode} iotSimState={simState} onIotAck={handleIotAck} />'
);
fs.writeFileSync(fSol, cSol);


// 2. Update DigitalTwinGlobe.tsx
let fGlobe = 'frontend/src/components/DigitalTwinGlobe.tsx';
let cGlobe = fs.readFileSync(fGlobe, 'utf8');

cGlobe = cGlobe.replace(
  /export default function DigitalTwinGlobe\(\{ viewMode = 'climate', climateSubMode = 'cyclone', onRequest2D, is2DMode \}: \{ viewMode\?: 'navy' \| 'fishery' \| 'climate' \| 'cable' \| 'enso' \| 'iot' \| 'sar', climateSubMode\?: 'cyclone' \| 'flood' \| 'heatwave' \| 'erosion', isRotationLocked\?: boolean, onRequest2D\?: \(\) => void, is2DMode\?: boolean \}\) \{/,
  "export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onRequest2D, is2DMode, iotSimState, onIotAck }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onRequest2D?: () => void, is2DMode?: boolean, iotSimState?: any, onIotAck?: () => void }) {"
);

// We need to import Lucide icons for the popups
const importLucide = `import { Calendar, Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun, Lock, Unlock, RadioReceiver, CheckCircle2, ShieldAlert, Bell, Wifi } from 'lucide-react';\n`;
if (!cGlobe.includes('RadioReceiver')) {
    cGlobe = cGlobe.replace("import { Line, Html } from '@react-three/drei';", "import { Line, Html } from '@react-three/drei';\n" + importLucide);
}

// Change iotPopupPos state
cGlobe = cGlobe.replace(
  /const \[iotPopupPos, setIotPopupPos\] = useState<THREE\.Vector3 \| null>\(null\);/,
  "const [iotPopupPos, setIotPopupPos] = useState<{point: THREE.Vector3, id: string} | null>(null);"
);

// Fix unmounting click handler
cGlobe = cGlobe.replace(
  /setIotPopupPos\(null\);/g,
  "setIotPopupPos(null);"
);

// Replace IOT BEACONS render block
const targetIotBlock = `{/* IOT HARDWARE BEACONS */}
      {viewMode === 'iot' && (
        <group>
          {/* Mumbai Siren */}
          <IotBeacon lat={18.922} lon={72.8347} color="#f43f5e" onClick={(e) => setIotPopupPos(e.point)} />
          {/* Offline Fisherman at Sea */}
          <IotBeacon lat={15.5} lon={68.0} color="#f43f5e" onClick={(e) => setIotPopupPos(e.point)} />
          {/* Coast Guard Terminal (Chennai) */}
          <IotBeacon lat={13.0827} lon={80.2707} color="#38bdf8" onClick={(e) => setIotPopupPos(e.point)} />
          {/* Additional Coastal Sensors */}
          <IotBeacon lat={22.309} lon={70.802} color="#10b981" onClick={(e) => setIotPopupPos(e.point)} />
          <IotBeacon lat={8.524} lon={76.936} color="#10b981"  />
        
        {iotPopupPos && !is2DMode && (
          <Html position={iotPopupPos} center zIndexRange={[100, 0]}>
            <div className="bg-black/90 border border-cyan-500/50 p-3 rounded-lg backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in duration-200 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex flex-col items-center gap-2 pointer-events-auto">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase">IoT Beacon Selected</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); onRequest2D && onRequest2D(); }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded text-[10px] font-black tracking-widest transition-colors w-full"
              >
                VIEW TACTICAL FEED
              </button>
            </div>
          </Html>
        )}
        </group>
      )}`;

const newIotBlock = `{/* IOT HARDWARE BEACONS */}
      {viewMode === 'iot' && (
        <group>
          <IotBeacon lat={18.92} lon={72.82} color={iotSimState && iotSimState.step >= 8 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} />
          <IotBeacon lat={17.5} lon={70.0} color={iotSimState && iotSimState.phase === 'DELIVERY FAILED' ? "#64748b" : (iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#f97316" : "#10b981")} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} />
          <IotBeacon lat={15.0} lon={71.5} color={iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} />
        
        {iotPopupPos && !is2DMode && iotSimState && (() => {
            const isAlert = iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED';
            const isAck = iotSimState.phase === 'ACKNOWLEDGED';
            const isFail = iotSimState.phase === 'DELIVERY FAILED';

            if (iotPopupPos.id === 'gateway') {
                return (
                    <Html position={iotPopupPos.point} center zIndexRange={[100, 0]}>
                        <div className={\`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.8)] \${iotSimState.step >= 8 && !isAck ? 'bg-red-950/90 border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.4)]' : 'bg-slate-950/90 border-slate-700'}\`}>
                            <div className={\`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b \${iotSimState.step >= 8 && !isAck ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-white/5 border-white/5 text-slate-400'}\`}>
                                <div className="flex items-center gap-2"><ShieldAlert size={14} /> COASTAL WARNING STATION</div>
                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white bg-white/20 hover:bg-white/40 rounded px-1.5 py-0.5 ml-2 transition-colors text-[8px]">CLOSE</button>
                            </div>
                            <div className="p-4 flex flex-col flex-1 justify-center gap-3 font-mono">
                                {iotSimState.step >= 8 && !isAck ? (
                                    <>
                                        <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm mb-1 animate-pulse"><Bell size={16} /> WARNING ACTIVE</div>
                                        <div className="bg-black/50 rounded p-2 text-xs border border-red-500/20">
                                            <div className="text-red-400 mb-1">HAZARD: TROPICAL CYCLONE</div>
                                            <div className="flex justify-between text-slate-300"><span>SEVERITY</span><span className="text-red-400">CRITICAL</span></div>
                                            <div className="flex justify-between text-slate-300"><span>BEACONS</span><span>02 NOTIFIED</span></div>
                                        </div>
                                        <div className="text-[11px] text-center text-red-400 border border-red-500/30 bg-red-500/10 rounded py-1.5 font-sans font-bold tracking-wider animate-pulse">SIREN: ACTIVE</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">LOCATION</span><span className="text-slate-300">MUMBAI COAST</span></div>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">STATUS</span><span className="text-slate-300">STANDBY</span></div>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">SIREN</span><span className="text-slate-600">INACTIVE</span></div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Html>
                );
            }
            if (iotPopupPos.id === 'b1') {
                return (
                    <Html position={iotPopupPos.point} center zIndexRange={[100, 0]}>
                        <div className={\`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.8)] \${isFail ? 'bg-slate-900/90 border-slate-700 opacity-80' : isAlert ? 'bg-orange-950/90 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.4)]' : 'bg-slate-950/90 border-slate-700'}\`}>
                            <div className={\`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b \${isFail ? 'bg-slate-800 border-slate-700 text-slate-500' : isAlert ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/5 text-slate-400'}\`}>
                                <div className="flex items-center gap-1.5"><RadioReceiver size={14} /> MARINE PAGER <span className="text-[7px] border border-current opacity-70 px-1 rounded tracking-normal ml-0.5">FISHERMAN #402</span></div>
                                <div className="flex items-center">
                                    {isFail ? <span>OFFLINE</span> : isAlert ? <span className="animate-pulse">⚠ ALERT</span> : <span>CONNECTED</span>}
                                    <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white bg-white/20 hover:bg-white/40 rounded px-1.5 py-0.5 ml-2 transition-colors text-[8px]">CLOSE</button>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1 justify-center gap-3 font-mono">
                                {isFail ? (
                                    <div className="text-red-400 text-center text-xs py-8">CONNECTION LOST</div>
                                ) : isAlert ? (
                                    <>
                                        <div className="text-orange-400 font-bold text-sm text-center mb-1 animate-pulse">TROPICAL CYCLONE DETECTED</div>
                                        <div className="bg-black/50 rounded p-2 text-xs border border-orange-500/20">
                                            <div className="flex justify-between text-slate-300"><span>SEVERITY</span><span className="text-orange-400">HIGH</span></div>
                                            <div className="flex justify-between text-slate-300"><span>DISTANCE</span><span>42 NM</span></div>
                                            <div className="flex justify-between text-slate-300"><span>DIRECTION</span><span>NNE</span></div>
                                        </div>
                                        <div className="text-[11px] text-center text-white bg-red-600/80 rounded py-1.5 font-sans font-bold tracking-wider border border-red-500">ACTION: RETURN TO SAFE ZONE</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">OCEAN STATUS</span><span className="text-emerald-400">NORMAL</span></div>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">SIGNAL</span><span className="text-slate-300">{iotSimState.step >= 6 ? "██░░░░░░░░" : "████████░░"}</span></div>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">BATTERY</span><span className="text-slate-300">{(87 - iotSimState.step)}%</span></div>
                                    </>
                                )}
                                {isAlert && !isAck && (
                                    <button onClick={(e) => { e.stopPropagation(); onIotAck && onIotAck(); }} className="mt-2 py-2 w-full rounded border border-orange-400 text-orange-400 text-[10px] font-bold hover:bg-orange-400 hover:text-black transition-colors pointer-events-auto">ACKNOWLEDGE ALERT</button>
                                )}
                                {isAck && (
                                    <div className="mt-2 py-2 text-center text-emerald-400 text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 rounded flex items-center justify-center gap-1"><CheckCircle2 size={12}/> ACKNOWLEDGED</div>
                                )}
                            </div>
                        </div>
                    </Html>
                );
            }
            if (iotPopupPos.id === 'b2') {
                return (
                    <Html position={iotPopupPos.point} center zIndexRange={[100, 0]}>
                        <div className={\`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.8)] \${isAlert ? 'bg-orange-950/90 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.4)]' : 'bg-slate-950/90 border-slate-700'}\`}>
                            <div className={\`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b \${isAlert ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/5 text-slate-400'}\`}>
                                <div className="flex items-center gap-1.5"><RadioReceiver size={14} /> MARINE PAGER <span className="text-[7px] border border-current opacity-70 px-1 rounded tracking-normal ml-0.5">TOURIST #77</span></div>
                                <div className="flex items-center">
                                    {isAlert ? <span className="animate-pulse">⚠ ALERT</span> : <span>CONNECTED</span>}
                                    <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white bg-white/20 hover:bg-white/40 rounded px-1.5 py-0.5 ml-2 transition-colors text-[8px]">CLOSE</button>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1 justify-center gap-3 font-mono">
                                {isAlert ? (
                                    <>
                                        <div className="text-orange-400 font-bold text-sm text-center mb-1 animate-pulse">TROPICAL CYCLONE DETECTED</div>
                                        <div className="bg-black/50 rounded p-2 text-xs border border-orange-500/20">
                                            <div className="flex justify-between text-slate-300"><span>SEVERITY</span><span className="text-orange-400">HIGH</span></div>
                                            <div className="flex justify-between text-slate-300"><span>DISTANCE</span><span>24 NM</span></div>
                                            <div className="flex justify-between text-slate-300"><span>DIRECTION</span><span>N</span></div>
                                        </div>
                                        <div className="text-[11px] text-center text-white bg-red-600/80 rounded py-1.5 font-sans font-bold tracking-wider border border-red-500">ACTION: EVACUATE IMMEDIATELY</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">OCEAN STATUS</span><span className="text-emerald-400">NORMAL</span></div>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">SIGNAL</span><span className="text-slate-300">{iotSimState.step >= 6 ? "██░░░░░░░░" : "██████████"}</span></div>
                                        <div className="flex justify-between items-center text-xs"><span className="text-slate-500">BATTERY</span><span className="text-slate-300">{(92 - iotSimState.step)}%</span></div>
                                    </>
                                )}
                                {isAlert && !isAck && (
                                    <button onClick={(e) => { e.stopPropagation(); onIotAck && onIotAck(); }} className="mt-2 py-2 w-full rounded border border-orange-400 text-orange-400 text-[10px] font-bold hover:bg-orange-400 hover:text-black transition-colors pointer-events-auto">ACKNOWLEDGE ALERT</button>
                                )}
                                {isAck && (
                                    <div className="mt-2 py-2 text-center text-emerald-400 text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 rounded flex items-center justify-center gap-1"><CheckCircle2 size={12}/> ACKNOWLEDGED</div>
                                )}
                            </div>
                        </div>
                    </Html>
                );
            }
        })()}
        </group>
      )}`;

cGlobe = cGlobe.replace(targetIotBlock, newIotBlock);
fs.writeFileSync(fGlobe, cGlobe);
console.log('Fixed IoT 3D UI');
