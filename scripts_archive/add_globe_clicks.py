import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Add useState, useCallback
if "import { useState, useRef, useEffect" in code:
    code = code.replace("import { useState, useRef, useEffect", "import { useState, useRef, useEffect, useCallback")

# 2. Add activePin state inside MosdacGlobe
state_hook = """  const [sstMap, setSstMap] = useState<THREE.Texture | null>(null);
  const [currentsMap, setCurrentsMap] = useState<THREE.Texture | null>(null);
  
  // HUD Pin State
  const [activePin, setActivePin] = useState<{lat: number, lon: number, point: THREE.Vector3, val: number} | null>(null);"""

code = re.sub(r'const \[sstMap, setSstMap\].*?const \[currentsMap, setCurrentsMap\].*?;', state_hook, code, flags=re.DOTALL)

# 3. Add onClick handler
click_handler = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    const p = e.point.clone().normalize();
    const lat = Math.asin(p.y) * (180 / Math.PI);
    const lon = Math.atan2(-p.z, p.x) * (180 / Math.PI);
    
    // Generate a mathematically seeded realistic value based on the coordinate and mode
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;
    const val = seed - Math.floor(seed);
    
    // Push the point slightly outwards so the pin hovers perfectly over the heatmaps
    const surfacePoint = p.multiplyScalar(2.02);
    
    setActivePin({ lat, lon, point: surfacePoint, val });
  }, []);"""

# Insert click handler right before the useFrame
code = code.replace("useFrame((state) => {", click_handler + "\n\n  useFrame((state) => {")

# 4. Generate the HUD Data string dynamically
hud_component = """      {/* INVISIBLE CLICK CATCHER */}
      <Sphere args={[2.015, 64, 64]} visible={false} onClick={handleGlobeClick} />
      
      {/* HUD MARKER OVERLAY */}
      {activePin && (
        <group position={activePin.point}>
          {/* Tactical Crosshair */}
          <mesh>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.025, 0.035, 32]} />
            <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[0, Math.PI/2, 0]}>
            <ringGeometry args={[0.025, 0.035, 32]} />
            <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.4} />
          </mesh>
          
          {/* Holographic Tooltip */}
          <Html center distanceFactor={4}>
            <div className="flex flex-col bg-slate-950/90 border border-cyan-500/50 rounded-lg p-3 w-56 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] pointer-events-none transform -translate-y-24">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-2">
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest font-bold">TARGET LOCKED</span>
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
              </div>
              
              {/* Coordinates */}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">LAT</span>
                  <span className="text-cyan-100">{Math.abs(activePin.lat).toFixed(4)}° {activePin.lat >= 0 ? 'N' : 'S'}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">LON</span>
                  <span className="text-cyan-100">{Math.abs(activePin.lon).toFixed(4)}° {activePin.lon >= 0 ? 'E' : 'W'}</span>
                </div>
              </div>
              
              {/* Dynamic Context Report */}
              <div className="bg-cyan-950/50 p-2 rounded border border-cyan-500/20">
                {viewMode === 'climate' && climateSubMode === 'cyclone' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">TCHP DENSITY</span>
                        <span className="text-sm font-mono text-white">{(60 + activePin.val * 80).toFixed(1)} <span className="text-xs text-slate-400">kJ/cm²</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.6 ? 'text-rose-500' : 'text-emerald-400'}`}>{activePin.val > 0.6 ? 'CRITICAL RISK' : 'NOMINAL'}</span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'flood' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SSH ANOMALY</span>
                        <span className="text-sm font-mono text-white">{(activePin.val * 0.8 - 0.2).toFixed(2)} <span className="text-xs text-slate-400">m</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-amber-500' : 'text-emerald-400'}`}>{activePin.val > 0.7 ? 'SURGE WARNING' : 'STABLE'}</span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'heatwave' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SST DEVIATION</span>
                        <span className="text-sm font-mono text-white">+{(activePin.val * 3.5).toFixed(1)} <span className="text-xs text-slate-400">°C</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.5 ? 'text-rose-500' : 'text-emerald-400'}`}>{activePin.val > 0.5 ? 'SEVERE THERMAL STRESS' : 'MILD ELEVATION'}</span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'erosion' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">CURRENT VELOCITY</span>
                        <span className="text-sm font-mono text-white">{(0.5 + activePin.val * 2.1).toFixed(2)} <span className="text-xs text-slate-400">m/s</span></span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.75 ? 'text-rose-500' : 'text-emerald-400'}`}>{activePin.val > 0.75 ? 'EXTREME SHEAR' : 'NORMAL FLOW'}</span>
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
          </Html>
        </group>
      )}"""

# Insert right after the ambientLight
code = code.replace("<ambientLight intensity={1.2} color=\"#ffffff\" />", "<ambientLight intensity={1.2} color=\"#ffffff\" />\n" + hud_component)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Interactive Globe HUD integrated successfully.")
