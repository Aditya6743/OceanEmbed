with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Remove the SATELLITE STREAMS BLOCK
bad_block = """          {/* SATELLITE STREAMS BLOCK */}
          <div className="mt-auto pt-4 border-t border-slate-800 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Radio size={12} className="text-sky-500" />
                Active Data Streams
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400">
                12 CHANNELS
              </span>
            </div>
            
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded px-3 py-2">
                <span className="text-[10px] text-slate-400 font-mono">Surface Weather & SST</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> SYNCED</span>
              </div>
              <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded px-3 py-2">
                <span className="text-[10px] text-slate-400 font-mono">GEBCO Ocean Topography</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> SYNCED</span>
              </div>
            </div>"""
code = code.replace(bad_block, "")

# 2. Replace LIVE INFERENCE in Disaster Management
old_inference = """                  <div className="relative bg-white/5 border border-orange-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-orange-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 transition-opacity duration-700"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-orange-500/10 text-orange-400 opacity-80 transition-opacity">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">LIVE INFERENCE</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-300/80 mb-2">Confidence: <span className="text-orange-300 font-bold">96.4%</span></div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">TCHP thresholds indicate highly favorable conditions for cyclogenesis in the central Arabian Sea over the next 48 hours.</p>
                        </div>
                    </div>
                  </div>"""

new_inference = """                  {/* AI THREAT ASSESSMENT BLOCK */}
                  <div className="relative bg-gradient-to-br from-orange-500/10 to-rose-500/5 border border-orange-500/20 rounded-xl p-4 overflow-hidden mt-4">
                    <div className="flex items-center justify-between mb-3 border-b border-orange-500/10 pb-2">
                      <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle size={12} /> AI CYCLONE PREDICTION
                      </span>
                      <span className="text-[9px] font-mono text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded">RISK: SEVERE</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">3D Heat Content</div>
                        <div className="text-sm text-orange-300 font-mono font-bold">{(liveData.tchp * 1.2).toFixed(1)} <span className="text-[10px] font-sans font-normal text-orange-300/50">kJ/cm²</span></div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">Thermocline Depth</div>
                        <div className="text-sm text-rose-300 font-mono font-bold">95.2 <span className="text-[10px] font-sans font-normal text-rose-300/50">m</span></div>
                      </div>
                    </div>
                    
                    <p className="text-[11px] leading-relaxed text-slate-300/90 font-light bg-black/40 p-2.5 rounded border border-white/5">
                      The 12-channel PINN model detects a massive accumulation of subsurface heat in the Arabian Sea. Immediate evacuation protocols recommended for coastal regions within 500km of the target zone.
                    </p>
                  </div>"""

code = code.replace(old_inference, new_inference)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
print("Updated!")
