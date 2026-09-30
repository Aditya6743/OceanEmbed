import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Bell, RadioReceiver, Activity, Wifi, ArrowLeft, Radio } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Tooltip } from 'react-leaflet';
import { useOceanStore } from '../store/oceanStore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Node Icon
const createNodeIcon = (color: string) => L.divIcon({
  className: 'custom-node-icon',
  html: `<div style="width: 14px; height: 14px; background-color: ${color}; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px ${color};"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});
const iconOnline = createNodeIcon('#10b981');
const iconAlert = createNodeIcon('#ef4444');
const iconOffline = createNodeIcon('#64748b');

export const useIotSimulation = (activeTab: string) => {
    const [simState, setSimState] = useState({ 
        isRunning: false, 
        step: 0, 
        phase: 'READY',
        isFailureTest: false, isMuted: false
    });
    const [iotLogs, setIotLogs] = useState<any[]>([]);

    const addLog = (msg: string, type: string = 'info') => {
        setIotLogs(prev => [...prev, { time: new Date().toISOString().substring(11, 19), message: msg, type }]);
    };

    useEffect(() => {
        if (activeTab === 'iot' && iotLogs.length === 0) {
           addLog("IoT Gateway connection established", "success");
           addLog("Listening for OceanEmbed anomalies...", "info");
        }
    }, [activeTab]);

    const runSimulation = (failureTest = false, isMuted = false) => {
        if (simState.isRunning) return;
        setSimState({ isRunning: true, step: 0, phase: 'ANALYZING', isFailureTest: failureTest, isMuted: isMuted });
        setIotLogs([]);
        addLog(failureTest ? "SIMULATION (FAILURE TEST): Ocean analysis started" : "SIMULATION: Ocean analysis started", "info");
        
        const phases = [
            'READY', 'ANALYZING', 'ANOMALY DETECTED', 'MODEL CONFIRMED', 'ALERT CREATED',
            'API BROADCAST', 'GATEWAY ACKNOWLEDGED', 'MARINE BEACON ALERT', 'COASTAL WARNING ACTIVE', 'ACKNOWLEDGED'
        ];

        let currentStep = 0;
        let failureResolved = false;

        const interval = setInterval(() => {
            currentStep++;

            // Handle Failure Injection
            if (failureTest && currentStep === 7 && !failureResolved) {
                setSimState(prev => ({ ...prev, step: currentStep, phase: 'DELIVERY FAILED' }));
                addLog("ERROR: MARINE BEACON #402 OFFLINE", "error");
                addLog("DELIVERY FAILED. RETRYING...", "error");
                
                setTimeout(() => {
                    addLog("CONNECTION RESTORED", "success");
                    failureResolved = true;
                    // Resume after 2s
                }, 2000);
                return; // Pause the main loop
            }

            if (failureTest && currentStep === 7 && failureResolved) {
                // Resume normally once resolved
                currentStep = 7;
                failureTest = false; // clear it so we continue
            }

            if (currentStep < phases.length - 1) {
                const newPhase = phases[currentStep];
                setSimState(prev => ({ ...prev, step: currentStep, phase: newPhase }));
                
                if (currentStep === 2) addLog("SIMULATION: Anomaly detected (SST/OHC Spike)", "alert");
                if (currentStep === 3) addLog("SIMULATION: V6 Engine confirmed extreme risk", "info");
                if (currentStep === 4) addLog("SIMULATION: Alert generated (ID: OCN-26066-042)", "info");
                if (currentStep === 5) addLog("SIMULATION: Pinging GET /api/iot/pager/FISH_404", "info");
                if (currentStep === 6) { 
                    addLog("SIMULATION: Gateway acknowledged payload", "success");
                    fetch(`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:8000'}/api/iot/pager/FISH_404?lat=18.92&lon=72.82`).catch(() => {});
                }
                if (currentStep === 7) {
                    addLog("SIMULATION: Marine Pager active", "alert");
                    if (!isMuted) {
                        try {
                            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                            const osc = ctx.createOscillator();
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(800, ctx.currentTime);
                            osc.connect(ctx.destination);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.3);
                            setTimeout(() => {
                                const osc2 = ctx.createOscillator();
                                osc2.type = 'sine';
                                osc2.frequency.setValueAtTime(800, ctx.currentTime);
                                osc2.connect(ctx.destination);
                                osc2.start();
                                osc2.stop(ctx.currentTime + 0.3);
                            }, 400);
                        } catch(e) {}
                    }
                }
                if (currentStep === 8) {
                    addLog("SIMULATION: Coastal Warning active", "alert");
                    clearInterval(interval);
                    setSimState(prev => ({ ...prev, isRunning: false }));
                }
            }
        }, 1200);
    };

    const handleIotAck = () => {
        setSimState(prev => ({ ...prev, phase: 'ACKNOWLEDGED' }));
        addLog("USER: Alerts formally acknowledged.", "success");
    };

    const resetSimulation = () => {
        setSimState({ isRunning: false, step: 0, phase: 'READY', isFailureTest: false, isMuted: false });
        setIotLogs([]);
        addLog("SYSTEM RESET: Online and listening", "success");
    };

    const toggleMute = () => setSimState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    return { simState, iotLogs, runSimulation, handleIotAck, resetSimulation, toggleMute };
};


