import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

bad_panel = """          {activeTab === 'iot' && (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
               <div className="mb-6">
                 <div className="flex items-center gap-3 mb-4">
                   <Radio className="text-sky-400" size={24} />
                   <h2 className="text-2xl font-black text-white tracking-wide">IoT BEACONS</h2>
                 </div>
                 <p className="text-slate-400 text-xs leading-relaxed font-light mb-6">
                   Live integration with edge hardware. Alerting coastal zones via low-bandwidth LoRa pagers when spatial anomalies cross critical thresholds.
                 </p>
                 <div className="bg-slate-900 border border-slate-700/50 rounded-lg p-4">
                   <div className="text-[10px] text-slate-500 font-mono mb-2 uppercase">Broadcast Endpoint</div>
                   <div className="text-sky-400 text-xs font-mono font-bold bg-black p-2 rounded">POST /api/v1/iot/broadcast</div>
                 </div>
               </div>
            </div>
          )}"""

good_panel = """          {activeTab === 'iot' && (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
               <div className="mb-6">
                 <div className="flex items-center gap-3 mb-4">
                   <Radio className="text-sky-400" size={24} />
                   <h2 className="text-2xl font-black text-white tracking-wide">IoT BEACONS</h2>
                 </div>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                     <span className="text-slate-300 text-xs font-light">Edge Hardware Integration</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                     <span className="text-slate-300 text-xs font-light">Off-Grid LoRaWAN Broadcasts</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                     <span className="text-slate-300 text-xs font-light">Automated Evacuation Paging</span>
                   </div>
                 </div>

                 <div className="bg-slate-900 border border-slate-700/50 rounded-lg p-3">
                   <div className="text-sky-400 text-xs font-mono font-bold">POST /api/v1/iot/broadcast</div>
                 </div>
               </div>
            </div>
          )}"""

code = code.replace(bad_panel, good_panel)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
