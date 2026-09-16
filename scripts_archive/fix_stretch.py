import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target_hub = re.search(r"// ----------------------------------------------------\n// IOT HUB DASHBOARD \(ARCHITECTURE FLOW & RADAR\)\n// ----------------------------------------------------\nconst IotHubDashboard = \(\) => \{\n.*?  \)\n\}\n", code, re.DOTALL).group(0)

new_hub = """// ----------------------------------------------------
// IOT HUB DASHBOARD (ARCHITECTURE FLOW & RADAR)
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
    <div className="w-full h-full flex flex-col p-6 max-w-[1400px] mx-auto font-mono pointer-events-auto z-20 justify-center">
      
      {/* ----------------- TOP HALF: BASIC RADAR ----------------- */}
      <div className="h-36 shrink-0 bg-black/60 border border-sky-500/20 rounded-3xl shadow-2xl flex overflow-hidden backdrop-blur-md mb-8 w-full max-w-3xl mx-auto cursor-crosshair">
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
              <span className="bg-rose-950/40 border border-rose-500/30 text-rose-400 px-2 py-1 rounded text-[9px] font-bold shadow-inner tracking-widest">TCHP {">"} 140 kJ/cm²</span>
              <span className="bg-sky-950/40 border border-sky-500/30 text-sky-400 px-2 py-1 rounded text-[9px] font-bold shadow-inner tracking-widest">EVAC RADIUS: 42 NM</span>
            </div>
         </div>
      </div>

      {/* ----------------- BOTTOM HALF: ARCHITECTURE FLOW ----------------- */}
      <div className="flex-1 w-full flex items-center justify-between gap-2 xl:gap-4 relative px-2">
        
        {/* Animated Connecting Background Line (Data Source -> Gateway) */}
        <div className="absolute top-1/2 left-[10%] right-[30%] h-[2px] bg-slate-800 -translate-y-1/2 z-0 overflow-hidden">
           <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-[pulse_2s_linear_infinite]"></div>
        </div>

        {/* 1. DATA SOURCE */}
        <div className="z-10 flex flex-col items-center gap-3 w-32 xl:w-44 cursor-pointer group transition-colors">
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded-md border border-slate-700/50 group-hover:border-sky-500/50 group-hover:text-sky-400 transition-colors">Data Source</div>
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 py-10 w-full shadow-2xl flex flex-col items-center justify-center backdrop-blur-md group-hover:border-sky-500/50 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] transition-colors">
             <Radar className="text-sky-400 mb-4 animate-[spin_4s_linear_infinite]" size={48} />
             <div className="text-white text-[11px] font-black tracking-widest text-center mt-2 group-hover:text-sky-300">ISRO SATELLITES</div>
             <div className="text-sky-500/80 text-[9px] mt-2 text-center font-bold tracking-wider">LIVE TELEMETRY</div>
          </div>
        </div>

        {/* 2. CORE PROCESSOR & TERMINAL */}
        <div className="z-10 flex flex-col items-center gap-3 w-64 xl:w-[22rem] cursor-pointer group transition-colors">
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded-md border border-slate-700/50 group-hover:border-rose-500/50 group-hover:text-rose-400 transition-colors">Core Intelligence</div>
          
          <div className="bg-black border-2 border-rose-500/40 rounded-2xl w-full shadow-[0_0_40px_rgba(244,63,94,0.15)] overflow-hidden flex flex-col relative group-hover:border-rose-400 group-hover:shadow-[0_0_50px_rgba(244,63,94,0.3)] transition-colors">
             <div className="absolute inset-0 bg-rose-950/20 pointer-events-none group-hover:bg-rose-950/40 transition-colors"></div>
             <div className="p-5 py-8 border-b border-rose-500/30 flex flex-col items-center relative z-10 shrink-0">
                <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                <Activity className="text-rose-500 mb-3" size={40} />
                <div className="text-white text-[13px] font-black tracking-widest text-center group-hover:text-rose-300 transition-colors">PYTORCH AI ENGINE</div>
                <div className="text-rose-400 text-[9px] font-bold mt-2 tracking-widest bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/20">CRITICAL ANOMALY</div>
             </div>
             
             {/* Mini Terminal inside the Core */}
             <div className="h-56 bg-[#050505] p-5 flex flex-col relative z-10">
                <div className="text-[10px] text-slate-500 mb-2 flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold">ocean_embed_v4.py</span>
                  <span className="text-emerald-500 flex items-center gap-1.5 font-bold tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SYS_ACTIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto text-[9px] leading-relaxed flex flex-col justify-end space-y-1.5">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('CRITICAL') || log.includes('WARNING') ? 'text-rose-400 font-bold' : log.includes('POST') || log.includes('HTTP') ? 'text-sky-400 font-bold' : 'text-emerald-500/90'}>{log}</div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* 3. API GATEWAY */}
        <div className="z-10 flex flex-col items-center gap-3 w-32 xl:w-44 cursor-pointer group transition-colors">
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded-md border border-slate-700/50 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">Gateway</div>
          <div className="bg-black border-2 border-emerald-500/40 rounded-2xl p-6 py-12 w-full shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center backdrop-blur-md relative group-hover:border-emerald-400 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] transition-colors">
             <div className="absolute -inset-1 bg-emerald-500/10 blur-xl rounded-2xl opacity-60"></div>
             <Radio className="text-emerald-400 mb-4 relative z-10 group-hover:animate-pulse" size={48} />
             <div className="text-white text-[12px] font-black tracking-widest text-center relative z-10 mt-2 group-hover:text-emerald-300">REST API</div>
             <div className="text-emerald-400 text-[9px] mt-3 font-bold bg-emerald-950 border border-emerald-500/40 px-3 py-1 rounded relative z-10">BROADCASTING</div>
          </div>
        </div>
        
        {/* 4. HARDWARE ENDPOINTS */}
        <div className="z-10 flex flex-col gap-5 w-52 xl:w-64 relative">
          
          {/* Custom brackets/lines connecting Gateway to Endpoints */}
          <div className="absolute top-1/2 -left-8 xl:-left-12 w-8 xl:w-12 h-[220px] -translate-y-1/2 border-y-2 border-r-2 border-slate-700 rounded-r-xl border-l-0 z-0 opacity-50"></div>
          <div className="absolute top-1/2 -left-8 xl:-left-12 w-8 xl:w-12 h-[2px] bg-slate-700 -translate-y-1/2 z-0 opacity-50"></div>

          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-black/80 px-4 py-1.5 rounded-md text-center mx-auto relative z-10 border border-slate-700/50 cursor-pointer hover:border-white/50 hover:text-white transition-colors shrink-0">Active Endpoints</div>
          
          <div className="flex flex-col gap-6 relative z-10">
            {/* Node 1 */}
            <div className="bg-slate-900 border-2 border-slate-700/50 rounded-2xl p-4 shadow-xl flex items-center gap-3 hover:border-sky-500/50 transition-colors cursor-pointer group">
               <div className="bg-black p-2.5 rounded-full border border-sky-500/40 shrink-0 shadow-lg"><Radio size={20} className="text-sky-400 group-hover:animate-pulse" /></div>
               <div className="flex-1">
                  <div className="text-[9px] text-sky-400 font-bold tracking-widest mb-0.5 group-hover:text-sky-300">LORA PAGER</div>
                  <div className="text-white text-[11px] font-bold tracking-wide">Fisherman #402</div>
                  <div className="text-[9px] text-rose-400 font-bold mt-1.5 bg-rose-950/60 inline-block px-2 py-0.5 rounded shadow-inner animate-pulse">VIBRATING</div>
               </div>
            </div>

            {/* Node 2 */}
            <div className="bg-slate-900 border-2 border-slate-700/50 rounded-2xl p-4 shadow-xl flex items-center gap-3 hover:border-rose-500/50 transition-colors cursor-pointer group">
               <div className="bg-black p-2.5 rounded-full border border-rose-500/40 shrink-0 shadow-lg"><AlertTriangle size={20} className="text-rose-500 group-hover:animate-pulse" /></div>
               <div className="flex-1">
                  <div className="text-[9px] text-rose-400 font-bold tracking-widest mb-0.5 group-hover:text-rose-300">COASTAL SIREN</div>
                  <div className="text-white text-[11px] font-bold tracking-wide">Mumbai Tower 04</div>
                  <div className="text-[9px] text-rose-500 font-bold mt-1.5 bg-rose-950/60 inline-block px-2 py-0.5 rounded shadow-inner">120dB ACTIVE</div>
               </div>
            </div>

            {/* Node 3 */}
            <div className="bg-slate-900 border-2 border-slate-700/50 rounded-2xl p-4 shadow-xl flex items-center gap-3 hover:border-emerald-500/50 transition-colors cursor-pointer group">
               <div className="bg-black p-2.5 rounded-full border border-sky-500/40 shrink-0 shadow-lg"><Target size={20} className="text-sky-400 group-hover:animate-pulse" /></div>
               <div className="flex-1">
                  <div className="text-[9px] text-sky-400 font-bold tracking-widest mb-0.5 group-hover:text-sky-300">TACTICAL HUB</div>
                  <div className="text-white text-[11px] font-bold tracking-wide">CG - Mumbai</div>
                  <div className="text-[9px] text-emerald-400 font-bold mt-1.5 bg-emerald-950/60 inline-block px-2 py-0.5 rounded shadow-inner">DISPATCHED</div>
               </div>
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
