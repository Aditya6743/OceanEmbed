import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# ---------------------------------------------------------
# 1. Replace the Left Panel's Architecture Flow with Mini Radar
# ---------------------------------------------------------
target_left = """            {/* Compact Architecture Diagram */}
            <div className="mt-6 border border-white/10 bg-black/40 rounded-xl p-4 shadow-inner mb-8">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4 text-center">System Architecture Flow</div>
              <div className="flex flex-col items-center gap-1">
                
                {/* Satellites */}
                <div className="bg-slate-900/80 border border-slate-700 p-2 rounded-lg flex items-center gap-2 w-36 justify-center shadow-lg">
                   <Radar size={12} className="text-sky-400 animate-[spin_4s_linear_infinite]" />
                   <span className="text-[8px] text-slate-300 font-bold tracking-widest">ISRO SATELLITES</span>
                </div>
                
                {/* Down Arrow */}
                <div className="h-4 w-[2px] bg-sky-900 relative overflow-hidden"><div className="absolute top-0 w-full h-2 bg-sky-400 animate-[pulse_1s_ease-in-out_infinite]"></div></div>
                
                {/* PyTorch AI */}
                <div className="bg-rose-950/40 border border-rose-500/40 p-2 rounded-lg flex items-center gap-2 w-40 justify-center shadow-[0_0_15px_rgba(244,63,94,0.15)] relative">
                   <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                   <Activity size={14} className="text-rose-500" />
                   <span className="text-[9px] text-white font-bold tracking-widest">PYTORCH AI</span>
                </div>
                
                {/* Down Arrow */}
                <div className="h-4 w-[2px] bg-rose-900 relative overflow-hidden"><div className="absolute top-0 w-full h-2 bg-rose-400 animate-[pulse_1s_ease-in-out_infinite]"></div></div>
                
                {/* API Gateway */}
                <div className="bg-emerald-950/20 border border-emerald-500/40 p-2 rounded-lg flex items-center gap-2 w-36 justify-center shadow-lg">
                   <Radio size={12} className="text-emerald-400" />
                   <span className="text-[8px] text-emerald-400 font-bold tracking-widest">API GATEWAY</span>
                </div>
                
                {/* Branching Lines */}
                <div className="w-40 h-4 relative mt-1">
                   {/* Center line */}
                   <div className="absolute left-1/2 top-0 w-[2px] h-full bg-emerald-900 -translate-x-1/2 overflow-hidden"><div className="absolute top-0 w-full h-2 bg-emerald-400 animate-pulse"></div></div>
                   {/* Left line */}
                   <div className="absolute left-1/2 top-0 w-1/2 h-[2px] bg-emerald-900 -translate-x-full"></div>
                   <div className="absolute left-0 top-0 w-[2px] h-full bg-emerald-900 overflow-hidden"><div className="absolute top-0 w-full h-2 bg-emerald-400 animate-pulse delay-75"></div></div>
                   {/* Right line */}
                   <div className="absolute left-1/2 top-0 w-1/2 h-[2px] bg-emerald-900"></div>
                   <div className="absolute right-0 top-0 w-[2px] h-full bg-emerald-900 overflow-hidden"><div className="absolute top-0 w-full h-2 bg-emerald-400 animate-pulse delay-150"></div></div>
                </div>

                {/* Hardware Nodes */}
                <div className="flex justify-between w-full max-w-[220px] gap-2 mt-1">
                   <div className="bg-slate-900/80 border border-slate-700 p-1.5 rounded flex flex-col items-center flex-1 shadow-md">
                     <span className="text-[7px] text-sky-400 font-bold tracking-widest">PAGER</span>
                   </div>
                   <div className="bg-slate-900/80 border border-slate-700 p-1.5 rounded flex flex-col items-center flex-1 shadow-md">
                     <span className="text-[7px] text-rose-400 font-bold tracking-widest">SIREN</span>
                   </div>
                   <div className="bg-slate-900/80 border border-slate-700 p-1.5 rounded flex flex-col items-center flex-1 shadow-md">
                     <span className="text-[7px] text-sky-400 font-bold tracking-widest">HUB</span>
                   </div>
                </div>

              </div>
            </div>"""

