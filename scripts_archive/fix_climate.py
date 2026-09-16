import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Add state variable
state_str = "const [activeTab, setActiveTab] = useState<ViewMode>('climate');"
code = code.replace(
    state_str,
    state_str + "\n  const [climateMode, setClimateMode] = useState<'cyclone'|'flood'|'heatwave'|'erosion'>('cyclone');"
)

# 2. Add the sub-navigation buttons and logic to the Left Panel
old_climate_panel = """          {activeTab === 'climate' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-orange-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><AlertTriangle size={20}/> Cyclone Readiness</h2>
              <p className="text-slate-300/80 text-[13px] mb-3 leading-relaxed font-light">Continuous AI-driven monitoring of Tropical Cyclone Heat Potential (TCHP). The Deep Learning architecture reconstructs the 3D temperature volume to calculate the total latent heat energy stored above the 26°C isotherm (D26), providing early warning metrics for rapid cyclone intensification.</p>
              
              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-orange-200/80 leading-relaxed block font-light">Monitor the TCHP dial below. If the live AI indicates a value entering the Critical Danger Zone (>60 kJ/cm²), issue immediate evacuation warnings for adjacent coastal regions.</span>
              </div>
              
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-orange-500/10 mb-4 relative shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Tropical Cyclone Heat Potential</div>
                <div className="text-4xl font-mono text-orange-300">{liveData.tchp.toFixed(1)} <span className="text-lg text-orange-300/50">kJ/cm²</span></div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-orange-400 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH CYCLOGENESIS RISK ZONE</span>
              </div>

<div className="relative bg-white/5 border border-orange-500/10 rounded-xl p-5 mt-4 overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-orange-500/20">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-orange-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-orange-500/10 text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity">
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
              </div>
            </div>
          )}"""

new_climate_panel = """          {activeTab === 'climate' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col h-full">
              <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2 shrink-0">
                 <button onClick={() => setClimateMode('cyclone')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'cyclone' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>CYCLONE</button>
                 <button onClick={() => setClimateMode('flood')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'flood' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>TSUNAMI / FLOOD</button>
                 <button onClick={() => setClimateMode('heatwave')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'heatwave' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>MARINE HEATWAVE</button>
                 <button onClick={() => setClimateMode('erosion')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'erosion' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>COASTAL EROSION</button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {climateMode === 'cyclone' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-orange-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><AlertTriangle size={20}/> Cyclone Readiness</h2>
                  <p className="text-slate-300/80 text-[13px] mb-3 leading-relaxed font-light">Continuous AI-driven monitoring of Tropical Cyclone Heat Potential (TCHP). The Deep Learning architecture reconstructs the 3D temperature volume to calculate the total latent heat energy stored above the 26°C isotherm (D26), providing early warning metrics for rapid cyclone intensification.</p>
                  
                  <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                    <span className="text-[13px] text-orange-200/80 leading-relaxed block font-light">Monitor the TCHP dial below. If the live AI indicates a value entering the Critical Danger Zone (>60 kJ/cm²), issue immediate evacuation warnings for adjacent coastal regions.</span>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-orange-500/10 mb-4 relative shadow-lg">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Tropical Cyclone Heat Potential</div>
                    <div className="text-4xl font-mono text-orange-300">{liveData.tchp.toFixed(1)} <span className="text-lg text-orange-300/50">kJ/cm²</span></div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-orange-400 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH CYCLOGENESIS RISK ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-orange-500/10 rounded-xl p-5 overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-orange-500/20">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-orange-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-orange-500/10 text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity">
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
                  </div>
                </div>
              )}
              
              {climateMode === 'flood' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-blue-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Target size={20}/> Tsunami & Coastal Flooding</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Monitoring Sea Surface Height (SSH) anomalies to detect massive water displacement events and project coastal inundation vectors.</p>
                  
                  <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest block mb-2">Tactical Action</span>
                    <span className="text-[13px] text-blue-200/80 leading-relaxed block font-light">Observe the SSH map for extreme positive anomalies (+1.0m or higher). These indicate severe flooding risks for low-lying regions.</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">CRITICAL INUNDATION ZONE</span>
                  </div>
                </div>
              )}
              
              {climateMode === 'heatwave' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-red-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><ThermometerSun size={20}/> Marine Heatwaves</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Tracking extreme spikes in Sea Surface Temperature (SST) that disrupt local ecosystems, bleach coral reefs, and destabilize the fishing economy.</p>
                  
                  <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest block mb-2">Coral Bleaching Alert</span>
                    <span className="text-[13px] text-red-200/80 leading-relaxed block font-light">SST values exceeding 32°C for sustained periods trigger automated bleaching alerts for the Lakshadweep and Andaman reef systems.</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-red-400 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">SEVERE HEAT STRESS ZONE</span>
                  </div>
                </div>
              )}
              
              {climateMode === 'erosion' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-emerald-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Wind size={20}/> Coastal Erosion</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Mapping surface current velocities and extreme wind stress to predict long-term coastal erosion hotspots along the Eastern Ghats.</p>
                  
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-2">Infrastructure Risk</span>
                    <span className="text-[13px] text-emerald-200/80 leading-relaxed block font-light">High velocity boundary currents striking the coastline accelerate land loss, threatening ports and coastal highways.</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH VELOCITY SHEAR ZONE</span>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}"""

