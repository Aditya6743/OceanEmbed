import { useState } from 'react';
import { Navigation, LifeBuoy, ShieldAlert, Thermometer, Route, Play, RefreshCw, MoveRight } from 'lucide-react';
import { useOceanStore } from '../store/oceanStore';

interface RoutingSarLeftPanelProps {
  activeMode: 'routing' | 'sar';
  setActiveMode: (mode: 'routing' | 'sar') => void;
  simState: 'idle' | 'running' | 'complete';
  setSimState: (state: 'idle' | 'running' | 'complete') => void;
  sarTimeHour: number;
  setSarTimeHour: (h: number) => void;
  showCurrents: boolean;
  setShowCurrents: (s: boolean) => void;
  showThermalRisk: boolean;
  setShowThermalRisk: (s: boolean) => void;
  onInteract: () => void;
}

export default function RoutingSarLeftPanel({ simState, setSimState, activeMode, setActiveMode, sarTimeHour, setSarTimeHour, showCurrents, setShowCurrents, showThermalRisk, setShowThermalRisk, onInteract }: RoutingSarLeftPanelProps) {
      const [progress, setProgress] = useState(0);
  const { selectedLocation } = useOceanStore();
  const latMod = selectedLocation ? Math.abs(selectedLocation.latitude % 5) : 1;
  const baseSpeed = 0.8 + (latMod * 0.2); // Knots
  const r1 = (baseSpeed * 1).toFixed(1);
  const r6 = (baseSpeed * 6).toFixed(1);
  const r24 = (baseSpeed * 24).toFixed(1);
  const area = (Math.PI * Math.pow(parseFloat(r24), 2) / 10).toFixed(1); // Scaled for UI
  const dir = selectedLocation ? (selectedLocation.longitude % 2 === 0 ? '{dir}' : 'NW (315°)') : '{dir}';
        

  const playUISound = (type: 'click' | 'start' | 'expand') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      if (!(window as any).audioCtx) (window as any).audioCtx = new AudioContext();
      const ctx = (window as any).audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.8);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'expand') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch(e) {}
  };

  const startSimulation = () => {
    if (activeMode === 'routing') {
      setShowThermalRisk(true);
    }
    setShowCurrents(true); // Auto-enable surface currents
    onInteract();
    playUISound('start');
    setSimState('running');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setSimState('complete');
          
          return 100;
        }
        return p + 5;
      });
    }, 150);
  };

  const reset = () => {
    setSimState('idle');
    setProgress(0);
    setShowThermalRisk(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col h-full pointer-events-auto pb-12">
      
      {/* HERO SECTION */}
      <div className="mb-8">
        <h2 className="text-indigo-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Navigation size={20}/> ROUTING & SAR</h2>
        <p className="text-sm font-mono text-indigo-300/80 mb-4 tracking-widest uppercase border-b border-white/10 pb-4">
          Predict the Ocean. Optimize the Route. Find What Matters.
        </p>
        <p className="text-[13px] leading-relaxed text-slate-300 font-light mb-6">
          OceanEmbed combines ocean-state intelligence, surface currents, thermal conditions, and predicted drift to support proactive maritime routing and reactive Search & Rescue operations.
        </p>

        <div className="flex gap-3">
          <button 
            onClick={() => { setActiveMode('routing'); reset(); onInteract(); }}
            className={`flex-1 py-3 px-4 rounded-lg font-mono text-[10px] tracking-widest font-bold uppercase transition-all flex items-center justify-center gap-2 ${
              activeMode === 'routing' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white hover:bg-black/60'
            }`}
          >
            <Route size={14} /> Plan a Route
          </button>
          <button 
            onClick={() => { setActiveMode('sar'); reset(); onInteract(); }}
            className={`flex-1 py-3 px-4 rounded-lg font-mono text-[10px] tracking-widest font-bold uppercase transition-all flex items-center justify-center gap-2 ${
              activeMode === 'sar' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white hover:bg-black/60'
            }`}
          >
            <LifeBuoy size={14} /> Simulate SAR
          </button>
        </div>
      </div>

      {/* MARITIME ROUTING MODE */}
      {activeMode === 'routing' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            
            <div>
              <h2 className="text-lg font-bold text-white tracking-widest uppercase">Maritime Routing</h2>
              <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">Navigate With the Ocean, Not Against It.</p>
            </div>
          </div>
          
          <p className="text-[12px] text-slate-400 leading-relaxed font-light mb-6">
            The V6 Engine analyzes ocean currents and thermal conditions to identify routing opportunities, reduce exposure to hazardous conditions, and support more efficient maritime movement.
          </p>


          <div className="mb-6 flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Show Current Vectors</span>
              <button onClick={() => { setShowCurrents(!showCurrents); }} className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${showCurrents ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`}>
                 <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showCurrents ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
               </button>
          </div>

          <div className="bg-[#030712]/80 border border-cyan-500/30 rounded-xl p-5 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 bg-cyan-500/20 text-cyan-400 text-[8px] font-mono font-bold px-2 py-1 rounded-bl-lg border-l border-b border-cyan-500/30 tracking-widest">SIMULATION</div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">Start Location</label>
                <button className="w-full text-left bg-black/50 hover:bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded px-3 py-2 text-[11px] text-white font-mono transition-all">Chennai Port, IN</button>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">Destination</label>
                <button className="w-full text-left bg-black/50 hover:bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded px-3 py-2 text-[11px] text-white font-mono transition-all">Port Blair, IN</button>
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">Vessel Profile</label>
                <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-[11px] text-white font-mono">Cargo (Panamax)</div>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">Target Speed</label>
                <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-[11px] text-white font-mono">14.5 knots</div>
              </div>
            </div>


            {simState === 'idle' && (
              <button onClick={startSimulation} className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg py-3 font-mono text-[11px] tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                CALCULATE OPTIMIZED ROUTE
              </button>
            )}

            {simState === 'running' && (
              <div className="w-full bg-black/40 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex justify-between text-[10px] text-cyan-400 font-mono tracking-widest mb-2">
                  <span>ANALYZING CURRENTS...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {simState === 'complete' && (
              <div className="animate-in fade-in zoom-in-95 duration-500 mt-2">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Standard Route</span>
                  <span className="text-[10px] text-slate-400 font-mono">vs</span>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">Ocean-Aware Route</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                    <span className="text-[10px] text-slate-300 font-mono">Estimated Distance</span>
                    <span className="text-[11px] text-white font-bold">735 NM <span className="text-cyan-400 font-mono text-[10px] ml-2">+2%</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                    <span className="text-[10px] text-slate-300 font-mono">Relative Travel Time</span>
                    <span className="text-[11px] text-white font-bold">48.2 hrs <span className="text-emerald-400 font-mono text-[10px] ml-2">-4%</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                    <span className="text-[10px] text-slate-300 font-mono">Current Assistance</span>
                    <span className="text-[11px] text-white font-bold">Favorable <span className="text-emerald-400 font-mono text-[10px] ml-2">+0.6 kts</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                    <span className="text-[10px] text-slate-300 font-mono">Simulated Fuel Impact</span>
                    <span className="text-[11px] text-emerald-400 font-bold tracking-wider">MODERATE SAVINGS</span>
                  </div>
                </div>

                <button onClick={reset} className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 hover:text-white tracking-widest font-mono py-2">
                  <RefreshCw size={12} /> RESET SIMULATION
                </button>
              </div>
            )}
          </div>

          {/* THERMAL HAZARD AWARENESS */}
          <div className="mb-8">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-[12px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Thermometer size={14} className="text-amber-400" /> Thermal Risk Awareness
               </h3>
               <button onClick={() => { setShowThermalRisk(!showThermalRisk); }} className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${showThermalRisk ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`}>
                 <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showThermalRisk ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
               </button>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed font-light mb-4">
               The V6 Engine uses reconstructed subsurface temperature information together with available ocean-state information to identify regions requiring additional operational attention.
             </p>
             <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Predicted Thermal Risk Zone</span>
                  <span className="text-[10px] text-amber-200/70 font-mono block">SIMULATION: Elevated thermal gradient detected at 50m-100m depth near waypoint Alpha. Caution advised.</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* SEARCH & RESCUE MODE */}
      {activeMode === 'sar' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            
            <div>
              <h2 className="text-lg font-bold text-white tracking-widest uppercase">Search & Rescue</h2>
              <p className="text-[10px] text-rose-400 font-mono uppercase tracking-widest">When Every Minute Matters.</p>
            </div>
          </div>
          
          <p className="text-[12px] text-slate-400 leading-relaxed font-light mb-6">
            If a maritime incident occurs, the same ocean intelligence engine can estimate the movement of a drifting vessel, beacon, or object using ocean-current conditions and predicted drift.
          </p>
          
          <div className="mb-6 flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Show Current Vectors</span>
              <button onClick={() => { setShowCurrents(!showCurrents); }} className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${showCurrents ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`}>
                 <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showCurrents ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
               </button>
            </div>


          <div className="bg-black/60 border border-rose-500/30 rounded-xl p-5 relative overflow-hidden mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 bg-rose-500/20 text-rose-400 text-[8px] font-mono font-bold px-2 py-1 rounded-bl-lg border-l border-b border-rose-500/30 tracking-widest">DECISION SUPPORT</div>
            
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">Rescue Operations View</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">LKP (Last Known)</label>
                <button className="w-full text-left bg-black/50 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/50 rounded px-3 py-2 text-[11px] text-rose-200 font-mono transition-all">11.5°N, 85.2°E</button>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">Time Since Incident</label>
                <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-[11px] text-rose-200 font-mono">{sarTimeHour.toString().padStart(2, "0")}h 00m</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">Object Profile</label>
              <select className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-[11px] text-white font-mono outline-none focus:border-rose-500/50">
                <option>Distress Beacon (Life Raft)</option>
                <option>Fishing Vessel (Adrift)</option>
                <option>Person in Water (PIW)</option>
              </select>
            </div>

            {simState === 'idle' && (
              <button onClick={startSimulation} className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-lg py-3 font-mono text-[11px] tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)] flex items-center justify-center gap-2">
                <Play size={14} /> RUN DRIFT SIMULATION
              </button>
            )}

            {simState === 'running' && (
              <div className="w-full bg-black/40 border border-rose-500/30 rounded-lg p-4">
                <div className="flex justify-between text-[10px] text-rose-400 font-mono tracking-widest mb-2">
                  <span>EXPANDING SEARCH RADIUS...</span>
                  <span>+{Math.floor((progress / 100) * 24)}H</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {simState === 'complete' && (
              <div className="animate-in fade-in zoom-in-95 duration-500 mt-2 bg-black/40 border border-white/5 rounded-lg p-4">
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Search Priority Area</span>
                    <span className="text-[13px] text-rose-400 font-bold font-mono">{area} SQ NM</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Current Direction</span>
                    <span className="text-[13px] text-white font-bold font-mono">{dir}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 border-t border-white/5 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">+1 Hour</span>
                    <span className="text-[10px] text-white font-mono">Radius: {r1} NM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">+6 Hours</span>
                    <span className="text-[10px] text-white font-mono">Radius: {r6} NM</span>
                  </div>
                  <div className="flex justify-between items-center bg-rose-500/10 px-2 py-1 -mx-2 rounded border border-rose-500/20">
                    <span className="text-[10px] text-rose-400 font-bold font-mono">+24 Hours (Est.)</span>
                    <span className="text-[10px] text-rose-400 font-bold font-mono">Radius: {r24} NM</span>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex gap-1">
                  {[1, 3, 6, 12, 24].map((h) => (
                    <button key={h} onClick={() => { setSarTimeHour(h); setSimState('complete'); onInteract(); }} className={`flex-1 py-2 px-1.5 rounded border text-[9px] font-bold font-mono transition-all ${sarTimeHour === h ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-black border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}>+{h}H</button>
                  ))}
                </div>
                <button 
                    onClick={() => {
                      const next = sarTimeHour === 1 ? 3 : sarTimeHour === 3 ? 6 : sarTimeHour === 6 ? 12 : 24;
                      setSarTimeHour(next);
                      setSimState('complete');
                      setShowCurrents(true); // Auto-enable surface currents
                      onInteract();
                      playUISound('expand');
                    }}
                    className="flex-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 rounded py-2 font-mono text-[9px] tracking-widest font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)] flex items-center justify-center gap-1.5"
                  >
                    EXPAND AREA
                  </button>
                  <button onClick={reset} className="flex-1 bg-black hover:bg-black/50 border border-rose-500/30 text-rose-400 rounded py-2 font-mono text-[9px] tracking-widest font-bold transition-all flex items-center justify-center gap-2">
                    <RefreshCw size={12} /> RESET
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UNIFIED CONCEPT */}
      <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-8 backdrop-blur-sm">
        <div className="text-center mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">One Engine. Two Maritime Decisions.</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 text-center bg-white/5 rounded-lg p-3 border border-white/5">
            
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Proactive</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed">Optimize movement before incident</div>
          </div>
          <div className="text-cyan-500/50"><MoveRight size={24} /></div>
          <div className="flex-1 text-center bg-white/5 rounded-lg p-3 border border-white/5">
            
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Reactive</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed">Predict drift after incident</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-widest block mb-1">OCEANEMBED V6 HYBRID ENGINE</span>
          <span className="text-[8px] text-slate-500 font-mono tracking-widest">CNN + Vision Transformer + Spatial Attention + PINN</span>
        </div>
      </div>

      {/* DATA & AI EXPLANATION */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">Core Intelligence Layer</h3>
        <div className="space-y-3">
          <div className="bg-black/20 rounded border border-white/5 p-3">
            <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-widest block mb-1">Data Inputs</span>
            <span className="text-[10px] text-slate-400 leading-relaxed">CMEMS, INCOIS Argo, ARMOR3D L4, and available surface current information.</span>
          </div>
          <div className="bg-black/20 rounded border border-white/5 p-3">
            <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-widest block mb-1">AI Architecture</span>
            <span className="text-[10px] text-slate-400 leading-relaxed">OceanEmbed V6 Hybrid Engine provides subsurface temperature, thermal gradients, and ocean-state context to support drift and routing decisions.</span>
          </div>
        </div>
      </div>

    </div>
  );
}


