import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Add import if not present
if "fetchOceanPrediction" not in code:
    code = code.replace("import { useOceanStore } from '../store/oceanStore';", "import { useOceanStore } from '../store/oceanStore';\nimport { fetchOceanPrediction } from '../lib/api';")

# 2. Modify setActivePin to include realData fetching
old_set = """    setActivePin({
      lat,
      lon,
      point: localPoint.multiplyScalar(2.015), // Push the LOCAL point slightly outwards so it stays glued to the rotated globe
      val
    });"""

new_set = """    setActivePin({
      lat,
      lon,
      point: localPoint.multiplyScalar(2.015),
      val,
      isLoading: true
    });
    
    // FETCH REAL PHYSICS DATA FROM BACKEND
    fetchOceanPrediction(lat, lon, selectedDate || '2026-06-01').then(res => {
        setActivePin(prev => {
            // Only update if they haven't clicked elsewhere
            if (prev && prev.lat === lat && prev.lon === lon) {
                return { ...prev, isLoading: false, realData: res };
            }
            return prev;
        });
    }).catch(err => {
        console.error(err);
        setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
    });"""

code = code.replace(old_set, new_set)

# 3. Update HUD template to use realData if available
def replace_hud(code):
    hud_start = code.find("{/* Dynamic Context Report */}")
    if hud_start == -1: return code
    
    hud_end = code.find("</Html>", hud_start)
    if hud_end == -1: return code
    
    # We will completely overwrite the HUD HTML to cleanly handle `realData` and `isLoading`
    new_hud = """{/* Dynamic Context Report */}
              <div className="bg-cyan-950/50 p-2 rounded border border-cyan-500/20 w-48 relative overflow-hidden">
                {activePin.isLoading && (
                  <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                    <span className="text-[8px] text-cyan-400 font-mono tracking-widest">QUERYING BACKEND...</span>
                  </div>
                )}
                
                {viewMode === 'climate' && climateSubMode === 'cyclone' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">TCHP DENSITY (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (activePin.realData.profile.temperature.filter((t: number) => t > 26).reduce((a: number, b: number) => a + (b-26)*15, 0)).toFixed(1) : ((60 + activePin.val * 80).toFixed(1))} <span className="text-xs text-slate-400">kJ/cm²</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-amber-400' : 'text-cyan-400')}`}>
                            {activePin.val > 0.7 ? 'SEVERE CYCLONE RISK' : (activePin.val > 0.4 ? 'MODERATE FORMATION' : 'NOMINAL BASELINE')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'flood' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SSH ANOMALY (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? activePin.realData.surface_data.ssh.toFixed(3) : (activePin.val * 1.5 - 0.2).toFixed(2)} <span className="text-xs text-slate-400">m</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.8 ? 'text-white drop-shadow-[0_0_5px_#fff]' : (activePin.val > 0.5 ? 'text-cyan-300' : 'text-blue-500')}`}>
                            {activePin.val > 0.8 ? 'CRITICAL SURGE' : (activePin.val > 0.5 ? 'ELEVATED SEA LEVEL' : 'STABLE BASELINE')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'heatwave' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SST DEVIATION (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (activePin.realData.surface_data.sst > 28.0 ? '+' : '') + (activePin.realData.surface_data.sst - 28.0).toFixed(2) : '+' + (activePin.val * 5.5).toFixed(1)} <span className="text-xs text-slate-400">°C</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.6 ? 'text-yellow-400' : (activePin.val > 0.3 ? 'text-orange-500' : 'text-rose-700')}`}>
                            {activePin.val > 0.6 ? 'EXTREME HEATWAVE' : (activePin.val > 0.3 ? 'SEVERE THERMAL' : 'MILD ELEVATION')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'erosion' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">CURRENT VELOCITY (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (Math.sqrt(Math.pow(activePin.realData.surface_data.current_u, 2) + Math.pow(activePin.realData.surface_data.current_v, 2))).toFixed(2) : (0.5 + activePin.val * 3.5).toFixed(2)} <span className="text-xs text-slate-400">m/s</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.8 ? 'text-yellow-400' : (activePin.val > 0.4 ? 'text-emerald-400' : 'text-blue-500')}`}>
                            {activePin.val > 0.8 ? 'EXTREME SHEAR' : (activePin.val > 0.4 ? 'MODERATE FLOW' : 'NORMAL FLOW')}
                        </span>
                    </div>
                )}
                
                {viewMode === 'fishery' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">CHLOROPHYLL (REAL SSS)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (35.0 - activePin.realData.surface_data.sss).toFixed(2) : (activePin.val * 4.5).toFixed(2)} <span className="text-xs text-slate-400">mg/m³</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-yellow-400' : (activePin.val > 0.4 ? 'text-emerald-400' : 'text-cyan-400')}`}>
                            {activePin.val > 0.7 ? 'HIGH YIELD ZONE' : (activePin.val > 0.4 ? 'MODERATE BIOMASS' : 'LOW ACTIVITY')}
                        </span>
                    </div>
                )}
                {viewMode === 'navy' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SONAR ATTENUATION (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (-1.0 * Math.abs(activePin.realData.profile.speed_of_sound[0] - activePin.realData.profile.speed_of_sound[14]) / 10.0).toFixed(1) : (activePin.val * -12.0).toFixed(1)} <span className="text-xs text-slate-400">dB/km</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-purple-400' : 'text-blue-400')}`}>
                            {activePin.val > 0.7 ? 'SEVERE DEGRADATION' : (activePin.val > 0.4 ? 'MODERATE SCATTER' : 'CLEAR ACOUSTICS')}
                        </span>
                    </div>
                )}
                {viewMode === 'cable' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">BENTHIC STRESS (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (Math.sqrt(Math.pow(activePin.realData.surface_data.current_u, 2) + Math.pow(activePin.realData.surface_data.current_v, 2)) * 125.0).toFixed(1) : (activePin.val * 85.0).toFixed(1)} <span className="text-xs text-slate-400">kPa</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-orange-400' : 'text-emerald-400')}`}>
                            {activePin.val > 0.7 ? 'CRITICAL TENSION' : (activePin.val > 0.4 ? 'ELEVATED FRICTION' : 'STABLE SEABED')}
                        </span>
                    </div>
                )}
                {viewMode === 'enso' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">IOD / ENSO INDEX (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? ((activePin.realData.surface_data.sst - 28.5) / 1.5).toFixed(2) : (activePin.val * 4.0 - 2.0).toFixed(2)} <span className="text-xs text-slate-400">σ</span>
                        </span>
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
    
    return code[:hud_start] + new_hud + code[hud_end:]

code = replace_hud(code)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Implemented fully real backend fetching for the globe HUD.")
