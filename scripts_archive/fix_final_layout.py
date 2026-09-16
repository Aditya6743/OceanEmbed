import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Hide Rotation Lock button for IoT
rot_btn = """        {/* Lock Auto-Rotate Button */}
        <div className="absolute top-24 right-6 z-20 pointer-events-auto">"""
code = code.replace(rot_btn, "        {/* Lock Auto-Rotate Button */}\n        {activeTab !== 'iot' && (\n        <div className=\"absolute top-24 right-6 z-20 pointer-events-auto\">")

rot_btn_end = """              <Unlock size={12} className="text-sky-300" />
            )}
          </button>
        </div>"""
code = code.replace(rot_btn_end, rot_btn_end + "\n        )}")

# 2. Hide Argo overlay for IoT
argo_btn = """        {/* ARGO HUD Overlay */}
        <div className="absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">"""
code = code.replace(argo_btn, "        {/* ARGO HUD Overlay */}\n        {activeTab !== 'iot' && (\n        <div className=\"absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg\">")

argo_btn_end = """          </button>
        </div>"""
code = code.replace(argo_btn_end, argo_btn_end + "\n        )}")

# 3. Completely replace IotHubDashboard with the pristine, static version with FIXED SPACING to prevent overlap
target_hub = re.search(r"// ----------------------------------------------------\n// IOT HUB DASHBOARD \(ARCHITECTURE FLOW & RADAR\)\n// ----------------------------------------------------\nconst IotHubDashboard = \(\) => \{\n.*?export default function Solutions\(\) \{", code, re.DOTALL).group(0)

# We load the components.ts again to append at the end
with open("components.ts", "r") as f:
    comps = f.read()

