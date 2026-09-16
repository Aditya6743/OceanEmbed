import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Inject the Components at the top
components_code = """
import { useState, useEffect } from 'react';

// ----------------------------------------------------
// IOT SIMULATOR COMPONENTS
// ----------------------------------------------------
const TerminalSimulator = () => {
  const [logs, setLogs] = useState<string[]>([
    "> INIT PyTorch Spatio-Temporal Ocean Model v4.2",
    "> Loading Checkpoint: /models/cyclone_tchp_weights.pt",
    "> Attaching to Live ISRO Telemetry Stream...",
    "> STREAM ACTIVE. Ingesting 0.25° Grid Tensors.",
  ]);

  useEffect(() => {
    const newLogs = [
      "> SCANNING GRID [18°N - 22°N]...",
      "> WARNING: TCHP Energy > 140 kJ/cm² Detected",
      "> INFERENCE: 98.4% Probability of Rapid Intensification",
      "> GENERATING EVACUATION POLYGON...",
      "> TRIGGERING REST API PAYLOAD...",
      "> POST /api/v1/iot/broadcast",
      "> { target: 'all', severity: 'CRITICAL', type: 'CYCLONE' }",
      "> HTTP 200 OK - Broadcast Sent to 14,204 Nodes.",
      "> Ping Received: Fisherman Beacon #402 (ACK)",
      "> Ping Received: Mumbai Coastal Siren Network (ACK)",
      "> Ping Received: Coast Guard Terminal (ACK)",
    ];
    let i = 0;
    const int = setInterval(() => {
      setLogs(prev => [...prev, newLogs[i % newLogs.length]].slice(-16));
      i++;
    }, 800);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full bg-[#0a0a0a] border border-rose-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.1)] flex flex-col relative z-20 pointer-events-auto">
      <div className="h-8 bg-slate-900 border-b border-rose-500/20 flex items-center px-4 gap-2">
         <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
         <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
         <span className="text-[10px] text-slate-500 font-mono ml-4">ocean_embed_core.py - root@ai-tactical</span>
      </div>
      <div className="flex-1 p-5 overflow-hidden font-mono text-[10px] leading-relaxed flex flex-col justify-end gap-2">
        {logs.map((log, idx) => (
          <div key={idx} className={`${log.includes('WARNING') || log.includes('CRITICAL') ? 'text-rose-400 font-bold' : log.includes('POST') || log.includes('HTTP') ? 'text-sky-400' : 'text-emerald-500'}`}>
            {log}
          </div>
        ))}
        <div className="text-emerald-500 animate-pulse mt-1">_</div>
      </div>
    </div>
  );
};

const HardwareMockups = () => {
  return (
    <div className="flex flex-col gap-6 w-full h-full relative z-20 pointer-events-auto">
      
      {/* Mobile Phone Mockup */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[220px] h-[420px] bg-slate-900 border-[6px] border-slate-800 rounded-[2.5rem] relative shadow-2xl overflow-hidden">
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-xl z-20"></div>
          {/* Screen */}
          <div className="w-full h-full bg-rose-600 animate-[pulse_1s_ease-in-out_infinite] flex flex-col items-center justify-center p-5 text-center relative">
             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
             <AlertTriangle size={56} className="text-white mb-4 z-10" />
             <h3 className="text-white font-black text-xl leading-tight mb-2 uppercase z-10">Evacuate<br/>Immediately</h3>
             <div className="bg-black/20 rounded p-2 text-white/90 text-[10px] font-mono mb-4 w-full border border-white/20 z-10">
               CAT 4 CYCLONE DETECTED<br/>DISTANCE: 42 NM
             </div>
             <button className="w-full py-3 bg-white text-rose-600 font-black rounded-full text-xs uppercase tracking-widest shadow-lg z-10">Acknowledge</button>
          </div>
        </div>
      </div>

      {/* Coast Guard Terminal Mockup */}
      <div className="h-[220px] bg-slate-900 border border-sky-500/40 rounded-xl overflow-hidden flex flex-col relative shadow-[0_0_20px_rgba(14,165,233,0.1)]">
         <div className="h-7 bg-sky-950 border-b border-sky-500/20 flex items-center px-4 justify-between">
            <span className="text-[10px] text-sky-400 font-bold tracking-widest uppercase">Coast Guard Tactical Hub</span>
            <Target size={14} className="text-sky-400" />
         </div>
         <div className="flex-1 p-4 grid grid-cols-2 gap-4">
            <div className="border border-sky-500/20 bg-sky-950/20 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:10px_10px]"></div>
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="absolute w-24 h-24 border border-sky-500/30 rounded-full animate-ping"></div>
                <div className="absolute w-12 h-12 border border-sky-500/50 rounded-full"></div>
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
              </div>
            </div>
            <div className="flex flex-col justify-center font-mono text-[10px] gap-2">
               <div className="text-rose-400 font-bold border-b border-rose-500/20 pb-1">TARGET: CYCLONE</div>
               <div className="text-sky-400">COORD: 18.9220 N, 72.8347 E</div>
               <div className="text-slate-400">NODES ALERTED: 14,204</div>
               <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded p-1.5 text-center font-bold mt-2">HELI-1 DISPATCHED</div>
            </div>
         </div>
      </div>
    </div>
  );
}
"""
code = code.replace("import { useState, useEffect } from 'react';", components_code)

