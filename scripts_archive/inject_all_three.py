import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Extract everything inside HardwareMockups
target = re.search(r"const HardwareMockups = \(\) => \{\n  return \((.*?)\);\n\}", code, re.DOTALL).group(1)

new_hardware = """
    <div className="flex flex-col gap-4 w-full h-full relative z-20 pointer-events-auto justify-center">
      
      {/* 1. LoRa Pager Mockup (Fisherman) */}
      <div className="flex justify-center items-center shrink-0">
        <div className="w-[300px] h-[150px] bg-slate-800 rounded-xl border-b-[6px] border-r-[4px] border-slate-900 relative shadow-2xl flex p-3 gap-3 items-center">
          
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-12 bg-slate-700 rounded-l-md border-y-2 border-l-2 border-slate-900"></div>
          
          <div className="w-10 h-20 flex flex-wrap gap-[3px] justify-center content-center opacity-50 ml-1">
            {[...Array(18)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-black shadow-inner"></div>)}
          </div>

          <div className="flex-1 h-full bg-slate-700 rounded-lg p-2 flex flex-col border-t-2 border-l-2 border-slate-600 shadow-inner">
             
             <div className="flex justify-between items-center px-1 mb-1.5">
               <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Off-Grid LoRa RX</span>
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
             </div>
             
             <div className="flex-1 bg-rose-950/80 border-[3px] border-slate-900 rounded p-2 flex flex-col justify-center relative overflow-hidden animate-[pulse_1s_ease-in-out_infinite]">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none z-10"></div>
               
               <div className="font-mono text-rose-500 font-bold leading-tight z-0 flex flex-col h-full justify-between">
                  <div className="text-[9px] opacity-90 tracking-wider">! CYCLONE CAT 4 !</div>
                  <div className="text-xl tracking-widest mt-1">EVACUATE</div>
                  <div className="text-[7px] flex justify-between items-end mt-1">
                    <span>DIST: 42 NM</span>
                    <span className="animate-pulse bg-rose-500 text-black px-1">LORA LINK OK</span>
                  </div>
               </div>
             </div>

             <div className="h-6 mt-2 flex justify-between gap-2">
               <div className="flex-1 bg-slate-800 rounded shadow-md border-b-[3px] border-slate-900 relative active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer"></div>
               <div className="flex-1 bg-slate-800 rounded shadow-md border-b-[3px] border-slate-900 relative active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer"></div>
               <div className="w-14 bg-rose-700 rounded shadow-md border-b-[3px] border-rose-900 flex items-center justify-center active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer">
                  <span className="text-[7px] text-white font-bold tracking-widest">ACK</span>
               </div>
             </div>

          </div>
        </div>
      </div>

      {/* 2. Coastal Siren Relay Mockup */}
      <div className="h-[90px] bg-slate-900 border-[3px] border-slate-700 rounded-lg flex items-center p-3 gap-5 shadow-xl relative mx-auto w-full max-w-[340px]">
         {/* Siren Mesh & Light */}
         <div className="w-14 h-14 bg-slate-950 rounded border-2 border-slate-800 shadow-[0_0_30px_#e11d48] flex items-center justify-center relative overflow-hidden shrink-0">
           {/* Flashing Strobe */}
           <div className="absolute inset-0 bg-rose-600 animate-[ping_1.5s_ease-in-out_infinite] opacity-80"></div>
           <div className="absolute inset-1 bg-rose-500 rounded animate-[pulse_0.5s_ease-in-out_infinite] border border-white/40"></div>
         </div>
         
         <div className="flex-1 font-mono text-[10px]">
            <div className="text-slate-400 font-bold mb-1 border-b border-slate-700 pb-1 flex justify-between">
               <span>MUMBAI SIREN #04</span>
               <AlertTriangle size={10} className="text-rose-500" />
            </div>
            <div className="text-rose-500 font-black text-lg animate-pulse tracking-widest mt-1">SIREN ACTIVE</div>
            <div className="text-emerald-400 mt-0.5 flex justify-between text-[8px]">
              <span>VOL: 120dB</span>
              <span className="font-bold bg-emerald-950 px-1 rounded">LORA RX: OK</span>
            </div>
         </div>
      </div>

      {/* 3. Coast Guard Terminal Mockup */}
      <div className="flex-1 min-h-[160px] max-h-[180px] bg-slate-900 border border-sky-500/40 rounded-xl overflow-hidden flex flex-col relative shadow-[0_0_20px_rgba(14,165,233,0.1)]">
         <div className="h-6 bg-sky-950 border-b border-sky-500/20 flex items-center px-4 justify-between shrink-0">
            <span className="text-[9px] text-sky-400 font-bold tracking-widest uppercase">Coast Guard Tactical Hub</span>
            <Target size={12} className="text-sky-400" />
         </div>
         <div className="flex-1 p-3 grid grid-cols-2 gap-4">
            <div className="border border-sky-500/20 bg-sky-950/20 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:10px_10px]"></div>
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="absolute w-20 h-20 border border-sky-500/30 rounded-full animate-ping"></div>
                <div className="absolute w-10 h-10 border border-sky-500/50 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
              </div>
            </div>
            <div className="flex flex-col justify-center font-mono text-[9px] gap-2">
               <div className="text-rose-400 font-bold border-b border-rose-500/20 pb-1">TARGET: CYCLONE</div>
               <div className="text-sky-400">COORD: 18.9220 N, 72.8347 E</div>
               <div className="text-slate-400">NODES ALERTED: 14,204</div>
               <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded p-1 text-center font-bold mt-2">HELI-1 DISPATCHED</div>
            </div>
         </div>
      </div>
    </div>
"""

code = code.replace(target, new_hardware)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
