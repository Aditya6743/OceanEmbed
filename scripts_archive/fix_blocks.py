with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# FLOOD
old_flood = """                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">CRITICAL INUNDATION ZONE</span>
                  </div>"""

new_flood = """                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">CRITICAL INUNDATION ZONE</span>
                  </div>

                  {/* AI THREAT ASSESSMENT BLOCK */}
                  <div className="relative bg-white/5 border border-blue-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mt-2">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-blue-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-blue-500/10 text-blue-400 opacity-80">
                                <Target className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">AI INUNDATION PREDICTION</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>SSH Anomaly: <span className="text-blue-300 font-bold">+1.4m</span></div>
                                <div>Wave Speed: <span className="text-cyan-300 font-bold">12.5 m/s</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model detects abnormal coastal water displacement. Coastal barriers on the eastern seaboard should be reinforced immediately.</p>
                        </div>
                    </div>
                  </div>"""

# HEATWAVE
old_hw = """                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-red-400 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">SEVERE HEAT STRESS ZONE</span>
                  </div>"""

new_hw = """                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-red-400 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">SEVERE HEAT STRESS ZONE</span>
                  </div>

                  {/* AI THREAT ASSESSMENT BLOCK */}
                  <div className="relative bg-white/5 border border-red-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mt-2">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-red-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-red-500/10 text-red-400 opacity-80">
                                <ThermometerSun className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-red-400 font-bold text-xs uppercase tracking-widest">AI CORAL BLEACHING ALERT</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>SST Temp: <span className="text-red-300 font-bold">33.2°C</span></div>
                                <div>Exposure: <span className="text-orange-300 font-bold">14 Days</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model predicts severe ecosystem collapse in the reef zones. Immediate suspension of commercial fishing in the highlighted quadrant is mandatory.</p>
                        </div>
                    </div>
                  </div>"""

# EROSION
old_er = """                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH VELOCITY SHEAR ZONE</span>
                  </div>"""

new_er = """                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH VELOCITY SHEAR ZONE</span>
                  </div>

                  {/* AI THREAT ASSESSMENT BLOCK */}
                  <div className="relative bg-white/5 border border-emerald-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mt-2">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-emerald-500/10 text-emerald-400 opacity-80">
                                <Wind className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">AI SHEAR PREDICTION</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>Vector: <span className="text-emerald-300 font-bold">2.8 m/s</span></div>
                                <div>Friction: <span className="text-teal-300 font-bold">0.84 μ</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model detects abnormal seabed shear stress driven by extreme coastal currents. Maritime infrastructure projects should halt.</p>
                        </div>
                    </div>
                  </div>"""

code = code.replace(old_flood, new_flood)
code = code.replace(old_hw, new_hw)
code = code.replace(old_er, new_er)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
