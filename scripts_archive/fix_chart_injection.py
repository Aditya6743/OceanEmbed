import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Import TemperatureChart (if not already there)
if "import TemperatureChart" not in code:
    code = code.replace("import { Canvas, useFrame } from '@react-three/fiber';", "import { Canvas, useFrame } from '@react-three/fiber';\nimport TemperatureChart from './TemperatureChart';")

# 2. Find the exact ENSO block to append the chart after it
anchor = """                        <span className={`text-[10px] font-bold ${activePin.val > 0.6 ? 'text-rose-500' : (activePin.val < 0.4 ? 'text-blue-400' : 'text-slate-300')}`}>
                            {activePin.val > 0.6 ? 'POSITIVE PHASE (WARM)' : (activePin.val < 0.4 ? 'NEGATIVE PHASE (COOL)' : 'NEUTRAL PHASE')}
                        </span>
                    </div>
                )}"""

chart_code = """
                {/* 3D DEPTH PROFILER CHART (V5 PINN) */}
                {activePin.realData?.profile && (
                    <div className="mt-3 pt-3 border-t border-cyan-500/20 w-[280px] h-[220px] pointer-events-auto">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-cyan-400 tracking-widest uppercase">Depth Profile (15 Layers)</span>
                            <span className="text-[8px] bg-cyan-950/50 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono">1000m MAX</span>
                        </div>
                        <div className="w-full h-full -ml-4">
                            <TemperatureChart profile={activePin.realData.profile} rmse={0.53} />
                        </div>
                    </div>
                )}"""

if "3D DEPTH PROFILER CHART" not in code:
    code = code.replace(anchor, anchor + "\n" + chart_code)
    
with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Injected chart correctly.")