mini_radar = """            {/* Mini Threat Radar */}
            <div className="mt-6 bg-black/60 border border-sky-500/20 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.05)] overflow-hidden flex relative h-28 mb-4">
               <div className="w-[45%] h-full border-r border-sky-500/20 flex items-center justify-center relative bg-sky-950/10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1)_0,transparent_70%)]"></div>
                  <div className="w-20 h-20 border border-sky-500/30 rounded-full flex items-center justify-center relative">
                     <div className="w-10 h-10 border border-sky-500/20 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                     </div>
                     <div className="absolute top-1/2 left-1/2 w-10 h-0.5 bg-gradient-to-r from-sky-400 to-transparent origin-left animate-[spin_3s_linear_infinite]"></div>
                     <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                  </div>
               </div>
               <div className="w-[55%] p-4 flex flex-col justify-center">
                  <h3 className="text-sky-400 text-[8px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><Target size={10}/> Threat Acquired</h3>
                  <div className="text-[13px] text-white font-black mb-0.5 tracking-wide">CYCLONE <span className="text-rose-500">CAT-4</span></div>
                  <div className="text-slate-400 text-[8px] font-light mb-2">COORD: 18.92°N, 72.83°E</div>
                  <div className="text-[8px] text-rose-400 font-bold">TCHP {">"} 140 kJ/cm²</div>
               </div>
            </div>"""

code = code.replace(target_left, mini_radar)


# ---------------------------------------------------------
# 2. Replace IotHubDashboard with Full Flow Architecture
# ---------------------------------------------------------
target_hub = re.search(r"// ----------------------------------------------------\n// IOT HUB DASHBOARD\n// ----------------------------------------------------\nconst IotHubDashboard = \(\) => \{\n.*?  \);\n\}\n", code, re.DOTALL).group(0)

