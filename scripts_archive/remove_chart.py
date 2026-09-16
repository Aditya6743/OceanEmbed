import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Remove the import
code = code.replace('import TemperatureChart from "./TemperatureChart";\n', '')

# Remove the chart block
chart_block = """
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

if chart_block in code:
    code = code.replace(chart_block, "")
else:
    print("Warning: Exact chart block not found, trying regex...")
    code = re.sub(r'\{\/\* 3D DEPTH PROFILER CHART \(V5 PINN\) \*\/\}.*?\}\)', '', code, flags=re.DOTALL)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Removed the Depth Profiler Chart from MosdacGlobe.tsx")
