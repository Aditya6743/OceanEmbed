import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target_mockup = """      {/* Mobile Phone Mockup */}
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
      </div>"""

pager_mockup = """      {/* LoRa Pager Mockup */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[300px] h-[170px] bg-slate-800 rounded-xl border-b-[6px] border-r-[4px] border-slate-900 relative shadow-2xl flex p-3 gap-3 items-center">
          
          {/* Lanyard/Clip loop on the side */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-12 bg-slate-700 rounded-l-md border-y-2 border-l-2 border-slate-900"></div>
          
          {/* Speaker Grill */}
          <div className="w-10 h-20 flex flex-wrap gap-[3px] justify-center content-center opacity-50 ml-1">
            {[...Array(18)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-black shadow-inner"></div>)}
          </div>

          {/* Main Interface */}
          <div className="flex-1 h-full bg-slate-700 rounded-lg p-2.5 flex flex-col border-t-2 border-l-2 border-slate-600 shadow-inner">
             
             {/* Header Branding */}
             <div className="flex justify-between items-center px-1 mb-1.5">
               <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Off-Grid LoRa RX</span>
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
             </div>
             
             {/* Monochrome LCD Screen */}
             <div className="flex-1 bg-rose-950/80 border-[3px] border-slate-900 rounded p-2 flex flex-col justify-center relative overflow-hidden animate-[pulse_1s_ease-in-out_infinite]">
               {/* LCD Pixel Grid Overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none z-10"></div>
               
               <div className="font-mono text-rose-500 font-bold leading-tight z-0 flex flex-col h-full justify-between">
                  <div className="text-[10px] opacity-90 tracking-wider">! CYCLONE CAT 4 !</div>
                  <div className="text-2xl tracking-widest">EVACUATE</div>
                  <div className="text-[8px] flex justify-between items-end">
                    <span>DIST: 42 NM</span>
                    <span className="animate-pulse bg-rose-500 text-black px-1">LORA LINK OK</span>
                  </div>
               </div>
             </div>

             {/* Physical Buttons */}
             <div className="h-7 mt-2.5 flex justify-between gap-2">
               <div className="flex-1 bg-slate-800 rounded shadow-md border-b-[3px] border-slate-900 relative active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer">
                 <div className="absolute inset-x-0 top-1 h-0.5 bg-slate-700 mx-2 rounded"></div>
               </div>
               <div className="flex-1 bg-slate-800 rounded shadow-md border-b-[3px] border-slate-900 relative active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer">
                 <div className="absolute inset-x-0 top-1 h-0.5 bg-slate-700 mx-2 rounded"></div>
               </div>
               <div className="w-14 bg-rose-700 rounded shadow-md border-b-[3px] border-rose-900 flex items-center justify-center active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer">
                  <span className="text-[7px] text-white font-bold tracking-widest">ACK</span>
               </div>
             </div>

          </div>
        </div>
      </div>"""

code = code.replace(target_mockup, pager_mockup)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
