import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Add the synchronization useEffect right after dateOffset declaration
anchor = """    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);"""

new_hook = """    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);

  // LIVE SYNCHRONIZATION: When the date changes, instantly mutate the shaders and refresh the active coordinate HUD!
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

code = code.replace(anchor, new_hook)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Implemented Live Synchronization for Date Changes.")
