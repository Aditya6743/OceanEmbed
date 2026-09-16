import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Change Chennai to Mumbai
code = code.replace("Coast Guard - Chennai", "Coast Guard - Mumbai")

# 2. Add the compact architecture diagram to the left panel
target_api_box = """                <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-slate-500 leading-tight">
                  // This endpoint broadcasts current anomaly coordinates & severity directly to hardware subscribers.
                </div>
              </div>
            </div>"""

compact_diagram = """                <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-slate-500 leading-tight">
                  // This endpoint broadcasts current anomaly coordinates & severity directly to hardware subscribers.
                </div>
              </div>
            </div>

            {/* Compact Architecture Diagram */}
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

code = code.replace(target_api_box, compact_diagram)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
