import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Find the start point
start_marker = "          {activeTab === 'climate' && ("
# Find the end point
end_marker = '            <div className="mt-auto pt-4 border-t border-slate-800">'

prefix = code[:code.find(start_marker)]
suffix = code[code.find(end_marker):]

new_center = """          {activeTab === 'climate' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col h-full">
              <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2 shrink-0">
                 <button onClick={() => setClimateMode('cyclone')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'cyclone' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>CYCLONE</button>
                 <button onClick={() => setClimateMode('flood')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'flood' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>TSUNAMI / FLOOD</button>
                 <button onClick={() => setClimateMode('heatwave')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'heatwave' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>MARINE HEATWAVE</button>
                 <button onClick={() => setClimateMode('erosion')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'erosion' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>COASTAL EROSION</button>
              </div>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              
              {/* CYCLONE (ORANGE) */}
              {climateMode === 'cyclone' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-orange-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><AlertTriangle size={20}/> Tropical Cyclones</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Mapping deep ocean heat content (TCHP) up to 1000m to predict rapid cyclone intensification before surface storms form.</p>
                  
                  <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest block mb-2">Operational Directive</span>
                    <span className="text-[13px] text-orange-200/80 leading-relaxed block font-light">Monitor the TCHP dial below. If the live AI indicates a value entering the Critical Danger Zone ({">"}60 kJ/cm²), issue immediate evacuation warnings for adjacent coastal regions.</span>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-orange-500/10 mb-4 relative overflow-hidden shadow-lg">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Tropical Cyclone Heat Potential</div>
                    <div className="text-4xl font-mono text-orange-300">{(liveData.tchp * 1.2).toFixed(1)} <span className="text-lg text-orange-300/50">kJ/cm²</span></div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-orange-400 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH CYCLOGENESIS RISK ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-orange-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-orange-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-orange-500/10 text-orange-400 opacity-80">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">AI CYCLONE PREDICTION</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>3D Heat: <span className="text-orange-300 font-bold">{(liveData.tchp * 1.2).toFixed(1)}</span></div>
                                <div>Thermocline: <span className="text-orange-300 font-bold">95.2m</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model detects a severe subsurface heat accumulation in the Arabian Sea. Evacuation protocols recommended.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOOD (BLUE) */}
              {climateMode === 'flood' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-blue-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Target size={20}/> Tsunami & Flooding</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Monitoring Sea Surface Height (SSH) anomalies to detect massive water displacement events and project coastal inundation vectors.</p>
                  
                  <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest block mb-2">Tactical Action</span>
                    <span className="text-[13px] text-blue-200/80 leading-relaxed block font-light">Observe the SSH map for extreme positive anomalies (+1.0m or higher). These indicate severe flooding risks for low-lying regions.</span>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-blue-500/10 mb-4 relative overflow-hidden shadow-lg">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Sea Surface Height Anomaly</div>
                    <div className="text-4xl font-mono text-blue-300">+1.42 <span className="text-lg text-blue-300/50">m</span></div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">CRITICAL INUNDATION ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-blue-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
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
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>Wave Speed: <span className="text-blue-300 font-bold">12.5 m/s</span></div>
                                <div>Impact Time: <span className="text-cyan-300 font-bold">42 mins</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model detects abnormal coastal water displacement. Coastal barriers on the eastern seaboard should be reinforced immediately.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* HEATWAVE (RED) */}
              {climateMode === 'heatwave' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-red-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><ThermometerSun size={20}/> Marine Heatwaves</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Tracking extreme spikes in Sea Surface Temperature (SST) that disrupt local ecosystems, bleach coral reefs, and destabilize the fishing economy.</p>
                  
                  <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest block mb-2">Coral Bleaching Alert</span>
                    <span className="text-[13px] text-red-200/80 leading-relaxed block font-light">SST values exceeding 32°C for sustained periods trigger automated bleaching alerts for the Lakshadweep and Andaman reef systems.</span>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-red-500/10 mb-4 relative overflow-hidden shadow-lg">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Peak Surface Temperature</div>
                    <div className="text-4xl font-mono text-red-300">33.2 <span className="text-lg text-red-300/50">°C</span></div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-red-400 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">SEVERE HEAT STRESS ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-red-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
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
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>Anomaly: <span className="text-red-300 font-bold">+3.8°C</span></div>
                                <div>Exposure: <span className="text-orange-300 font-bold">14 Days</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model predicts severe ecosystem collapse in the reef zones. Immediate suspension of commercial fishing in the highlighted quadrant is mandatory.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EROSION (EMERALD) */}
              {climateMode === 'erosion' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-emerald-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Wind size={20}/> Coastal Erosion</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Mapping surface current velocities and extreme wind stress to predict long-term coastal erosion hotspots along the Eastern Ghats.</p>
                  
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-2">Infrastructure Risk</span>
                    <span className="text-[13px] text-emerald-200/80 leading-relaxed block font-light">High velocity boundary currents striking the coastline accelerate land loss, threatening ports and coastal highways.</span>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-emerald-500/10 mb-4 relative overflow-hidden shadow-lg">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Coastal Current Velocity</div>
                    <div className="text-4xl font-mono text-emerald-300">2.8 <span className="text-lg text-emerald-300/50">m/s</span></div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH VELOCITY SHEAR ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-emerald-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
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
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>Stress: <span className="text-emerald-300 font-bold">0.84 μ</span></div>
                                <div>Land Loss: <span className="text-emerald-300 font-bold">1.2 m/yr</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model detects abnormal seabed shear stress driven by extreme coastal currents. Maritime infrastructure projects should halt.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}

          {/* NAVY (TEAL) */}
          {activeTab === 'navy' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-teal-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Radar size={20}/> Naval Acoustic Ops</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Tactical subsurface mapping of Acoustic Stealth Zones. By analyzing the AI's 15-layer prediction, the system locates the Sonic Layer Depth (SLD) to optimize submarine evasion.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="bg-teal-500/5 border border-teal-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-teal-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-teal-200/80 leading-relaxed block font-light">Direct fleet operations to navigate below the Optimum Evasion Depth. Cyan anomalies on the globe represent the steepest thermocline gradient where sonar pings bounce off.</span>
              </div>
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-teal-500/10 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Sonic Layer Depth (SLD)</div>
                <div className="text-4xl font-mono text-teal-300">{liveData.depth.toFixed(1)} <span className="text-lg text-teal-300/50">m</span></div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-teal-400 rounded-sm shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">MAXIMUM NEGATIVE SOUND GRADIENT</span>
              </div>

              <div className="relative bg-white/5 border border-teal-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
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
                            <div>Max Range: <span className="text-teal-300 font-bold">4.2 NM</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model confirms optimal acoustic shielding at current depth. Active enemy sonar will refract sharply upwards.</p>
                    </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* FISHERIES (EMERALD) */}
          {activeTab === 'fishery' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-emerald-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Fish size={20}/> Fisheries & Upwelling</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Precision mapping of nutrient-rich upwelling zones. The AI combines surface currents and deep-ocean temperatures to pinpoint dense feeding grounds for commercial fleets.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-2">Fleet Deployment</span>
                <span className="text-[13px] text-emerald-200/80 leading-relaxed block font-light">Dispatch commercial fishing vessels to the glowing green regions on the globe. These represent active cold-water upwellings where massive fish populations are feeding.</span>
              </div>
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-emerald-500/10 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Upwelling Vertical Velocity</div>
                <div className="text-4xl font-mono text-emerald-300">1.84 <span className="text-lg text-emerald-300/50">m/d</span></div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">OPTIMAL CATCH ZONE (SST ANOMALY)</span>
              </div>

              <div className="relative bg-white/5 border border-emerald-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
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
                            <div>Nutrients: <span className="text-emerald-300 font-bold">12.4 mg/L</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model detects massive nutrient upwelling driven by cyclonic eddies. Commercial fleets authorized to deploy.</p>
                    </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* CABLE (INDIGO) */}
          {activeTab === 'cable' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-indigo-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Anchor size={20}/> Subsea Cable Routing</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Analyzing benthic boundary layers and seafloor thermodynamics to optimize the routing of highly sensitive international submarine communication cables.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest block mb-2">Engineering Directive</span>
                <span className="text-[13px] text-indigo-200/80 leading-relaxed block font-light">Route new cables through deep-sea plains with stable profiles. Avoid regions with steep thermal gradients indicating active hydrothermal vents.</span>
              </div>
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-indigo-500/10 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Benthic Temperature</div>
                <div className="text-4xl font-mono text-indigo-300">4.2 <span className="text-lg text-indigo-300/50">°C</span></div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-indigo-400 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">BENTHIC THERMAL GRADIENT</span>
              </div>

              <div className="relative bg-white/5 border border-indigo-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-indigo-500/10 text-indigo-400 opacity-80">
                            <AlertTriangle className="w-4 h-4" />
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
                            <div>Stress: <span className="text-indigo-300 font-bold">Low</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The v5 PINN model validates safe routing for benthic cables. Deep-ocean thermal ranges are stable, minimizing structural degradation.</p>
                    </div>
                </div>
              </div>
              </div>
            </div>
          )}
          
          {/* ENSO TAB REMAINS THE SAME UNTIL WE REDESIGN IT */}
          {activeTab === 'enso' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-rose-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><ThermometerSun size={20}/> Global Teleconnections</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">The Indian Ocean Dipole (IOD) profoundly impacts global weather patterns, correlating closely with ENSO events. A positive IOD phases pushes warm water to the western basin, bringing catastrophic rains to East Africa.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-rose-500/10 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Dipole Mode Index (DMI)</div>
                <div className="text-4xl font-mono text-rose-300">+0.84 <span className="text-lg text-rose-300/50">°C</span></div>
              </div>
              </div>
            </div>
          )}
"""

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(prefix + new_center + suffix)
print("Applied golden template to all panels")
