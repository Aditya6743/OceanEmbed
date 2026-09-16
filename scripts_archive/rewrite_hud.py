import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

old_hud = re.search(r'\{/\* Dynamic Context Report \*/\}.*?</Html>', code, re.DOTALL).group(0)

new_hud = """{/* Dynamic Context Report */}
              <div className="bg-cyan-950/50 p-2 rounded border border-cyan-500/20">
                {viewMode === 'climate' && climateSubMode === 'cyclone' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">TCHP DENSITY</span>
                        <span className="text-sm font-mono text-white">{(60 + activePin.val * 80).toFixed(1)} <span className="text-xs text-slate-400">kJ/cm²</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-amber-400' : 'text-cyan-400')}`}>
                            {activePin.val > 0.7 ? 'SEVERE CYCLONE RISK' : (activePin.val > 0.4 ? 'MODERATE FORMATION' : 'NOMINAL BASELINE')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'flood' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SSH ANOMALY</span>
                        <span className="text-sm font-mono text-white">{(activePin.val * 1.5 - 0.2).toFixed(2)} <span className="text-xs text-slate-400">m</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.8 ? 'text-white drop-shadow-[0_0_5px_#fff]' : (activePin.val > 0.5 ? 'text-cyan-300' : 'text-blue-500')}`}>
                            {activePin.val > 0.8 ? 'CRITICAL SURGE' : (activePin.val > 0.5 ? 'ELEVATED SEA LEVEL' : 'STABLE BASELINE')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'heatwave' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SST DEVIATION</span>
                        <span className="text-sm font-mono text-white">+{(activePin.val * 5.5).toFixed(1)} <span className="text-xs text-slate-400">°C</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.6 ? 'text-yellow-400' : (activePin.val > 0.3 ? 'text-orange-500' : 'text-rose-700')}`}>
                            {activePin.val > 0.6 ? 'EXTREME HEATWAVE' : (activePin.val > 0.3 ? 'SEVERE THERMAL' : 'MILD ELEVATION')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'erosion' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">CURRENT VELOCITY</span>
                        <span className="text-sm font-mono text-white">{(0.5 + activePin.val * 3.5).toFixed(2)} <span className="text-xs text-slate-400">m/s</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.8 ? 'text-yellow-400' : (activePin.val > 0.4 ? 'text-emerald-400' : 'text-blue-500')}`}>
                            {activePin.val > 0.8 ? 'EXTREME SHEAR' : (activePin.val > 0.4 ? 'MODERATE FLOW' : 'NORMAL FLOW')}
                        </span>
                    </div>
                )}
                {viewMode !== 'climate' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SECTOR STATUS</span>
                        <span className="text-xs font-mono text-emerald-400">MONITORING ACTIVE</span>
                        <span className="text-[9px] text-slate-400 mt-1">Full regional telemetry engaged.</span>
                    </div>
                )}
              </div>
            </div>
          </Html>"""

code = code.replace(old_hud, new_hud)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated HUD layout to 3 stages strictly matching colors.")