new_hub = """// ----------------------------------------------------
// IOT HUB DASHBOARD (ARCHITECTURE FLOW & RADAR)
// ----------------------------------------------------
const IotHubDashboard = () => {
  const [logs, setLogs] = useState<string[]>([
    "> INIT PyTorch Spatio-Temporal Ocean Model v4.2",
    "> Loading Checkpoint: /models/cyclone_tchp_weights.pt",
    "> Attaching to Live CMEMS Telemetry Stream...",
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
      setLogs(prev => {
         const updated = [...prev, newLogs[i % newLogs.length]];
         return updated.slice(-10);
      });
      i++;
    }, 800);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-6 max-w-[1400px] mx-auto font-mono pointer-events-auto z-20 justify-center">
      
      {/* ----------------- TOP HALF: BASIC RADAR ----------------- */}
      <div className="h-40 shrink-0 bg-black/60 border border-sky-500/20 rounded-3xl shadow-2xl flex overflow-hidden backdrop-blur-md mb-8 w-full max-w-3xl mx-auto">
         <div className="w-[40%] border-r border-sky-500/20 flex items-center justify-center relative bg-sky-950/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15)_0,transparent_70%)]"></div>
            {/* Radar Circles */}
            <div className="w-28 h-28 border border-sky-500/30 rounded-full flex items-center justify-center relative">
               <div className="w-14 h-14 border border-sky-500/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-sky-500 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
               </div>
               <div className="absolute top-1/2 left-1/2 w-14 h-0.5 bg-gradient-to-r from-sky-400 to-transparent origin-left animate-[spin_3s_linear_infinite]"></div>
               {/* Blips */}
               <div className="absolute top-4 right-6 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
               <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
         </div>
         
         <div className="w-[60%] p-6 flex flex-col justify-center">
            <h3 className="text-sky-400 text-[9px] uppercase tracking-widest font-bold mb-1 flex items-center gap-2"><Target size={12}/> Threat Acquired</h3>
            <div className="text-2xl text-white font-black mb-0.5 tracking-wide">CYCLONE <span className="text-rose-500">CAT-4</span></div>
            <div className="text-slate-400 text-[10px] font-light mb-3 tracking-wider">IMPACT COORD: 18.922°N, 72.834°E</div>
            <div className="flex gap-3">
              <span className="bg-rose-950/40 border border-rose-500/30 text-rose-400 px-2 py-1 rounded text-[9px] font-bold shadow-inner tracking-widest">TCHP > 140 kJ/cm²</span>
              <span className="bg-sky-950/40 border border-sky-500/30 text-sky-400 px-2 py-1 rounded text-[9px] font-bold shadow-inner tracking-widest">EVAC RADIUS: 42 NM</span>
            </div>
         </div>
      </div>

      {/* ----------------- BOTTOM HALF: ARCHITECTURE FLOW ----------------- */}
      {/* We use flex-1 but with min-w-0 to prevent flex children from forcing horizontal overflow. We adjust gaps and widths so it perfectly fits. */}
      <div className="flex-1 w-full flex items-center justify-between gap-1 sm:gap-2 relative px-0 xl:px-4">
        
        {/* Animated Connecting Background Line (Data Source -> Gateway) */}
        <div className="absolute top-1/2 left-[10%] right-[30%] h-[2px] bg-slate-800 -translate-y-1/2 z-0 overflow-hidden">
           <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-[pulse_2s_linear_infinite]"></div>
        </div>

        {/* 1. DATA SOURCE */}
        <div className="z-10 flex flex-col items-center gap-2 lg:gap-3 w-[15%] min-w-[5rem] max-w-[9rem]">
          <div className="text-[7px] lg:text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-2 py-1 rounded-md border border-slate-700/50 whitespace-nowrap">Data Source</div>
          <div className="bg-slate-900 border-2 border-slate-700 rounded-xl lg:rounded-2xl p-3 py-6 lg:p-6 lg:py-10 w-full shadow-2xl flex flex-col items-center justify-center backdrop-blur-md">
             <Radar className="text-sky-400 mb-2 lg:mb-4 animate-[spin_4s_linear_infinite]" size={36} />
             <div className="text-white text-[9px] lg:text-[11px] font-black tracking-widest text-center mt-1 lg:mt-2">SATELLITES</div>
             <div className="text-sky-500/80 text-[7px] lg:text-[9px] mt-1 lg:mt-2 text-center font-bold tracking-wider">CMEMS & ARGO</div>
          </div>
        </div>

        {/* 2. CORE PROCESSOR & TERMINAL */}
        <div className="z-10 flex flex-col items-center gap-2 lg:gap-3 flex-1 min-w-[12rem] max-w-[20rem]">
          <div className="text-[7px] lg:text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-2 py-1 rounded-md border border-slate-700/50 whitespace-nowrap">Core Intelligence</div>
          
          <div className="bg-black border-2 border-rose-500/40 rounded-xl lg:rounded-2xl w-full shadow-[0_0_40px_rgba(244,63,94,0.15)] overflow-hidden flex flex-col relative">
             <div className="absolute inset-0 bg-rose-950/20 pointer-events-none"></div>
             <div className="p-3 py-4 lg:p-5 lg:py-8 border-b border-rose-500/30 flex flex-col items-center relative z-10 shrink-0">
                <div className="absolute top-2 right-2 lg:top-4 lg:right-4 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-rose-500 rounded-full animate-ping"></div>
                <Activity className="text-rose-500 mb-2 lg:mb-3" size={32} />
                <div className="text-white text-[10px] lg:text-[13px] font-black tracking-widest text-center">PYTORCH ENGINE</div>
                <div className="text-rose-400 text-[7px] lg:text-[9px] font-bold mt-1 lg:mt-2 tracking-widest bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/20">CRITICAL ANOMALY</div>
             </div>
             
             {/* Mini Terminal inside the Core */}
             <div className="h-40 lg:h-52 bg-[#050505] p-3 lg:p-5 flex flex-col relative z-10">
                <div className="text-[8px] lg:text-[10px] text-slate-500 mb-2 flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold">embed_v4.py</span>
                  <span className="text-emerald-500 flex items-center gap-1.5 font-bold tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SYS_ACTIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto text-[7px] lg:text-[9px] leading-relaxed flex flex-col justify-end space-y-1.5">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('CRITICAL') || log.includes('WARNING') ? 'text-rose-400 font-bold' : log.includes('POST') || log.includes('HTTP') ? 'text-sky-400 font-bold' : 'text-emerald-500/90'}>{log}</div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* 3. API GATEWAY */}
        <div className="z-10 flex flex-col items-center gap-2 lg:gap-3 w-[15%] min-w-[5rem] max-w-[9rem]">
          <div className="text-[7px] lg:text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-2 py-1 rounded-md border border-slate-700/50 whitespace-nowrap">Gateway</div>
          <div className="bg-black border-2 border-emerald-500/40 rounded-xl lg:rounded-2xl p-4 py-8 lg:p-6 lg:py-12 w-full shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center backdrop-blur-md relative">
             <div className="absolute -inset-1 bg-emerald-500/10 blur-xl rounded-xl lg:rounded-2xl opacity-60"></div>
             <Radio className="text-emerald-400 mb-2 lg:mb-4 relative z-10" size={36} />
             <div className="text-white text-[9px] lg:text-[12px] font-black tracking-widest text-center relative z-10 mt-1 lg:mt-2">REST API</div>
             <div className="text-emerald-400 text-[7px] lg:text-[9px] mt-2 lg:mt-3 font-bold bg-emerald-950 border border-emerald-500/40 px-2 lg:px-3 py-1 rounded relative z-10">BROADCAST</div>
          </div>
        </div>
        
        {/* 4. HARDWARE ENDPOINTS */}
        <div className="z-10 flex flex-col gap-3 lg:gap-5 w-[25%] min-w-[10rem] max-w-[14rem] relative">
          
          {/* Custom brackets/lines connecting Gateway to Endpoints */}
          <div className="absolute top-1/2 -left-6 lg:-left-12 w-6 lg:w-12 h-[180px] lg:h-[220px] -translate-y-1/2 border-y-2 border-r-2 border-slate-700 rounded-r-xl border-l-0 z-0 opacity-50"></div>
          <div className="absolute top-1/2 -left-6 lg:-left-12 w-6 lg:w-12 h-[2px] bg-slate-700 -translate-y-1/2 z-0 opacity-50"></div>

          <div className="text-[7px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-3 lg:px-4 py-1.5 rounded-md text-center mx-auto relative z-10 border border-slate-700/50 shrink-0 whitespace-nowrap">Active Endpoints</div>
          
          <div className="flex flex-col gap-4 lg:gap-6 relative z-10">
            {/* Node 1 */}
            <div className="bg-slate-900 border-2 border-slate-700/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 shadow-xl flex items-center gap-2 lg:gap-3">
               <div className="bg-black p-1.5 lg:p-2.5 rounded-full border border-sky-500/40 shrink-0 shadow-lg"><Radio size={16} className="text-sky-400" /></div>
               <div className="flex-1 min-w-0">
                  <div className="text-[7px] lg:text-[9px] text-sky-400 font-bold tracking-widest mb-0.5 truncate">LORA PAGER</div>
                  <div className="text-white text-[9px] lg:text-[11px] font-bold tracking-wide truncate">Fisherman #402</div>
                  <div className="text-[7px] lg:text-[9px] text-rose-400 font-bold mt-1 lg:mt-1.5 bg-rose-950/60 inline-block px-1 lg:px-2 py-0.5 rounded shadow-inner animate-pulse">VIBRATING</div>
               </div>
            </div>

            {/* Node 2 */}
            <div className="bg-slate-900 border-2 border-slate-700/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 shadow-xl flex items-center gap-2 lg:gap-3">
               <div className="bg-black p-1.5 lg:p-2.5 rounded-full border border-rose-500/40 shrink-0 shadow-lg"><AlertTriangle size={16} className="text-rose-500" /></div>
               <div className="flex-1 min-w-0">
                  <div className="text-[7px] lg:text-[9px] text-rose-400 font-bold tracking-widest mb-0.5 truncate">COASTAL SIREN</div>
                  <div className="text-white text-[9px] lg:text-[11px] font-bold tracking-wide truncate">Mumbai Twr 04</div>
                  <div className="text-[7px] lg:text-[9px] text-rose-500 font-bold mt-1 lg:mt-1.5 bg-rose-950/60 inline-block px-1 lg:px-2 py-0.5 rounded shadow-inner">120dB ACTIVE</div>
               </div>
            </div>

            {/* Node 3 */}
            <div className="bg-slate-900 border-2 border-slate-700/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 shadow-xl flex items-center gap-2 lg:gap-3">
               <div className="bg-black p-1.5 lg:p-2.5 rounded-full border border-sky-500/40 shrink-0 shadow-lg"><Target size={16} className="text-sky-400" /></div>
               <div className="flex-1 min-w-0">
                  <div className="text-[7px] lg:text-[9px] text-sky-400 font-bold tracking-widest mb-0.5 truncate">TACTICAL HUB</div>
                  <div className="text-white text-[9px] lg:text-[11px] font-bold tracking-wide truncate">CG - Mumbai</div>
                  <div className="text-[7px] lg:text-[9px] text-emerald-400 font-bold mt-1 lg:mt-1.5 bg-emerald-950/60 inline-block px-1 lg:px-2 py-0.5 rounded shadow-inner">DISPATCHED</div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
"""

code = code.replace(target_hub, new_hub + "\n\n" + comps)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
