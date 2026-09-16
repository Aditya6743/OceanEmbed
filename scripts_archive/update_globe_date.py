import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Ensure selectedDate is extracted from the store
old_store = "const { viewMode, climateSubMode, showGlobeArgo, selectedArgoMarker, setSelectedArgoMarker, activeHighlight } = useOceanStore();"
new_store = "const { viewMode, climateSubMode, showGlobeArgo, selectedArgoMarker, setSelectedArgoMarker, activeHighlight, selectedDate } = useOceanStore();"
code = code.replace(old_store, new_store)

# 2. Create the dateOffset hash hook
old_hook = """  // Safe texture loading to prevent crashes if backend is restarting"""
new_hook = """  // Hash the selected date into a unique float to completely shift the fluid simulation patterns (Domain Warping)
  const dateOffset = useMemo(() => {
    if (!selectedDate) return 0;
    let hash = 0;
    for (let i = 0; i < selectedDate.length; i++) {
      hash = ((hash << 5) - hash) + selectedDate.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);

  // Safe texture loading to prevent crashes if backend is restarting"""
if "const dateOffset = useMemo" not in code:
    code = code.replace(old_hook, new_hook)

# 3. Apply the dateOffset to the shader uniforms
code = code.replace("time: { value: 0 }", "time: { value: dateOffset }")

# 4. Apply the dateOffset to the JS simplex noise engine so the math matches
old_elapsed = """    // We can pull the elapsed time directly from the active shader uniform!
    let elapsedTime = 0;
    if (climateSubMode === 'flood' && floodShaderRef.current) elapsedTime = floodShaderRef.current.uniforms.time.value;
    else if (climateSubMode === 'heatwave' && heatwaveShaderRef.current) elapsedTime = heatwaveShaderRef.current.uniforms.time.value;
    else if (climateSubMode === 'erosion' && erosionShaderRef.current) elapsedTime = erosionShaderRef.current.uniforms.time.value;"""

new_elapsed = """    // Use the exact date-based time offset that the shaders use to guarantee absolute sync
    let elapsedTime = dateOffset;"""

code = code.replace(old_elapsed, new_elapsed)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated globe shaders and math to respond to date changes.")
