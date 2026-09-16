import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Update handleGlobeClick to select the correct texture
old_tex = "let val = getPixelIntensity(tchpMap, u, v);"
new_tex = """let activeTex = tchpMap;
    if (viewMode === 'fishery') activeTex = fisheryMap;
    else if (viewMode === 'navy') activeTex = navyMap;
    else if (viewMode === 'cable') activeTex = benthicMap;
    else if (viewMode === 'enso') activeTex = iodMap;
    
    let val = getPixelIntensity(activeTex, u, v);"""
code = code.replace(old_tex, new_tex)


# 2. Add HUD sections for the other modes
old_hud_bottom = """                {viewMode !== 'climate' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SECTOR STATUS</span>
                        <span className="text-xs font-mono text-emerald-400">MONITORING ACTIVE</span>
                        <span className="text-[9px] text-slate-400 mt-1">Full regional telemetry engaged.</span>
                    </div>
                )}
              </div>
            </div>
          </Html>"""

new_hud_bottom = """                {viewMode === 'fishery' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">CHLOROPHYLL / UPWELLING</span>
                        <span className="text-sm font-mono text-white">{(activePin.val * 4.5).toFixed(2)} <span className="text-xs text-slate-400">mg/m³</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-yellow-400' : (activePin.val > 0.4 ? 'text-emerald-400' : 'text-cyan-400')}`}>
                            {activePin.val > 0.7 ? 'HIGH YIELD ZONE' : (activePin.val > 0.4 ? 'MODERATE BIOMASS' : 'LOW ACTIVITY')}
                        </span>
                    </div>
                )}
                {viewMode === 'navy' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SONAR ATTENUATION</span>
                        <span className="text-sm font-mono text-white">{(activePin.val * -12.0).toFixed(1)} <span className="text-xs text-slate-400">dB/km</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-purple-400' : 'text-blue-400')}`}>
                            {activePin.val > 0.7 ? 'SEVERE DEGRADATION' : (activePin.val > 0.4 ? 'MODERATE SCATTER' : 'CLEAR ACOUSTICS')}
                        </span>
                    </div>
                )}
                {viewMode === 'cable' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">BENTHIC STRESS</span>
                        <span className="text-sm font-mono text-white">{(activePin.val * 85.0).toFixed(1)} <span className="text-xs text-slate-400">kPa</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-orange-400' : 'text-emerald-400')}`}>
                            {activePin.val > 0.7 ? 'CRITICAL TENSION' : (activePin.val > 0.4 ? 'ELEVATED FRICTION' : 'STABLE SEABED')}
                        </span>
                    </div>
                )}
                {viewMode === 'enso' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">IOD / ENSO INDEX</span>
                        <span className="text-sm font-mono text-white">{(activePin.val * 4.0 - 2.0).toFixed(2)} <span className="text-xs text-slate-400">σ</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.6 ? 'text-rose-500' : (activePin.val < 0.4 ? 'text-blue-400' : 'text-slate-300')}`}>
                            {activePin.val > 0.6 ? 'POSITIVE PHASE (WARM)' : (activePin.val < 0.4 ? 'NEGATIVE PHASE (COOL)' : 'NEUTRAL PHASE')}
                        </span>
                    </div>
                )}
                {viewMode === 'iot' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">TELEMETRY</span>
                        <span className="text-xs font-mono text-emerald-400">NO LOCAL BUOY</span>
                        <span className="text-[9px] text-slate-400 mt-1">Select an active IoT marker.</span>
                    </div>
                )}
              </div>
            </div>
          </Html>"""

code = code.replace(old_hud_bottom, new_hud_bottom)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated other navbar sections to show data.")
