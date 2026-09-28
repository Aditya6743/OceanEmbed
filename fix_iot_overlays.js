const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will just replace the entire IotOverlays component (lines 338-436) with the correct one.
// Let's use a regex to slice it out.
const startMarker = 'export const IotOverlays = ({ simState, handleIotAck }: any) => {';
const endMarker = 'export const IotRightView = ({ simState, handleIotAck, onClose }: any) => {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find markers");
    process.exit(1);
}

const newOverlays = `export const IotOverlays = ({ simState, handleIotAck }: any) => {
    const isAlert = simState.step >= 7;
    const isAck = simState.phase === 'ACKNOWLEDGED';
    const isFail = simState.phase === 'DELIVERY FAILED';

    return (
        <div className="absolute inset-0 pointer-events-none z-20">
            {/* Top Status Banner */}
            {simState.isRunning && !isAck && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-[10px] font-mono tracking-[0.2em] shadow-[0_0_15px_rgba(34,211,238,0.2)] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        {simState.step < 6 ? 'ANALYZING TELEMETRY...' : 'BROADCASTING WARNING...'}
                    </div>
                </div>
            )}

            {/* Notification Popups Overlay */}
            {isAlert && !isAck && !isFail && (
                <div className="absolute top-16 right-8 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500">
                    <div className="bg-black/90 backdrop-blur-md border border-red-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] min-w-[280px]">
                        <div className="flex items-center gap-2 text-red-400 font-bold tracking-widest text-[10px] mb-2">
                            <Bell size={14} className="animate-pulse" /> CRITICAL ALERT DISPATCHED
                        </div>
                        <div className="text-[10px] font-mono text-slate-300 flex flex-col gap-1">
                            <div className="flex justify-between"><span className="text-slate-500">TYPE</span><span className="text-orange-400">CYCLONE</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">SEVERITY</span><span className="text-red-400">HIGH</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">SOURCE</span><span className="text-indigo-400">OCEANEMBED V6</span></div>
                            <div className="flex justify-between mt-2 pt-2 border-t border-white/5"><span className="text-slate-500">STATUS</span><span className="text-cyan-400 animate-pulse">{simState.step >= 6 ? 'DELIVERED' : 'BROADCASTING'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Row Container: Absolute inset on mobile, relative bottom-anchored flex on desktop */}
            <div className="absolute inset-0 md:inset-auto md:bottom-10 md:left-8 md:right-12 md:flex md:justify-between md:items-end pointer-events-none">
                
                {/* Left side of the globe section: Fisherman */}
                <div className="absolute bottom-2 left-2 md:static pointer-events-auto scale-[0.55] md:scale-100 origin-bottom-left">
                    <div className="w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl bg-black/80 border-slate-700/50">
                        <div className="p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b bg-white/5 border-white/5 text-slate-400">
                            <div className="flex items-center gap-1.5"><RadioReceiver size={14} /> MARINE PAGER <span className="text-[7px] border border-current opacity-70 px-1 rounded tracking-normal ml-0.5">LORA / NO-WIFI</span></div>
                            {isFail ? <span>OFFLINE</span> : isAlert ? <span className="animate-pulse text-orange-400">⚠ ALERT</span> : <span>CONNECTED</span>}
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
                                    <div className="text-[11px] text-center text-white bg-red-600/80 rounded py-1.5 font-sans font-bold tracking-wider border border-red-500/50">ACTION: RETURN TO SAFE ZONE</div>
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
                </div>

                {/* Right side of the globe section: Coastal Warning Station */}
                <div className="absolute bottom-2 right-2 md:static pointer-events-auto scale-[0.55] md:scale-100 origin-bottom-right">
                    <div className="w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl bg-black/80 border-slate-700/50">
                        <div className="p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b bg-white/5 border-white/5 text-slate-400">
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
        </div>
    );
};
`;

const finalContent = content.substring(0, startIndex) + newOverlays + '\n' + content.substring(endIndex);
fs.writeFileSync(file, finalContent);
console.log('Completely rebuilt the overlays with proper layout scaling.');
