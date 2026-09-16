import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target_hub = re.search(r"// ----------------------------------------------------\n// IOT HUB DASHBOARD \(ARCHITECTURE FLOW & RADAR\)\n// ----------------------------------------------------\nconst IotHubDashboard = \(\) => \{\n.*?export default function Solutions\(\) \{", code, re.DOTALL).group(0)

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
    <div className="w-full h-full flex flex-col p-8 max-w-[1400px] mx-auto font-mono pointer-events-auto z-20">
      
      {/* TOP SECTION: BASIC RADAR (Takes up ~40% height) */}
      <div className="h-[40%] w-full flex items-center justify-center relative mb-8 pb-8 border-b border-white/5">
        <div className="w-72 h-full bg-[#070b14] border-2 border-sky-500/20 rounded-3xl flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(14,165,233,0.1)] backdrop-blur-md">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0,transparent_70%)] rounded-3xl"></div>
           
           <div className="w-32 h-32 border border-sky-500/30 rounded-full flex items-center justify-center relative z-10">
              <div className="w-16 h-16 border border-sky-500/20 rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-sky-500 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-sky-400 to-transparent origin-left animate-[spin_3s_linear_infinite]"></div>
              {/* Threat Blips */}
              <div className="absolute top-6 right-8 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
              <div className="absolute top-6 right-8 w-1 h-1 bg-white rounded-full"></div>
           </div>

           <div className="mt-6 text-center z-10">
              <div className="text-sky-400 text-[10px] uppercase font-bold tracking-widest mb-1.5 flex items-center justify-center gap-1.5"><Target size={12}/> THREAT DETECTED</div>
              <div className="text-white text-xl font-black tracking-widest mb-2">CYCLONE CAT-4</div>
              <div className="flex gap-2 justify-center">
                <span className="bg-rose-950/40 text-rose-400 px-2.5 py-1 rounded text-[9px] font-bold border border-rose-500/30 shadow-inner">TCHP {">"} 140 kJ/cm²</span>
                <span className="bg-sky-950/40 text-sky-400 px-2.5 py-1 rounded text-[9px] font-bold border border-sky-500/30 shadow-inner">EVAC RADIUS: 42 NM</span>
              </div>
           </div>
        </div>
      </div>

      {/* BOTTOM SECTION: ARCHITECTURE FLOW (Takes up ~60% height) */}
      <div className="flex-1 w-full flex items-stretch justify-between gap-4 relative">
        
        {/* Connecting Line across the entire architecture */}
        <div className="absolute top-1/2 left-[5%] right-[20%] h-[1.5px] bg-slate-800 -translate-y-1/2 z-0">
           <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-sky-500/50 to-transparent animate-[pulse_2s_linear_infinite]"></div>
        </div>

        {/* 1. DATA SOURCE */}
        <div className="z-10 flex flex-col items-center justify-center gap-3 w-[18%]">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded border border-slate-700/50">Data Source</div>
          <div className="bg-[#0b1120] border-2 border-slate-700 rounded-2xl p-6 w-full flex flex-col items-center text-center shadow-xl">
             <Radar className="text-sky-400 mb-5 animate-[spin_4s_linear_infinite]" size={48} />
             <div className="text-white text-[12px] font-black tracking-widest">SATELLITES</div>
             <div className="text-sky-500/80 text-[10px] mt-2 font-bold tracking-wider">CMEMS & ARGO</div>
          </div>
        </div>

        {/* 2. CORE INTELLIGENCE */}
        <div className="z-10 flex flex-col items-center justify-center gap-3 flex-1 px-4">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded border border-slate-700/50">Core Intelligence</div>
          
          <div className="bg-black border-2 border-rose-500/40 rounded-2xl w-full flex flex-col overflow-hidden shadow-[0_0_40px_rgba(244,63,94,0.15)]">
             <div className="p-5 py-6 border-b border-rose-500/30 flex flex-col items-center bg-rose-950/10 relative">
                <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                <Activity className="text-rose-500 mb-3" size={36} />
                <div className="text-white text-[14px] font-black tracking-widest">PYTORCH AI ENGINE</div>
             </div>
             <div className="bg-[#050505] p-5 flex flex-col h-48">
                <div className="text-[10px] text-slate-500 mb-3 flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-400">ocean_embed_v4.py</span>
                  <span className="text-emerald-500 flex items-center gap-1.5 font-bold tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> ACTIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto text-[10px] leading-relaxed flex flex-col justify-end space-y-1.5 custom-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('CRITICAL') || log.includes('WARNING') ? 'text-rose-400 font-bold' : log.includes('POST') || log.includes('HTTP') ? 'text-sky-400 font-bold' : 'text-emerald-500/90'}>{log}</div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* 3. API GATEWAY */}
        <div className="z-10 flex flex-col items-center justify-center gap-3 w-[18%]">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded border border-slate-700/50">Gateway</div>
          <div className="bg-[#0b1120] border-2 border-emerald-500/40 rounded-2xl p-6 py-10 w-full flex flex-col items-center text-center shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
             <div className="absolute -inset-1 bg-emerald-500/5 blur-xl rounded-2xl"></div>
             <Radio className="text-emerald-400 mb-5 relative z-10" size={48} />
             <div className="text-white text-[12px] font-black tracking-widest relative z-10">REST API</div>
             <div className="text-emerald-400 text-[10px] mt-3 font-bold bg-emerald-950 border border-emerald-500/40 px-3 py-1 rounded relative z-10">BROADCASTING</div>
          </div>
        </div>
        
        {/* 4. ACTIVE ENDPOINTS */}
        <div className="z-10 flex flex-col justify-center gap-4 w-[24%] relative">
          
          <div className="absolute top-1/2 -left-6 w-6 h-[180px] -translate-y-1/2 border-y border-r border-slate-700 rounded-r-xl border-l-0 z-0"></div>
          <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-slate-700 -translate-y-1/2 z-0"></div>

          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-4 py-1.5 rounded border border-slate-700/50 text-center mx-auto relative z-10 w-4/5">Active Endpoints</div>
          
          <div className="flex flex-col gap-5 relative z-10 w-full">
            <div className="bg-[#0b1120] border-2 border-slate-700/50 rounded-2xl p-4 flex items-center gap-3">
               <div className="bg-black p-2.5 rounded-full border border-sky-500/40 shrink-0"><Radio size={20} className="text-sky-400" /></div>
               <div className="overflow-hidden">
                  <div className="text-[9px] text-sky-400 font-bold tracking-widest truncate">LORA PAGER</div>
                  <div className="text-white text-[11px] font-bold truncate mt-0.5">Fisherman #402</div>
                  <div className="text-[8px] text-rose-400 font-bold mt-1 bg-rose-950/60 inline-block px-2 py-0.5 rounded animate-pulse shadow-inner">VIBRATING</div>
               </div>
            </div>

            <div className="bg-[#0b1120] border-2 border-slate-700/50 rounded-2xl p-4 flex items-center gap-3">
               <div className="bg-black p-2.5 rounded-full border border-rose-500/40 shrink-0"><AlertTriangle size={20} className="text-rose-500" /></div>
               <div className="overflow-hidden">
                  <div className="text-[9px] text-rose-400 font-bold tracking-widest truncate">COASTAL SIREN</div>
                  <div className="text-white text-[11px] font-bold truncate mt-0.5">Mumbai Twr 04</div>
                  <div className="text-[8px] text-rose-500 font-bold mt-1 bg-rose-950/60 inline-block px-2 py-0.5 rounded shadow-inner">120dB ACTIVE</div>
               </div>
            </div>

            <div className="bg-[#0b1120] border-2 border-slate-700/50 rounded-2xl p-4 flex items-center gap-3">
               <div className="bg-black p-2.5 rounded-full border border-sky-500/40 shrink-0"><Target size={20} className="text-sky-400" /></div>
               <div className="overflow-hidden">
                  <div className="text-[9px] text-sky-400 font-bold tracking-widest truncate">TACTICAL HUB</div>
                  <div className="text-white text-[11px] font-bold truncate mt-0.5">CG - Mumbai</div>
                  <div className="text-[8px] text-emerald-400 font-bold mt-1 bg-emerald-950/60 inline-block px-2 py-0.5 rounded shadow-inner">DISPATCHED</div>
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
