const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to extract the overlay logic into an exported component IotOverlays
const overlaysBlock = `export const IotOverlays = ({ simState, handleIotAck }: any) => {
    const isAlert = simState.step >= 7 && simState.phase !== 'ACKNOWLEDGED';
    const isAck = simState.phase === 'ACKNOWLEDGED';
    const isFail = simState.phase === 'DELIVERY FAILED';
    
    return (
        <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between overflow-hidden">
            <div className="self-end pointer-events-auto mt-12 mr-6">
                {simState.step >= 4 && (
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-4 w-64 shadow-2xl animate-in slide-in-from-top-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2 mb-2">ALERT PACKET</div>
                        <div className="font-mono text-[10px] flex flex-col gap-1.5">
                            <div className="flex justify-between"><span className="text-slate-500">ID</span><span className="text-slate-200">OCN-26066-042</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">TYPE</span><span className="text-orange-400">CYCLONE</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">SEVERITY</span><span className="text-red-400">HIGH</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">SOURCE</span><span className="text-indigo-400">OCEANEMBED V6</span></div>
                            <div className="flex justify-between mt-2 pt-2 border-t border-white/5"><span className="text-slate-500">STATUS</span><span className="text-cyan-400 animate-pulse">{simState.step >= 6 ? 'DELIVERED' : 'BROADCASTING'}</span></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center items-stretch gap-6 pointer-events-none mb-6 pl-[340px]">
                {/* Fisherman Device */}
                <div className={\`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 pointer-events-auto shadow-2xl \${isFail ? 'bg-slate-900/90 border-slate-700 opacity-80' : isAlert ? 'bg-orange-950/90 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.4)]' : 'bg-slate-950/90 border-slate-700'}\`}>
                    <div className={\`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b \${isFail ? 'bg-slate-800 border-slate-700 text-slate-500' : isAlert ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/5 text-slate-400'}\`}>
                        <div className="flex items-center gap-1.5"><RadioReceiver size={14} /> MARINE PAGER <span className="text-[7px] border border-current opacity-70 px-1 rounded tracking-normal ml-0.5">LORA / NO-WIFI</span></div>
                        {isFail ? <span>OFFLINE</span> : isAlert ? <span className="animate-pulse">⚠ ALERT</span> : <span>CONNECTED</span>}
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
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-500">SIGNAL</span><span className="text-slate-300">{simState.step >= 6 ? "██░░░░░░░░" : "████████░░"}</span></div>
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-500">BATTERY</span><span className="text-slate-300">{(87 - simState.step)}%</span></div>
                            </>
                        )}
                        
                        {isAlert && !isAck && (
                            <button onClick={handleIotAck} className="mt-2 py-2 w-full rounded border border-orange-400 text-orange-400 text-[10px] font-bold hover:bg-orange-400 hover:text-black transition-colors pointer-events-auto">
                                ACKNOWLEDGE ALERT
                            </button>
                        )}
                        {isAck && (
                            <div className="mt-2 py-2 text-center text-emerald-400 text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 rounded flex items-center justify-center gap-1">
                                <CheckCircle2 size={12}/> ACKNOWLEDGED
                            </div>
                        )}
                    </div>
                </div>

                {/* Coastal Warning Station */}
                <div className={\`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 pointer-events-auto shadow-2xl \${simState.step >= 8 && !isAck ? 'bg-red-950/90 border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.4)]' : 'bg-slate-950/90 border-slate-700'}\`}>
                    <div className={\`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b \${simState.step >= 8 && !isAck ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-white/5 border-white/5 text-slate-400'}\`}>
                        <div className="flex items-center gap-2"><ShieldAlert size={14} /> COASTAL WARNING STATION</div>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-center gap-3 font-mono">
                        {simState.step >= 8 && !isAck ? (
                            <>
                                <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm mb-1 animate-pulse">
                                    <Bell size={16} /> WARNING ACTIVE
                                </div>
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
            </div>
        </div>
    );
};
`;

// Insert the new component right before export const IotRightView
content = content.replace("export const IotRightView = ({ simState, handleIotAck, onClose }: any) => {", overlaysBlock + "\n\nexport const IotRightView = ({ simState, handleIotAck, onClose }: any) => {");

// Remove the inline Overlays block from IotRightView and use <IotOverlays /> instead
const overlaysStart = "{/* Overlays */}";
const overlaysEnd = "            {/* Global Keyframes for dashed line animation */}";

const startIdx = content.lastIndexOf(overlaysStart);
const endIdx = content.lastIndexOf(overlaysEnd);

if (startIdx !== -1 && endIdx !== -1) {
    const p1 = content.substring(0, startIdx);
    const p2 = content.substring(endIdx);
    content = p1 + "<IotOverlays simState={simState} handleIotAck={handleIotAck} />\n\n" + p2;
}

fs.writeFileSync(file, content);
console.log('Extracted IotOverlays component');