code = code.replace(old_climate_panel, new_climate_panel)

# 3. Add `climateSubMode={climateMode}` to the MosdacGlobe render
code = code.replace(
    "<MosdacGlobe viewMode={activeTab as any} isRotationLocked={isRotationLocked} />",
    "<MosdacGlobe viewMode={activeTab as any} climateSubMode={climateMode as any} isRotationLocked={isRotationLocked} />"
)

# 4. We also need to fix the ML Telemetry labels that were lost.
code = code.replace(
    "activeTab === 'climate' ? '0 kJ/cm²' :",
    """(activeTab === 'climate' && climateMode === 'cyclone') ? '0 kJ/cm²' :
                  (activeTab === 'climate' && climateMode === 'flood') ? '-0.5 m' :
                  (activeTab === 'climate' && climateMode === 'heatwave') ? '25 °C' :
                  (activeTab === 'climate' && climateMode === 'erosion') ? '0 m/s' :"""
)
code = code.replace(
    "activeTab === 'climate' ? '>150 kJ/cm²' :",
    """(activeTab === 'climate' && climateMode === 'cyclone') ? '>150 kJ/cm²' :
                  (activeTab === 'climate' && climateMode === 'flood') ? '+1.0 m' :
                  (activeTab === 'climate' && climateMode === 'heatwave') ? '>35 °C' :
                  (activeTab === 'climate' && climateMode === 'erosion') ? '>2.0 m/s' :"""
)
code = code.replace(
    "activeTab === 'climate' ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :",
    """(activeTab === 'climate' && climateMode === 'cyclone') ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :
                  (activeTab === 'climate' && climateMode === 'flood') ? 'linear-gradient(to right, #000000, #1c2738, #3b5c73, #729eb3, #ffffff)' :
                  (activeTab === 'climate' && climateMode === 'heatwave') ? 'linear-gradient(to right, #000000, #b30000, #ff3300, #ffcc00, #ffffff)' :
                  (activeTab === 'climate' && climateMode === 'erosion') ? 'linear-gradient(to right, #000000, #004d00, #008055, #33cc99, #ffffff)' :"""
)
code = code.replace(
    "activeTab === 'enso' ? 'IOD Anomaly Scale' : 'Data Scale'}",
    """activeTab === 'enso' ? 'IOD Anomaly Scale' : 
                   (activeTab === 'climate' && climateMode === 'cyclone') ? 'TCHP (Energy) Scale' :
                   (activeTab === 'climate' && climateMode === 'flood') ? 'SSH (Anomaly) Scale' :
                   (activeTab === 'climate' && climateMode === 'heatwave') ? 'Temperature Scale' :
                   (activeTab === 'climate' && climateMode === 'erosion') ? 'Current Velocity Scale' : 'Data Scale'}"""
)


with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
