with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Add climateMode state
state_old = "const [activeTab, setActiveTab] = useState<ViewMode>('climate');"
state_new = "const [activeTab, setActiveTab] = useState<ViewMode>('climate');\n  const [climateMode, setClimateMode] = useState<'cyclone'|'flood'|'heatwave'|'erosion'>('cyclone');"
code = code.replace(state_old, state_new)

# Update MosdacGlobe prop
globe_old = "<MosdacGlobe viewMode={activeTab} isRotationLocked={isRotationLocked} />"
globe_new = "<MosdacGlobe viewMode={activeTab} climateSubMode={climateMode} isRotationLocked={isRotationLocked} />"
code = code.replace(globe_old, globe_new)

# Replace the 2x2 grid with 4 selectable tabs and a single detail card
climate_ui_old = """              <div className="grid grid-cols-2 gap-3 pr-2">
                  {/* 1. Cyclone Intensification */}
                  <div className="bg-black/40 border border-orange-500/30 rounded-lg p-4 relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-3">
                      <ThermometerSun className="w-3.5 h-3.5 text-orange-400" />
                      <h3 className="text-orange-50 text-[10px] font-bold tracking-wider uppercase">Cyclone Intensification</h3>
                    </div>
                    <div className="text-2xl font-mono text-orange-400 mb-1">{liveData.tchp.toFixed(1)}<span className="text-[10px] text-orange-400/50 ml-1">kJ/cm²</span></div>
                    <div className="text-[9px] text-white/50 leading-relaxed font-light mt-2 pt-2 border-t border-orange-500/10">High TCHP drives rapid cyclone intensification.</div>
                  </div>

                  {/* 2. Smart City Flood Defense */}
                  <div className="bg-black/40 border border-sky-500/30 rounded-lg p-4 relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-3.5 h-3.5 text-sky-400" />
                      <h3 className="text-sky-50 text-[10px] font-bold tracking-wider uppercase">City Flood Defense</h3>
                    </div>
                    <div className="text-2xl font-mono text-sky-400 mb-1">{liveData.ssh > 0 ? '+' : ''}{liveData.ssh.toFixed(2)}<span className="text-[10px] text-sky-400/50 ml-1">m</span></div>
                    <div className="text-[9px] text-white/50 leading-relaxed font-light mt-2 pt-2 border-t border-sky-500/10">Sea Surface Height (SSH) indicates coastal surge risks.</div>
                  </div>

                  {/* 3. Marine Heatwaves */}
                  <div className="bg-black/40 border border-rose-500/30 rounded-lg p-4 relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-3">
                      <ThermometerSun className="w-3.5 h-3.5 text-rose-400" />
                      <h3 className="text-rose-50 text-[10px] font-bold tracking-wider uppercase">Marine Heatwaves</h3>
                    </div>
                    <div className="text-2xl font-mono text-rose-400 mb-1">{liveData.sst.toFixed(1)}<span className="text-[10px] text-rose-400/50 ml-1">°C</span></div>
                    <div className="text-[9px] text-white/50 leading-relaxed font-light mt-2 pt-2 border-t border-rose-500/10">SST &gt; 29.5°C triggers coral bleaching &amp; collapse.</div>
                  </div>

                  {/* 4. Regional Coastal Erosion */}
                  <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-4 relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-3">
                      <Wind className="w-3.5 h-3.5 text-emerald-400" />
                      <h3 className="text-emerald-50 text-[10px] font-bold tracking-wider uppercase">Coastal Erosion</h3>
                    </div>
                    <div className="text-2xl font-mono text-emerald-400 mb-1">{Math.sqrt(liveData.u**2 + liveData.v**2).toFixed(2)}<span className="text-[10px] text-emerald-400/50 ml-1">m/s</span></div>
                    <div className="text-[9px] text-white/50 leading-relaxed font-light mt-2 pt-2 border-t border-emerald-500/10">Near-shore geostrophic currents accelerate erosion.</div>
                  </div>
              </div>
              
              <div className="relative bg-white/5 border border-sky-500/10 rounded-xl p-4 mt-4 overflow-hidden group hover:bg-white/10 hover:border-sky-500/20">
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2 rounded-lg border border-sky-500/10 text-sky-400">
                            <Activity className="w-3 h-3" />
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-medium tracking-widest text-sky-300/90 uppercase mb-1">Live Multi-Threat Assessment</div>
                        <div className="text-slate-300/70 text-[11px] leading-relaxed font-light group-hover:text-slate-200">
                            System monitoring all 4 variables. Currently predicting nominal coastal erosion but elevated heatwave probability in sector {Math.floor(liveData.lat)}-{liveData.lon > 60 ? 'Alpha' : 'Beta'}.
                        </div>
                    </div>
                </div>
              </div>"""

