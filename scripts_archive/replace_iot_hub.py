import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Match the old components block
target_components = re.search(r"// ----------------------------------------------------\n// IOT SIMULATOR COMPONENTS\n// ----------------------------------------------------(.*?)type ViewMode", code, re.DOTALL).group(1)

new_hub_component = """
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
      setLogs(prev => [...prev, newLogs[i % newLogs.length]].slice(-14));
      i++;
    }, 800);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full p-8 grid grid-cols-12 gap-8 relative z-20 pointer-events-auto font-mono max-w-7xl mx-auto">
      
      {/* Main Content Area (Left 8 cols) */}
      <div className="col-span-8 flex flex-col gap-8 h-full">
        
        {/* Top: Radar / Threat Visualization */}
        <div className="flex-[3] bg-black/60 border border-sky-500/20 rounded-3xl shadow-[0_0_50px_rgba(14,165,233,0.05)] overflow-hidden flex relative backdrop-blur-md">
           <div className="w-[45%] h-full border-r border-sky-500/20 flex items-center justify-center relative overflow-hidden bg-sky-950/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1)_0,transparent_70%)]"></div>
              {/* Radar Circles */}
              <div className="w-56 h-56 border border-sky-500/30 rounded-full flex items-center justify-center relative">
                 <div className="w-36 h-36 border border-sky-500/20 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 border border-sky-500/10 rounded-full"></div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 w-28 h-0.5 bg-gradient-to-r from-sky-400 to-transparent origin-left animate-[spin_3s_linear_infinite]"></div>
                 
                 {/* Blips */}
                 <div className="absolute top-12 right-12 w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
                 <div className="absolute top-12 right-12 w-2 h-2 bg-white rounded-full"></div>
                 <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                 <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
              </div>
           </div>
           
           <div className="w-[55%] p-8 flex flex-col justify-center">
              <h3 className="text-sky-400 text-[11px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <Target size={14}/> Threat Acquired
              </h3>
              <div className="text-4xl text-white font-black mb-2 tracking-wide">CYCLONE <span className="text-rose-500">CAT-4</span></div>
              <div className="text-slate-400 text-sm mb-6 font-light">COORD: 18.922°N, 72.834°E</div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-sky-950/30 border border-sky-500/20 rounded-xl p-4">
                    <div className="text-[10px] text-sky-400/70 uppercase font-bold">Evac Radius</div>
                    <div className="text-white font-bold mt-1 text-lg">42.5 NM</div>
                 </div>
                 <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4">
                    <div className="text-[10px] text-rose-400/70 uppercase font-bold">TCHP Energy</div>
                    <div className="text-white font-bold mt-1 text-lg">> 140 <span className="text-xs text-rose-400/50">kJ/cm²</span></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom: Terminal Log */}
        <div className="flex-[2] bg-[#030303] border border-slate-800 rounded-3xl p-5 overflow-hidden flex flex-col shadow-2xl relative">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
           <div className="text-[10px] text-slate-500 mb-3 flex justify-between border-b border-slate-800 pb-3 relative z-10">
             <span className="font-bold">ocean_embed_core_v4.py</span>
             <span className="text-emerald-500 flex items-center gap-2 font-bold tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> SYS_ACTIVE</span>
           </div>
           <div className="flex-1 overflow-y-auto text-[11px] leading-relaxed flex flex-col justify-end space-y-1.5 relative z-10">
              {logs.map((log, i) => (
                <div key={i} className={log.includes('CRITICAL') || log.includes('WARNING') ? 'text-rose-400 font-bold' : log.includes('POST') || log.includes('HTTP') ? 'text-sky-400 font-bold' : 'text-emerald-500/80'}>{log}</div>
              ))}
           </div>
        </div>

      </div>

      {/* Right Area (Right 4 cols): Node Hardware Roster */}
      <div className="col-span-4 bg-black/80 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-5 border-b border-slate-800 bg-slate-900/30">
          <div className="text-white text-xs font-bold uppercase tracking-widest flex justify-between items-center">
            <span>Active Endpoints</span>
            <span className="bg-rose-500/20 border border-rose-500/30 text-rose-400 px-2 py-1 rounded text-[9px] animate-pulse">14,204 NODES ALERTED</span>
          </div>
        </div>
        
        <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
           
           {/* Node 1 */}
           <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 shadow-lg hover:border-slate-500/50 transition-colors">
             <div className="flex justify-between items-start mb-3">
               <div>
                 <div className="text-[9px] text-sky-400 font-bold tracking-widest mb-0.5">LORA PAGER</div>
                 <div className="text-white text-sm font-bold">Fisherman Fleet #402</div>
               </div>
               <Radio size={16} className="text-sky-500" />
             </div>
             <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-full animate-pulse"></div></div>
               <span className="text-[10px] text-rose-400 font-black tracking-widest">VIBRATING</span>
             </div>
             <div className="text-[9px] text-emerald-500/70 mt-3 border-t border-slate-800 pt-2 font-bold">LINK: LoRaWAN 868MHz (ACK: 12ms)</div>
           </div>

           {/* Node 2 */}
           <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 shadow-lg hover:border-slate-500/50 transition-colors">
             <div className="flex justify-between items-start mb-3">
               <div>
                 <div className="text-[9px] text-rose-400 font-bold tracking-widest mb-0.5">COASTAL SIREN</div>
                 <div className="text-white text-sm font-bold">Mumbai Tower 04</div>
               </div>
               <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
             </div>
             <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-full animate-pulse"></div></div>
               <span className="text-[10px] text-rose-500 font-black tracking-widest">120dB ACTIVE</span>
             </div>
             <div className="text-[9px] text-emerald-500/70 mt-3 border-t border-slate-800 pt-2 font-bold">LINK: LoRaWAN 868MHz (ACK: 8ms)</div>
           </div>

           {/* Node 3 */}
           <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 shadow-lg hover:border-slate-500/50 transition-colors">
             <div className="flex justify-between items-start mb-3">
               <div>
                 <div className="text-[9px] text-sky-400 font-bold tracking-widest mb-0.5">TACTICAL HUB</div>
                 <div className="text-white text-sm font-bold">Coast Guard - Chennai</div>
               </div>
               <Target size={16} className="text-sky-400" />
             </div>
             <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full"></div></div>
               <span className="text-[10px] text-emerald-400 font-black tracking-widest">DISPATCHED</span>
             </div>
             <div className="text-[9px] text-sky-500/70 mt-3 border-t border-slate-800 pt-2 font-bold">LINK: Encrypted Sat-Com (ACK: 45ms)</div>
           </div>

        </div>
      </div>
      
    </div>
  );
}

"""
code = code.replace(target_components, "\n" + new_hub_component + "\n\n")

target_ui = """      {activeTab === 'iot' && (
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

new_ui = """      {activeTab === 'iot' && (
        <div className="absolute inset-0 z-0 pl-[35%] pt-20 bg-[#030712] flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          <IotHubDashboard />
        </div>
      )}"""
code = code.replace(target_ui, new_ui)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
