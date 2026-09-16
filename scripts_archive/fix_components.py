import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

components_code = """
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
      "> BROADCAST PROTOCOL: LoRaWAN 868MHz / Sat-Com",
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
          <div key={idx} className={`${log.includes('WARNING') || log.includes('CRITICAL') ? 'text-rose-400 font-bold' : log.includes('POST') || log.includes('HTTP') || log.includes('LoRaWAN') ? 'text-sky-400' : 'text-emerald-500'}`}>
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
               CAT 4 CYCLONE DETECTED<br/>DISTANCE: 42 NM<br/><span className="text-emerald-400 font-bold mt-1 inline-block">[ LoRaWAN LINK ]</span>
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

target = "type ViewMode = 'climate' | 'navy' | 'fishery' | 'cable' | 'enso' | 'iot';"
code = code.replace(target, target + "\n\n" + components_code)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