climate_ui_new = """              {/* Sub-Tabs for Disaster Management */}
              <div className="grid grid-cols-2 gap-2 mb-4 pr-2">
                <button onClick={() => setClimateMode('cyclone')} className={`py-2 px-3 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${climateMode === 'cyclone' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-black/40 text-slate-500 border border-white/5 hover:bg-white/5 hover:text-slate-300'}`}>Cyclone</button>
                <button onClick={() => setClimateMode('flood')} className={`py-2 px-3 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${climateMode === 'flood' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'bg-black/40 text-slate-500 border border-white/5 hover:bg-white/5 hover:text-slate-300'}`}>Flood Defense</button>
                <button onClick={() => setClimateMode('heatwave')} className={`py-2 px-3 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${climateMode === 'heatwave' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-black/40 text-slate-500 border border-white/5 hover:bg-white/5 hover:text-slate-300'}`}>Heatwaves</button>
                <button onClick={() => setClimateMode('erosion')} className={`py-2 px-3 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${climateMode === 'erosion' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-black/40 text-slate-500 border border-white/5 hover:bg-white/5 hover:text-slate-300'}`}>Erosion</button>
              </div>

              {climateMode === 'cyclone' && (
                  <div className="bg-black/40 border border-orange-500/30 rounded-lg p-5 relative overflow-hidden group mb-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-500/20 rounded border border-orange-500/30"><ThermometerSun className="w-4 h-4 text-orange-400" /></div>
                      <h3 className="text-orange-50 text-xs font-bold tracking-wider uppercase">Cyclone Intensification</h3>
                    </div>
                    <div className="text-4xl font-mono text-orange-400 mb-2">{liveData.tchp.toFixed(1)}<span className="text-sm text-orange-400/50 ml-2">kJ/cm²</span></div>
                    <div className="text-[11px] text-white/50 leading-relaxed font-light mt-4 pt-3 border-t border-orange-500/10">High Tropical Cyclone Heat Potential drives rapid storm intensification. The deep learning architecture computes the integrated heat above the 26°C isotherm.</div>
                  </div>
              )}

              {climateMode === 'flood' && (
                  <div className="bg-black/40 border border-sky-500/30 rounded-lg p-5 relative overflow-hidden group mb-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-sky-500/20 rounded border border-sky-500/30"><Activity className="w-4 h-4 text-sky-400" /></div>
                      <h3 className="text-sky-50 text-xs font-bold tracking-wider uppercase">Smart City Flood Defense</h3>
                    </div>
                    <div className="text-4xl font-mono text-sky-400 mb-2">{liveData.ssh > 0 ? '+' : ''}{liveData.ssh.toFixed(2)}<span className="text-sm text-sky-400/50 ml-2">m</span></div>
                    <div className="text-[11px] text-white/50 leading-relaxed font-light mt-4 pt-3 border-t border-sky-500/10">Sea Surface Height (SSH) anomalies indicate extreme coastal surge and urban flooding risk levels.</div>
                  </div>
              )}

              {climateMode === 'heatwave' && (
                  <div className="bg-black/40 border border-rose-500/30 rounded-lg p-5 relative overflow-hidden group mb-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-rose-500/20 rounded border border-rose-500/30"><ThermometerSun className="w-4 h-4 text-rose-400" /></div>
                      <h3 className="text-rose-50 text-xs font-bold tracking-wider uppercase">Marine Heatwaves</h3>
                    </div>
                    <div className="text-4xl font-mono text-rose-400 mb-2">{liveData.sst.toFixed(1)}<span className="text-sm text-rose-400/50 ml-2">°C</span></div>
                    <div className="text-[11px] text-white/50 leading-relaxed font-light mt-4 pt-3 border-t border-rose-500/10">SST consistently sustained above 29.5°C triggers immediate coral bleaching events and irreversible ecosystem collapse.</div>
                  </div>
              )}

              {climateMode === 'erosion' && (
                  <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-5 relative overflow-hidden group mb-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500/20 rounded border border-emerald-500/30"><Wind className="w-4 h-4 text-emerald-400" /></div>
                      <h3 className="text-emerald-50 text-xs font-bold tracking-wider uppercase">Regional Coastal Erosion</h3>
                    </div>
                    <div className="text-4xl font-mono text-emerald-400 mb-2">{Math.sqrt(liveData.u**2 + liveData.v**2).toFixed(2)}<span className="text-sm text-emerald-400/50 ml-2">m/s</span></div>
                    <div className="text-[11px] text-white/50 leading-relaxed font-light mt-4 pt-3 border-t border-emerald-500/10">Extreme near-shore geostrophic currents accelerate severe coastal degradation and critical habitat loss.</div>
                  </div>
              )}"""
code = code.replace(climate_ui_old, climate_ui_new)

# Update Legend Scales
legend_scale_old = """                  activeTab === 'climate' ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :"""
legend_scale_new = """                  activeTab === 'climate' && climateMode === 'cyclone' ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :
                  activeTab === 'climate' && climateMode === 'flood' ? 'linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? 'linear-gradient(to right, #000000, #b30000, #ff3300, #ffcc00, #ffffff)' :
                  activeTab === 'climate' && climateMode === 'erosion' ? 'linear-gradient(to right, #ffffd9, #c7e9b4, #41b6c4, #225ea8, #081d58)' :"""
code = code.replace(legend_scale_old, legend_scale_new)

legend_text1_old = """                  activeTab === 'climate' ? '0 kJ/cm²' :"""
legend_text1_new = """                  activeTab === 'climate' && climateMode === 'cyclone' ? '0 kJ/cm²' :
                  activeTab === 'climate' && climateMode === 'flood' ? '-0.5 m' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? '25 °C' :
                  activeTab === 'climate' && climateMode === 'erosion' ? '0 m/s' :"""
code = code.replace(legend_text1_old, legend_text1_new)

legend_text2_old = """                  activeTab === 'climate' ? '>150 kJ/cm²' :"""
legend_text2_new = """                  activeTab === 'climate' && climateMode === 'cyclone' ? '>150 kJ/cm²' :
                  activeTab === 'climate' && climateMode === 'flood' ? '+1.0 m' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? '>35 °C' :
                  activeTab === 'climate' && climateMode === 'erosion' ? '>2.0 m/s' :"""
code = code.replace(legend_text2_old, legend_text2_new)


with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