# 2. Replace the old IoT Simulator block with the new layout
target_ui = """      {activeTab === 'iot' && (
        <div className="absolute inset-0 z-0 pl-[35%] pt-24 bg-[#030712] flex items-center justify-center overflow-hidden font-mono">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e0a_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between px-12">
            
            {/* Left Column: AI Engine */}
            <div className="flex flex-col items-center relative">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Data Source</div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-12 shadow-lg text-center">
                <Radar className="text-sky-400 mx-auto mb-2 animate-spin-slow" size={24} />
                <div className="text-white text-xs font-bold">ISRO / NASA Satellites</div>
                <div className="text-sky-500 text-[10px] mt-1">Live Ocean Surface Telemetry</div>
              </div>

              {/* Data stream dots */}
              <div className="absolute top-[80px] bottom-[80px] w-0.5 bg-slate-800">
                 <div className="w-full h-4 bg-sky-400 rounded-full animate-bounce"></div>
              </div>

              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 mt-8">Core Processor</div>
              <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-6 shadow-[0_0_40px_rgba(244,63,94,0.15)] relative">
                <div className="absolute -top-3 -right-3">
                  <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500 border border-black flex items-center justify-center text-[10px] font-bold text-white">!</span>
                  </span>
                </div>
                <Activity className="text-rose-500 mx-auto mb-3" size={32} />
                <div className="text-white text-sm font-black tracking-wider text-center">PYTORCH AI ENGINE</div>
                <div className="bg-black/50 rounded p-2 mt-3 border border-rose-500/20">
                  <div className="text-rose-400 text-[10px]">CRITICAL ANOMALY DETECTED</div>
                  <div className="text-slate-300 text-[10px] mt-1">TCHP Surge: {">"} 140 kJ/cm²</div>
                </div>
              </div>
            </div>

            {/* Middle: API Gateway */}
            <div className="flex-1 px-8 relative">
              {/* Animated Connecting Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-900/50 -translate-y-1/2 overflow-hidden">
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-[pulse_1s_ease-in-out_infinite]"></div>
              </div>
              
              <div className="relative bg-black border border-rose-500/40 rounded-lg p-4 shadow-xl mx-auto w-64 text-center z-10">
                <Radio className="text-rose-400 mx-auto mb-2" size={24} />
                <div className="text-white text-xs font-bold uppercase">Alert API Gateway</div>
                <div className="text-emerald-400 text-[10px] mt-1 bg-emerald-500/10 rounded py-1 border border-emerald-500/20">STATUS: BROADCASTING</div>
              </div>
            </div>

            {/* Right Column: IoT Devices */}
            <div className="flex flex-col gap-8 relative z-10">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center absolute -top-8 left-0 right-0">Hardware Endpoints</div>
              
              {/* Device 1 */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-black p-3 rounded-full border border-rose-500/30">
                  <Activity className="text-rose-400 animate-pulse" size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Fisherman Beacon #402</div>
                  <div className="text-rose-400 text-[10px] mt-1 animate-pulse font-bold">VIBRATING (EVACUATE)</div>
                </div>
              </div>

              {/* Device 2 */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-black p-3 rounded-full border border-rose-500/30">
                  <AlertTriangle className="text-rose-500 animate-pulse" size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Coastal Siren (Mumbai)</div>
                  <div className="text-rose-500 text-[10px] mt-1 font-black animate-pulse">SIREN ACTIVE</div>
                </div>
              </div>

              {/* Device 3 */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-black p-3 rounded-full border border-sky-500/30">
                  <Target className="text-sky-400" size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Coast Guard HQ Terminal</div>
                  <div className="text-sky-400 text-[10px] mt-1">COORDINATES SYNCED</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}"""

new_ui = """      {activeTab === 'iot' && (
        <div className="absolute inset-0 z-0 pl-[35%] pt-20 pb-4 pr-4 bg-[#030712] flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e0a_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          
          <div className="relative z-10 w-full h-full flex gap-8 p-8 max-w-7xl items-center pointer-events-auto">
            {/* Left: Live Terminal */}
            <div className="flex-1 h-full min-h-[500px]">
               <TerminalSimulator />
            </div>

            {/* Right: Hardware Mockups */}
            <div className="flex-1 h-full min-h-[500px]">
               <HardwareMockups />
            </div>
          </div>
        </div>
      )}"""

code = code.replace(target_ui, new_ui)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
