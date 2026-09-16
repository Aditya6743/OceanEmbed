import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Inject the state and timeout logic
anchor_offset = """    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);"""

new_state = """    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);

  const [appliedDateOffset, setAppliedDateOffset] = useState(dateOffset);
  const [isUpdatingPattern, setIsUpdatingPattern] = useState(false);

  useEffect(() => {
    if (dateOffset !== appliedDateOffset) {
      setIsUpdatingPattern(true);
      const timer = setTimeout(() => {
        setAppliedDateOffset(dateOffset);
        setIsUpdatingPattern(false);
      }, 1200); // 1.2s realistic loading delay
      return () => clearTimeout(timer);
    }
  }, [dateOffset]);"""
code = code.replace(anchor_offset, new_state)

# 2. Update the Shader/HUD sync effect to depend on appliedDateOffset
old_sync = """  // LIVE SYNCHRONIZATION: When the date changes, instantly mutate the shaders and refresh the active coordinate HUD!
  useEffect(() => {
    // 1. Force WebGL shader re-render with new time offset
    if (tchpShaderRef.current) tchpShaderRef.current.uniforms.time.value = dateOffset;
    if (floodShaderRef.current) floodShaderRef.current.uniforms.time.value = dateOffset;
    if (heatwaveShaderRef.current) heatwaveShaderRef.current.uniforms.time.value = dateOffset;
    if (erosionShaderRef.current) erosionShaderRef.current.uniforms.time.value = dateOffset;
    if (fisheryShaderRef.current) fisheryShaderRef.current.uniforms.time.value = dateOffset;
    if (navyShaderRef.current) navyShaderRef.current.uniforms.time.value = dateOffset;
    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = dateOffset;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = dateOffset;
    
    // 2. Refresh the HUD data if a coordinate is actively selected
    if (activePin) {
       // Only run the fetch, preserve the visual pin position
       setActivePin(prev => prev ? { ...prev, isLoading: true } : null);
       fetchOceanPrediction(activePin.lat, activePin.lon, selectedDate || '2026-06-01').then(res => {
          setActivePin(prev => {
              if (prev && prev.lat === activePin.lat && prev.lon === activePin.lon) {
                  return { ...prev, isLoading: false, realData: res };
              }
              return prev;
          });
       }).catch(err => {
          console.error(err);
          setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
       });
    }
  }, [selectedDate, dateOffset]);"""

new_sync = """  // LIVE SYNCHRONIZATION: Triggered ONLY after the 'UPDATING...' delay finishes!
  useEffect(() => {
    // 1. Force WebGL shader re-render with the applied time offset
    if (tchpShaderRef.current) tchpShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (floodShaderRef.current) floodShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (heatwaveShaderRef.current) heatwaveShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (erosionShaderRef.current) erosionShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (fisheryShaderRef.current) fisheryShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (navyShaderRef.current) navyShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = appliedDateOffset;
    
    // 2. Refresh the HUD data if a coordinate is actively selected
    if (activePin && appliedDateOffset > 0) { // ensure we don't refetch endlessly on mount
       setActivePin(prev => prev ? { ...prev, isLoading: true } : null);
       fetchOceanPrediction(activePin.lat, activePin.lon, selectedDate || '2026-06-01').then(res => {
          setActivePin(prev => {
              if (prev && prev.lat === activePin.lat && prev.lon === activePin.lon) {
                  return { ...prev, isLoading: false, realData: res };
              }
              return prev;
          });
       }).catch(err => {
          console.error(err);
          setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
       });
    }
  }, [appliedDateOffset]); // Only run when the applied offset finalizes!"""

code = code.replace(old_sync, new_sync)

# 3. Modify elapsedTime to use appliedDateOffset
code = code.replace("let elapsedTime = dateOffset;", "let elapsedTime = appliedDateOffset;")

# 4. Inject the "UPDATING..." HTML overlay in the scene
html_overlay = """
      {/* GLOBAL UPDATING OVERLAY */}
      {isUpdatingPattern && (
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
          <div className="flex flex-col items-center justify-center p-6 bg-black/80 border border-cyan-500/50 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-in fade-in zoom-in duration-200">
             <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
             <div className="text-cyan-400 font-black tracking-[0.2em] text-sm animate-pulse">GENERATING PREDICTION</div>
             <div className="text-cyan-200/50 font-mono text-[9px] mt-2 uppercase">Rendering Physics Topology for {selectedDate}</div>
          </div>
        </Html>
      )}
      
      {showGlobeArgo && argoFloats.map((float) => ("""

code = code.replace("{showGlobeArgo && argoFloats.map((float) => (", html_overlay)


# 5. Fix the dateOffset references inside the HUD multipliers to use appliedDateOffset!
code = code.replace("dateOffset % ", "appliedDateOffset % ")

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Injected Updating state overlay and asynchronous shader mutation.")
