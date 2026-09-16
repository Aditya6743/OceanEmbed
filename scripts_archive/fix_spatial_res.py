with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target1 = """              <div className="bg-black/40 border border-slate-800/50 rounded p-2">
                <div className="text-[10px] text-slate-500 uppercase">Spatial Res</div>
                <div className="text-sm text-slate-300 font-mono">1/12° Grid</div>
              </div>"""

replacement1 = """              <div className="bg-black/40 border border-slate-800/50 rounded p-2">
                <div className="text-[10px] text-slate-500 uppercase">Spatial Res</div>
                <div className="text-sm text-slate-300 font-mono">0.25° Grid</div>
              </div>"""
code = code.replace(target1, replacement1)

target2 = """            <div className="mt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Data Scale</span>"""

replacement2 = """            <div className="mt-4 bg-black/40 border border-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {activeTab === 'climate' && climateMode === 'cyclone' ? 'TCHP (Energy) Scale' :
                   activeTab === 'climate' && climateMode === 'flood' ? 'SSH (Anomaly) Scale' :
                   activeTab === 'climate' && climateMode === 'heatwave' ? 'Temperature Scale' :
                   activeTab === 'climate' && climateMode === 'erosion' ? 'Current Velocity Scale' :
                   activeTab === 'navy' ? 'Thermocline Gradient Scale' :
                   activeTab === 'fishery' ? 'Upwelling Potential Scale' :
                   activeTab === 'cable' ? 'Benthic Stress Scale' :
                   activeTab === 'enso' ? 'IOD Anomaly Scale' : 'Data Scale'}
                </span>
                <span className="text-[8px] text-sky-400/50 font-mono uppercase border border-sky-400/20 px-1.5 py-0.5 rounded">Live Map</span>
              </div>"""
code = code.replace(target2, replacement2)

# close the new p-3 div
target3 = """              <div className="flex justify-between mt-1 text-[9px] font-mono text-slate-500">
                <span>{
                  activeTab === 'climate' && climateMode === 'cyclone' ? '0 kJ/cm²' :
                  activeTab === 'climate' && climateMode === 'flood' ? '-0.5 m' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? '25 °C' :
                  activeTab === 'climate' && climateMode === 'erosion' ? '0 m/s' :
                  activeTab === 'navy' ? '0 °C/m' :
                  activeTab === 'fishery' ? 'Low' :
                  activeTab === 'cable' ? 'Safe' :
                  activeTab === 'enso' ? '-2' : '-2'
                }</span>
                <span>{
                  activeTab === 'climate' && climateMode === 'cyclone' ? '>150 kJ/cm²' :
                  activeTab === 'climate' && climateMode === 'flood' ? '+1.0 m' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? '>35 °C' :
                  activeTab === 'climate' && climateMode === 'erosion' ? '>2.0 m/s' :
                  activeTab === 'navy' ? '>5 °C/m' :
                  activeTab === 'fishery' ? 'High' :
                  activeTab === 'cable' ? 'Critical' :
                  activeTab === 'enso' ? '+2' : '+2'
                }</span>
              </div>
            </div>"""

replacement3 = """              <div className="flex justify-between mt-1 text-[9px] font-mono text-slate-500">
                <span>{
                  activeTab === 'climate' && climateMode === 'cyclone' ? '0 kJ/cm²' :
                  activeTab === 'climate' && climateMode === 'flood' ? '-0.5 m' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? '25 °C' :
                  activeTab === 'climate' && climateMode === 'erosion' ? '0 m/s' :
                  activeTab === 'navy' ? '0 °C/m' :
                  activeTab === 'fishery' ? 'Low' :
                  activeTab === 'cable' ? 'Safe' :
                  activeTab === 'enso' ? '-2' : '-2'
                }</span>
                <span>{
                  activeTab === 'climate' && climateMode === 'cyclone' ? '>150 kJ/cm²' :
                  activeTab === 'climate' && climateMode === 'flood' ? '+1.0 m' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? '>35 °C' :
                  activeTab === 'climate' && climateMode === 'erosion' ? '>2.0 m/s' :
                  activeTab === 'navy' ? '>5 °C/m' :
                  activeTab === 'fishery' ? 'High' :
                  activeTab === 'cable' ? 'Critical' :
                  activeTab === 'enso' ? '+2' : '+2'
                }</span>
              </div>
            </div>"""
# the replacement3 is same but wait, I just need to add the closing div for the bg-black/40 box...
# Wait, I just modified the opening `div` in `target2` to have `bg-black/40 p-3`. It's the same div! 
# So it closes correctly automatically!

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
