import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Import TemperatureChart
if "import TemperatureChart" not in code:
    code = code.replace("import { Canvas, useFrame } from '@react-three/fiber';", "import { Canvas, useFrame } from '@react-three/fiber';\nimport TemperatureChart from './TemperatureChart';")

# 2. Inject the chart at the bottom of the activePin HTML HUD
# Let's find the end of the conditional rendering blocks for the viewModes.
# The last one is cable.

anchor = """                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (Math.sqrt(Math.pow(activePin.realData.surface_data.current_u, 2) + Math.pow(activePin.realData.surface_data.current_v, 2)) * 125.0 * (1.0 + (appliedDateOffset % 0.6 - 0.3))).toFixed(1) : (activePin.val * 85.0).toFixed(1)} <span className="text-xs text-slate-400">kPa</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.8 ? 'text-rose-500' : (activePin.val > 0.5 ? 'text-amber-400' : 'text-emerald-400')}`}>
                            {activePin.val > 0.8 ? 'HIGH RISK OF SCOUR' : (activePin.val > 0.5 ? 'MODERATE EROSION' : 'STABLE SEABED')}
                        </span>
                    </div>
                )}"""

# We'll inject the chart right after the cable block ends, before the </div> that closes the bg-black/80 box.
chart_code = """
                {/* 3D DEPTH PROFILER CHART (V5 PINN) */}
                {activePin.realData?.profile && (
                    <div className="mt-3 pt-3 border-t border-cyan-500/20 w-[260px] h-[200px] pointer-events-auto">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] font-bold text-cyan-400 tracking-widest uppercase">Depth Profile (15 Layers)</span>
                            <span className="text-[7px] bg-cyan-950/50 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono">1000m MAX</span>
                        </div>
                        <div className="w-full h-full -ml-3">
                            <TemperatureChart profile={activePin.realData.profile} rmse={0.53} />
                        </div>
                    </div>
                )}"""

code = code.replace(anchor, anchor + "\n" + chart_code)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Injected 3D Depth Profiler Chart into the activePin HUD.")