export const IotLeftPanel = ({ simState, runSimulation, resetSimulation, iotLogs, toggleMute }: any) => {
    // We already injected the vars before, so let's just make sure they are used.
    
        
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="mb-4 shrink-0">
                <h2 className="text-cyan-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Radio size={20}/> IOT BEACONS</h2>
                <p className="text-slate-400 text-[10px] mt-1 leading-relaxed uppercase">Edge alert infrastructure connecting OceanEmbed intelligence to marine and coastal warning systems.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
                
                {/* Network Status */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-3 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Status</span>
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>
                            ONLINE
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-900/50 rounded border border-white/5 p-2 text-center flex flex-col justify-center">
                            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Active Nodes</div>
                            <div className="text-sm font-mono text-white font-bold">02</div>
                        </div>
                        <div className="bg-slate-900/50 rounded border border-white/5 p-2 text-center flex flex-col justify-center">
                            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Gateway Hubs</div>
                            <div className="text-sm font-mono text-white font-bold">01</div>
                        </div>
                        <div className="bg-slate-900/50 rounded border border-white/5 p-2 text-center flex flex-col justify-center">
                            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Protocol</div>
                            <div className="text-[10px] font-mono text-emerald-400 font-bold">LoRaWAN</div>
                        </div>
                        <div className="bg-slate-900/50 rounded border border-white/5 p-2 text-center flex flex-col justify-center">
                            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">RF Frequency</div>
                            <div className="text-[10px] font-mono text-white font-bold">IN865</div>
                        </div>
                        <div className="bg-slate-900/50 rounded border border-white/5 p-2 text-center flex flex-col justify-center">
                            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Encryption</div>
                            <div className="text-[10px] font-mono text-white font-bold">AES-128</div>
                        </div>
                        <div className="bg-slate-900/50 rounded border border-white/5 p-2 text-center flex flex-col justify-center">
                            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Max Range</div>
                            <div className="text-[10px] font-mono text-white font-bold">65 KM</div>
                        </div>
                    </div>
                </div>

                {/* Architecture - Horizontal Layout */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 py-6 md:p-6 md:py-12 min-h-[200px] md:min-h-[350px] flex flex-col justify-center shrink-0 relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-6 relative z-10">Live System Architecture</span>

                    <div className="flex items-center justify-between w-full relative z-10">

                        {/* Box 1: Data Source */}
                        <div className="flex flex-col items-center z-10 w-[20%] relative">
                            <div className="absolute -top-4 text-[6px] text-slate-400 border border-slate-700 px-1 py-0.5 rounded bg-black tracking-widest uppercase">DATA SOURCE</div>
                            <div className="border border-blue-500/30 bg-blue-950/40 rounded-xl p-1 py-2 md:p-3 md:py-6 min-h-[60px] md:min-h-[160px] w-full flex flex-col justify-center items-center text-center shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                               <Activity size={12} className="text-blue-400 mb-1" />
                               <div className="text-[7px] font-bold text-white leading-tight">SATELLITE</div>
                               <div className="text-[5px] text-blue-400 mt-1 uppercase">Live Telemetry</div>
                            </div>
                        </div>

                        {/* Line */}
                        <div className="flex-1 h-[1px] bg-slate-700 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 border-t border-r border-slate-500 rotate-45"></div>
                        </div>

                        {/* Box 2: Core Intelligence (Dynamic) */}
                        <div className="flex flex-col items-center z-10 w-[38%] relative">
                            <div className="absolute -top-4 text-[6px] text-red-400/80 border border-red-500/30 px-1 py-0.5 rounded bg-black tracking-widest uppercase">CORE INTELLIGENCE</div>
                            <div className={`border rounded-xl p-1.5 py-3 md:p-4 md:py-8 min-h-[100px] md:min-h-[220px] w-full flex flex-col items-center justify-center text-center transition-all duration-500 ${simState.step >= 2 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)] bg-red-950/40' : 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)] bg-indigo-950/40'}`}>
                               <Activity size={14} className={simState.step >= 2 ? 'text-red-400 mb-1 animate-pulse' : 'text-indigo-400 mb-1'} />
                               <div className="text-[9px] font-black text-white tracking-widest">OCEANEMBED V6</div>
                               <div className={`text-[6px] font-bold mt-1 px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${simState.step >= 2 ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                   {simState.step >= 2 ? 'Critical Anomaly' : 'Sys Active'}
                               </div>

                               {/* Mini Terminal inside Box */}
                               <div className="mt-2 text-left w-full bg-black/80 rounded border border-white/5 p-1.5 text-[5px] font-mono text-slate-400 leading-[1.6] overflow-hidden shadow-inner">
                                   <div className="text-emerald-400">{'>'} SYS_ACTIVE</div>
                                   <div className="opacity-80">{'>'} SCANNING GRID [18°N - 22°N]...</div>
                                   {simState.step >= 2 && <div className="text-cyan-400">{'>'} INFERENCE: {(95.0 + (simState.step % 4)).toFixed(1)}% PROBABILITY</div>}
                                   {simState.step >= 4 && <div className="text-orange-400">{'>'} GENERATING EVAC POLYGON...</div>}
                                   {simState.step >= 5 && <div className="text-red-400">{'>'} GET /api/iot/pager/FISH...</div>}
                               </div>
                            </div>
                        </div>

                        {/* Line */}
                        <div className="flex-1 h-[1px] bg-slate-700 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 border-t border-r border-slate-500 rotate-45"></div>
                        </div>

                        {/* Box 3: Gateway */}
                        <div className="flex flex-col items-center z-10 w-[15%] relative">
                            <div className="absolute -top-4 text-[6px] text-slate-400 border border-slate-700 px-1 py-0.5 rounded bg-black tracking-widest uppercase">GATEWAY</div>
                            <div className={`border rounded-xl p-1 py-2 md:p-3 md:py-6 min-h-[60px] md:min-h-[160px] w-full flex flex-col justify-center items-center text-center transition-all duration-500 ${simState.step >= 5 ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-950/20' : 'border-slate-700 bg-slate-900/50'}`}>
                               <Wifi size={10} className={simState.step >= 5 ? 'text-emerald-400 mb-1' : 'text-slate-500 mb-1'} />
                               <div className="text-[7px] font-bold text-white leading-tight">REST API</div>
                               <div className="text-[5px] text-emerald-400 mt-1 bg-emerald-500/10 border border-emerald-500/30 px-1 py-0.5 rounded text-center">LoRaWAN HUB</div>
                               <div className={`text-[5px] mt-1 uppercase ${simState.step >= 5 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                   {simState.step >= 5 ? 'Broadcasting' : 'Standby'}
                               </div>
                            </div>
                        </div>

                        {/* Line */}
                        <div className="w-3 h-[1px] bg-slate-700 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 border-t border-r border-slate-500 rotate-45"></div>
                        </div>

                        {/* Box 4: Endpoints */}
                        <div className="flex flex-col items-center z-10 w-[20%] relative">
                            <div className="absolute -top-5 text-[6px] text-slate-400 border border-slate-700 px-1 py-0.5 rounded bg-black tracking-widest uppercase whitespace-nowrap">ACTIVE ENDPOINTS</div>
                            <div className="flex flex-col gap-1 md:gap-4 w-full mt-1">
                                <div className={`border rounded-lg p-1 py-1.5 md:p-3 md:py-4 min-h-[36px] md:min-h-[72px] text-left transition-all flex flex-col justify-center ${simState.step >= 7 ? 'border-orange-500 bg-orange-950/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]' : 'border-slate-700 bg-slate-900/50'}`}>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <RadioReceiver size={7} className={simState.step >= 7 ? 'text-orange-400' : 'text-slate-500'}/>
                                        <div className="text-[5px] font-bold text-white leading-tight">MARINE PAGER<br/><span className="text-[4.5px] text-emerald-400">LoRaWAN (No WiFi)</span></div>
                                    </div>
                                    <div className={`text-[4px] uppercase ${simState.step >= 7 ? 'text-orange-400 animate-pulse' : 'text-slate-600'}`}>{simState.step >= 7 ? 'Vibrating' : 'Connected'}</div>
                                </div>
                                <div className={`border rounded-lg p-1 py-1.5 md:p-3 md:py-4 min-h-[36px] md:min-h-[72px] text-left transition-all flex flex-col justify-center ${simState.step >= 8 ? 'border-red-500 bg-red-950/30 shadow-[0_0_10px_rgba(220,38,38,0.15)]' : 'border-slate-700 bg-slate-900/50'}`}>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <ShieldAlert size={7} className={simState.step >= 8 ? 'text-red-400' : 'text-slate-500'}/>
                                        <div className="text-[5px] font-bold text-white">COASTAL SIREN</div>
                                    </div>
                                    <div className={`text-[4px] uppercase ${simState.step >= 8 ? 'text-red-400 animate-pulse' : 'text-slate-600'}`}>{simState.step >= 8 ? '120dB Active' : 'Standby'}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* API Endpoints */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-3 shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">IoT API</span>
                    <div className="flex flex-col gap-1.5">
                        {[
                            { method: 'GET', path: '/api/iot/pager/{device_id}', real: true, active: simState.step === 5 || simState.step === 6 || simState.step === 7 },
                            { method: 'GET', path: '/api/iot/city-gates/{city}', real: true, active: simState.step === 8 }
                        ].map((api, i) => (
                            <div key={i} className={`flex items-center justify-between p-1.5 rounded text-[9px] font-mono border transition-colors ${api.active ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/40 border-white/5 text-slate-400'}`}>
                                <div className="flex items-center gap-2">
                                    <span className={`${api.method === 'GET' ? 'text-emerald-400' : 'text-amber-400'}`}>{api.method}</span>
                                    <span>{api.path}</span>
                                </div>
                                {!api.real && <span className="text-[7px] px-1 bg-slate-800 rounded text-slate-500">PLANNED</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Event Stream */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-3 shrink-0 flex flex-col min-h-[120px]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center justify-between">
                        <span>Event Stream</span>
                        {simState.isRunning && <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1 rounded">SIMULATION</span>}
                    </span>
                    <div className="flex-1 overflow-y-auto font-mono text-[8px] flex flex-col gap-1 custom-scrollbar">
                        {iotLogs.map((log: any, i: number) => (
                            <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'alert' ? 'text-orange-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                <span className="text-slate-600 shrink-0">{log.time}</span>
                                <span>{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Controls */}
            <div className="shrink-0 mt-4 border-t border-white/10 pt-4 flex flex-col gap-2">
                <button 
                    onClick={() => runSimulation(false)}
                    disabled={simState.isRunning}
                    className={`w-full py-2.5 rounded text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 relative overflow-hidden ${simState.isRunning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-400/60 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.15)]'}`}
                >
                    {!simState.isRunning && <span className="absolute top-0 right-0 bg-black/40 text-[7px] px-1 py-0.5 rounded-bl">SIMULATION MODE</span>}
                    {simState.isRunning ? <span className="animate-pulse">SIMULATING...</span> : <><AlertTriangle size={12}/> RUN ALERT SIMULATION</>}
                </button>
                <button onClick={resetSimulation} className="w-full mb-2 py-1.5 rounded text-[9px] font-bold bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">RESET SIMULATION</button>
                <button onClick={() => toggleMute()} className="w-full py-1.5 rounded text-[9px] font-bold tracking-widest text-slate-400 hover:text-white border border-transparent hover:border-slate-800">
                    {simState.isMuted ? 'UNMUTE ALARM' : 'MUTE ALARM'}
                </button>
            </div>
        </div>
    );
};

export const IotOverlays = ({ simState, handleIotAck }: any) => {
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
                <div className="absolute top-24 md:top-[200px] right-2 md:right-6 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500 scale-[0.75] md:scale-100 origin-top-right z-[50]">
                    <div className="bg-black/90 backdrop-blur-md border border-red-500/50 p-3 md:p-4 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] min-w-[220px] md:min-w-[280px]">
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
                    <div className={`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl ${isFail ? "bg-black/80 border-slate-700 opacity-90" : isAlert ? "bg-black/80 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]" : "bg-black/80 border-slate-700/50"}`}>
                        <div className={`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b ${isFail ? "bg-white/5 border-slate-700/50 text-slate-500" : isAlert ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-white/5 border-white/5 text-slate-400"}`}>
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
                    <div className={`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl ${simState.step >= 8 && !isAck ? "bg-black/80 border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]" : "bg-black/80 border-slate-700/50"}`}>
                        <div className={`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b ${simState.step >= 8 && !isAck ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white/5 border-white/5 text-slate-400"}`}>
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
                                    <div className="flex justify-between items-center text-xs"><span className="text-slate-500">LOCATION</span><span className="text-slate-300">LOCAL COAST</span></div>
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

export const IotRightView = ({ simState, handleIotAck, onClose }: any) => {
  const store = useOceanStore();
  const baseLat = store.selectedLocation ? store.selectedLocation.latitude : 17.0;
  const baseLon = store.selectedLocation ? store.selectedLocation.longitude : 78.0;
    const b1 = [baseLat - 1.0, baseLon - 10.0];
  const b2 = [baseLat - 5.0, baseLon - 6.0];
    const gateway = [baseLat, baseLon];
  
    
    const [isLoadingMap, setIsLoadingMap] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsLoadingMap(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    // Beacon Coordinates
    
    
    
    
    const isAlert = simState.step >= 7 && simState.phase !== 'ACKNOWLEDGED';
    const isAck = simState.phase === 'ACKNOWLEDGED';
    const isFail = simState.phase === 'DELIVERY FAILED';

    const b1Icon = isAck ? iconOnline : isFail ? iconOffline : isAlert ? iconAlert : iconOnline;
    const b2Icon = isAck ? iconOnline : isAlert ? iconAlert : iconOnline;

    return (
    <div className="absolute inset-0 z-20 bg-slate-900 rounded-l-3xl overflow-hidden border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-500">
      <div className="absolute top-6 right-6 z-[1000] flex gap-3 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 pointer-events-auto">
           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
           <span className="text-emerald-400 font-mono text-xs font-bold tracking-widest">TACTICAL 2D LINK ACTIVE</span>
        </div>
        <button 
          onClick={onClose}
          className="bg-black/60 hover:bg-black/80 border border-white/10 hover:border-indigo-500/50 text-indigo-300 px-4 py-2 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg pointer-events-auto"
        >
          <ArrowLeft size={14} /> BACK TO 3D GLOBE
        </button>
      </div>
      <div className="w-full h-full relative bg-slate-900 overflow-hidden animate-in fade-in duration-500">
            {/* Cinematic Loading Overlay */}
            {isLoadingMap && (
                <div className="absolute inset-0 z-50 bg-[#060a12] flex flex-col items-center justify-center pointer-events-none transition-all duration-700">
                     <div className="w-12 h-12 border-[3px] border-cyan-950 border-t-cyan-400 border-l-cyan-400 rounded-full animate-spin mb-6 shadow-[0_0_40px_rgba(34,211,238,0.2)]"></div>
                     <div className="text-[11px] font-mono tracking-[0.3em] text-cyan-400 mb-2">INITIALIZING SATELLITE TELEMETRY</div>
                     <div className="text-[9px] font-mono tracking-widest text-slate-500 animate-pulse">ESTABLISHING LORAWAN HANDSHAKE...</div>
                </div>
            )}
            
            {/* 2D Leaflet Map */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLoadingMap ? 'opacity-0' : 'opacity-100'}`}>
                <MapContainer 
                    center={[baseLat, baseLon]} 
                    zoom={5} 
                    minZoom={4}
                    maxZoom={8}
                    maxBounds={[[-5.0, 45.0], [35.0, 105.0]]}
                    maxBoundsViscosity={1.0}
                    className="w-full h-full bg-[#191a1a]" 
                    zoomControl={false} 
                    attributionControl={false}
                >
                    <TileLayer url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" className="google-dark-terrain" attribution="&copy; Google Maps" />
                    
                    {/* Hazard Region Circle (Appears when anomaly detected) */}
                    {simState.step >= 2 && (
                        <Circle center={[14.5, 69.5] as any} radius={800000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }}>
                            <Popup>Hazard Detection Zone</Popup>
                        </Circle>
                    )}

                    {/* API Broadcast Lines */}
                    {simState.step >= 5 && (
                        <>
                            <Polyline positions={[gateway as any, b1 as any]} pathOptions={{ color: isFail ? '#64748b' : '#38bdf8', dashArray: '5, 5', weight: 2, className: 'animate-[dash_1s_linear_infinite]' }} />
                            <Polyline positions={[gateway as any, b2 as any]} pathOptions={{ color: '#38bdf8', dashArray: '5, 5', weight: 2, className: 'animate-[dash_1s_linear_infinite]' }} />
                        </>
                    )}

                    {/* Gateway */}
                    <Marker position={gateway as any} icon={iconOnline}>
                        <Tooltip permanent direction="right" className="bg-transparent border-0 shadow-none !p-0">
                            <div className="pointer-events-none ml-2 flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md bg-black/85 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                                <span className="text-cyan-300 font-black text-[12px] tracking-wider mb-0.5 drop-shadow-md">GATEWAY #01</span>
                                <span className="text-white/80">COASTAL HUB</span>
                                <span className="text-emerald-400 font-bold tracking-widest my-0.5">LoRaWAN LINK</span>
                                <span className="text-white/80">STATUS: <span className={isAck ? 'text-cyan-400' : simState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : simState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></span>
                            </div>
                        </Tooltip>
                    </Marker>
                    
                    {/* Beacons */}
                    <Marker position={b1 as any} icon={b1Icon}>
                        <Popup className="custom-popup bg-transparent border-0 shadow-none !p-0">
                            <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md bg-black/85 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                                <span className="text-orange-400 font-black text-[12px] tracking-wider mb-0.5 drop-shadow-md">FISHERMAN #402</span>
                                <span className="text-white/80">STATUS: <span className={isFail ? 'text-slate-400' : isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isFail ? 'OFFLINE' : isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                                <span className="text-white/80">LAT: {(baseLat - 1).toFixed(4)} | LON: {(baseLon - 10).toFixed(4)}</span>
                                <span className="text-white/80">SIG: {isFail ? '--' : '-67 dBm'} | BAT: 87%</span>
                            </div>
                        </Popup>
                    </Marker>
                    
                    <Marker position={b2 as any} icon={b2Icon}>
                        <Popup className="custom-popup bg-transparent border-0 shadow-none !p-0">
                            <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md bg-black/85 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                                <span className="text-sky-400 font-black text-[12px] tracking-wider mb-0.5">TOURIST BOAT #77</span>
                                <span className="text-white/80">STATUS: <span className={isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                                <span className="text-white/80">LAT: {(baseLat - 5).toFixed(4)} | LON: {(baseLon - 6).toFixed(4)}</span>
                                <span className="text-white/80">SIG: -42 dBm | BAT: 92%</span>
                            </div>
                        </Popup>
                    </Marker>


                </MapContainer>
            </div>

            <IotOverlays simState={simState} handleIotAck={handleIotAck} />

            {/* Global Keyframes for dashed line animation */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes dash {
                    to { stroke-dashoffset: -10; }
                }
            `}} />
        </div>
    </div>
    );
};
