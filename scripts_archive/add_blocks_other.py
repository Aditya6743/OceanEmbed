with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# NAVY
old_navy = """              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-teal-400 rounded-sm shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">MAXIMUM NEGATIVE SOUND GRADIENT</span>
              </div>"""

new_navy = """              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-teal-400 rounded-sm shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">MAXIMUM NEGATIVE SOUND GRADIENT</span>
              </div>

              {/* AI THREAT ASSESSMENT BLOCK */}
              <div className="relative bg-white/5 border border-teal-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mt-2">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-teal-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-teal-500/10 text-teal-400 opacity-80">
                            <Radar className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-teal-400 font-bold text-xs uppercase tracking-widest">AI SONAR EVASION PREDICTION</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                            <div>Gradient: <span className="text-teal-300 font-bold">{(liveData.gradient * 100).toFixed(2)} kPa</span></div>
                            <div>Max Range: <span className="text-emerald-300 font-bold">4.2 NM</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model confirms optimal acoustic shielding at current depth. Active enemy sonar will refract sharply upwards.</p>
                    </div>
                </div>
              </div>"""


# FISHERY
old_fishery = """              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">OPTIMAL CATCH ZONE (SST ANOMALY)</span>
              </div>"""

new_fishery = """              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">OPTIMAL CATCH ZONE (SST ANOMALY)</span>
              </div>

              {/* AI THREAT ASSESSMENT BLOCK */}
              <div className="relative bg-white/5 border border-emerald-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mt-2">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-emerald-500/10 text-emerald-400 opacity-80">
                            <Fish className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">AI UPWELLING PREDICTION</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                            <div>Density: <span className="text-emerald-300 font-bold">High</span></div>
                            <div>Nutrients: <span className="text-teal-300 font-bold">12.4 mg/L</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model detects massive nutrient upwelling driven by cyclonic eddies. Commercial fleets authorized to deploy.</p>
                    </div>
                </div>
              </div>"""

# CABLE
old_cable = """              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-indigo-400 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">BENTHIC THERMAL GRADIENT</span>
              </div>"""

new_cable = """              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-indigo-400 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">BENTHIC THERMAL GRADIENT</span>
              </div>

              {/* AI THREAT ASSESSMENT BLOCK */}
              <div className="relative bg-white/5 border border-indigo-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mt-2">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-indigo-500/10 text-indigo-400 opacity-80">
                            <Anchor className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">AI STRUCTURAL PREDICTION</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                            <div>Integrity: <span className="text-indigo-300 font-bold">98.2%</span></div>
                            <div>Stress: <span className="text-blue-300 font-bold">Low</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model validates safe routing for benthic cables. Deep-ocean thermal ranges are stable, minimizing structural degradation.</p>
                    </div>
                </div>
              </div>"""

if old_navy in code:
    code = code.replace(old_navy, new_navy)
if old_fishery in code:
    code = code.replace(old_fishery, new_fishery)
if old_cable in code:
    code = code.replace(old_cable, new_cable)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
print("Updated Navy, Fishery, and Cable tabs")
