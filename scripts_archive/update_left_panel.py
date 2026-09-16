import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# The original block in the left panel
target_left_iot = """        {activeTab === 'iot' && (
          <div className="animate-fade-in relative z-10 pointer-events-auto mt-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
              <Radio className="text-rose-500" size={24} /> 
              IoT Early Warning
            </h2>
            <div className="mt-6 text-[11px] text-slate-400 leading-loose">
              To bridge the digital divide between advanced scientists and citizens on the front lines, we integrated an <strong className="text-rose-400 font-bold">Automated IoT Early Warning Ecosystem</strong> directly into our PyTorch backend. 
              <br/><br/>
              While our AI continuously scans the 3D ocean for lethal threats like cyclones or storm surges, it acts immediately on the data. Upon detecting a severe anomaly, the AI updates a live REST API endpoint—which we proudly expose directly on our UI—allowing any cheap, off-the-shelf microchip to connect to our network instantly.
              <br/><br/>
              Through this simple API, our software can automatically trigger vibrating pocket beacons for offline fishermen at sea, automated sirens for vulnerable coastal villages, and coordinate pings for Coast Guard rescue terminals. By transforming complex oceanographic math into a plug-and-play hardware API, our platform goes beyond visualizing data to <strong className="text-white font-bold">actively saving lives.</strong>
            </div>

            <div className="mt-8 bg-black/80 border border-rose-500/30 rounded-xl p-5 font-mono text-[10px] shadow-[0_0_30px_rgba(244,63,94,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
              
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
                <span className="text-rose-400 flex items-center gap-2">
                  <Activity size={12} className="animate-pulse" /> 
                  REST API // LIVE ENDPOINT
                </span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 
                  ONLINE
                </span>
              </div>
              
              <div className="text-slate-500 mb-6 bg-white/5 p-2 rounded border border-white/10">
                GET <span className="text-sky-400">/api/v1/iot/alert-status?target=all</span>
                <br/>
                <span className="text-emerald-500 mt-1 block">HTTP/1.1 200 OK</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-rose-500/10 p-2 rounded border border-rose-500/20">
                  <span className="text-slate-300">Pocket Beacon #402 (Fisherman)</span> 
                  <span className="text-rose-400 animate-pulse font-bold bg-rose-500/20 px-2 py-1 rounded">VIBRATING</span>
                </div>
                <div className="flex items-center justify-between bg-rose-500/10 p-2 rounded border border-rose-500/20">
                  <span className="text-slate-300">Coastal Siren (Mumbai)</span> 
                  <span className="text-rose-400 animate-pulse font-bold bg-rose-500/20 px-2 py-1 rounded">SIREN ACTIVE</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/10">
                  <span className="text-slate-300">Coast Guard Terminal HQ</span> 
                  <span className="text-sky-400 font-bold">COORDINATES SENT</span>
                </div>
              </div>
            </div>
          </div>
        )}"""

replacement_left_iot = """        {activeTab === 'iot' && (
          <div className="animate-fade-in relative z-10 pointer-events-auto mt-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
              <Radio className="text-rose-500" size={24} /> 
              IoT Early Warning
            </h2>
            
            <div className="mt-6 text-[11px] text-slate-400 leading-relaxed space-y-4">
              <p className="font-bold text-slate-300 text-xs">
                Bridging the digital divide between advanced scientists and frontline citizens.
              </p>
              
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span><strong className="text-rose-400">Continuous AI Scanning:</strong> Our PyTorch backend monitors 3D ocean models for lethal threats (cyclones, storm surges).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span><strong className="text-rose-400">Zero-Latency Triggers:</strong> Instant anomaly detection directly updates our public REST API endpoint.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span><strong className="text-rose-400">Plug-and-Play Hardware:</strong> Any cheap, off-the-shelf microchip can connect instantly to receive life-saving alerts.</span>
                </li>
              </ul>
              
              <p className="border-t border-white/10 pt-4 text-white font-bold italic">
                By transforming complex oceanographic math into a simple hardware API, our platform actively saves lives.
              </p>
            </div>

            <div className="mt-8 bg-black/80 border border-rose-500/30 rounded-xl p-5 font-mono text-[10px] shadow-[0_0_30px_rgba(244,63,94,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
              
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
                <span className="text-rose-400 flex items-center gap-2">
                  <Activity size={12} className="animate-pulse" /> 
                  REST API // LIVE ENDPOINT
                </span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 
                  ONLINE
                </span>
              </div>
              
              <div className="text-slate-500 bg-white/5 p-3 rounded border border-white/10 shadow-inner">
                <div className="mb-2">
                  <span className="text-slate-400">Method:</span> <span className="text-emerald-400 font-bold">GET</span>
                </div>
                <div className="mb-2">
                  <span className="text-slate-400">URL:</span> <span className="text-sky-400 break-all">/api/v1/iot/alert-status?target=all</span>
                </div>
                <div className="mb-2">
                  <span className="text-slate-400">Status:</span> <span className="text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded">HTTP/1.1 200 OK</span>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-slate-500 leading-tight">
                  // This endpoint broadcasts current anomaly coordinates & severity directly to hardware subscribers.
                </div>
              </div>
            </div>
          </div>
        )}"""

code = code.replace(target_left_iot, replacement_left_iot)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