new_hub = """// ----------------------------------------------------
// IOT HUB DASHBOARD (ARCHITECTURE FLOW)
// ----------------------------------------------------
const IotHubDashboard = () => {
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
      "> BROADCAST PROTOCOL: LoRaWAN 868MHz / Sat-Com",
      "> HTTP 200 OK - Broadcast Sent to 14,204 Nodes.",
      "> Ping Received: Fisherman Beacon #402 (ACK)",
      "> Ping Received: Mumbai Coastal Siren Network (ACK)",
      "> Ping Received: Coast Guard Terminal (ACK)",
    ];
    let i = 0;
    const int = setInterval(() => {
      setLogs(prev => [...prev, newLogs[i % newLogs.length]].slice(-10));
      i++;
    }, 800);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 max-w-7xl mx-auto font-mono pointer-events-auto z-20">
      <div className="w-full flex items-center justify-between relative px-8">
        
        {/* Animated Connecting Background Line */}
        <div className="absolute top-1/2 left-32 right-64 h-0.5 bg-slate-800 -translate-y-1/2 z-0 overflow-hidden">
           <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-[pulse_1.5s_linear_infinite]"></div>
        </div>

        {/* 1. DATA SOURCE */}
        <div className="z-10 flex flex-col items-center gap-3 w-40">
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-black/80 px-2 py-1 rounded">Data Source</div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 w-full shadow-xl flex flex-col items-center backdrop-blur-md">
             <Radar className="text-sky-400 mb-2 animate-[spin_4s_linear_infinite]" size={24} />
             <div className="text-white text-[9px] font-bold tracking-widest text-center mt-1">ISRO SATELLITES</div>
             <div className="text-sky-500/70 text-[7px] mt-1 text-center font-bold">LIVE TELEMETRY</div>
          </div>
        </div>

        {/* 2. CORE PROCESSOR & TERMINAL */}
        <div className="z-10 flex flex-col items-center gap-3 w-72">
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-black/80 px-2 py-1 rounded">Core Intelligence</div>
          
          <div className="bg-black border border-rose-500/30 rounded-xl w-full shadow-[0_0_40px_rgba(244,63,94,0.15)] overflow-hidden flex flex-col relative">
             <div className="absolute inset-0 bg-rose-950/20 pointer-events-none"></div>
             <div className="p-4 border-b border-rose-500/20 flex flex-col items-center relative z-10">
                <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                <Activity className="text-rose-500 mb-2" size={24} />
                <div className="text-white text-[11px] font-black tracking-widest text-center">PYTORCH AI ENGINE</div>
                <div className="text-rose-400 text-[8px] font-bold mt-1 tracking-widest">CRITICAL ANOMALY DETECTED</div>
             </div>
             
             {/* Mini Terminal inside the Core */}
             <div className="h-32 bg-[#050505] p-3 flex flex-col relative z-10">
                <div className="text-[8px] text-slate-500 mb-2 flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold">ocean_embed_v4.py</span>
                  <span className="text-emerald-500 flex items-center gap-1 font-bold tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SYS_ACTIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto text-[8px] leading-relaxed flex flex-col justify-end space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('CRITICAL') || log.includes('WARNING') ? 'text-rose-400 font-bold' : log.includes('POST') || log.includes('HTTP') ? 'text-sky-400 font-bold' : 'text-emerald-500/90'}>{log}</div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* 3. API GATEWAY */}
        <div className="z-10 flex flex-col items-center gap-3 w-40">
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-black/80 px-2 py-1 rounded">Gateway</div>
          <div className="bg-black border border-emerald-500/40 rounded-xl p-4 w-full shadow-xl flex flex-col items-center backdrop-blur-md relative">
             <div className="absolute -inset-1 bg-emerald-500/10 blur-lg rounded-xl opacity-50"></div>
             <Radio className="text-emerald-400 mb-2 relative z-10" size={24} />
             <div className="text-white text-[10px] font-bold tracking-widest text-center relative z-10 mt-1">REST API</div>
             <div className="text-emerald-400 text-[8px] mt-2 font-bold bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded relative z-10 animate-pulse">BROADCASTING</div>
          </div>
        </div>
        
        {/* 4. HARDWARE ENDPOINTS */}
        <div className="z-10 flex flex-col gap-5 w-60 relative">
          
          {/* Custom brackets/lines connecting Gateway to Endpoints */}
          <div className="absolute top-1/2 -left-12 w-12 h-[170px] -translate-y-1/2 border-y-2 border-r-2 border-slate-700 rounded-r-lg border-l-0 z-0"></div>
          <div className="absolute top-1/2 -left-12 w-12 h-[2px] bg-slate-700 -translate-y-1/2 z-0"></div>

          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded text-center mx-auto mb-1 relative z-10">Active Endpoints</div>
          
          {/* Node 1 */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-3 shadow-lg flex items-center gap-4 relative z-10 hover:border-slate-500/50 transition-colors">
             <div className="bg-black p-2 rounded-full border border-sky-500/30 shrink-0"><Radio size={14} className="text-sky-400" /></div>
             <div className="flex-1">
                <div className="text-[8px] text-sky-400 font-bold tracking-widest mb-0.5">LORA PAGER</div>
                <div className="text-white text-[10px] font-bold tracking-wide">Fisherman #402</div>
                <div className="text-[8px] text-rose-400 font-bold mt-1 bg-rose-950/50 inline-block px-1 rounded animate-pulse">VIBRATING</div>
             </div>
          </div>

          {/* Node 2 */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-3 shadow-lg flex items-center gap-4 relative z-10 hover:border-slate-500/50 transition-colors">
             <div className="bg-black p-2 rounded-full border border-rose-500/30 shrink-0"><AlertTriangle size={14} className="text-rose-500 animate-pulse" /></div>
             <div className="flex-1">
                <div className="text-[8px] text-rose-400 font-bold tracking-widest mb-0.5">COASTAL SIREN</div>
                <div className="text-white text-[10px] font-bold tracking-wide">Mumbai Tower 04</div>
                <div className="text-[8px] text-rose-500 font-bold mt-1 bg-rose-950/50 inline-block px-1 rounded">120dB ACTIVE</div>
             </div>
          </div>

          {/* Node 3 */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-3 shadow-lg flex items-center gap-4 relative z-10 hover:border-slate-500/50 transition-colors">
             <div className="bg-black p-2 rounded-full border border-sky-500/30 shrink-0"><Target size={14} className="text-sky-400" /></div>
             <div className="flex-1">
                <div className="text-[8px] text-sky-400 font-bold tracking-widest mb-0.5">TACTICAL HUB</div>
                <div className="text-white text-[10px] font-bold tracking-wide">CG - Mumbai</div>
                <div className="text-[8px] text-emerald-400 font-bold mt-1 bg-emerald-950/50 inline-block px-1 rounded">DISPATCHED</div>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
"""

code = code.replace(target_hub, new_hub)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
