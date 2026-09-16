import re
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Let's add a useEffect to forcefully update all shader uniforms whenever textures load!
force_update_code = """  // Force WebGL uniform updates when textures finish loading
  useEffect(() => {
    if (tchpShaderRef.current && tchpMap) tchpShaderRef.current.uniforms.tchpMap.value = tchpMap;
    if (fisheryShaderRef.current && fisheryMap) fisheryShaderRef.current.uniforms.fisheryMap.value = fisheryMap;
    if (navyShaderRef.current && navyMap) navyShaderRef.current.uniforms.navyMap.value = navyMap;
    if (cableShaderRef.current && benthicMap) cableShaderRef.current.uniforms.benthicMap.value = benthicMap;
    if (ensoShaderRef.current && iodMap) ensoShaderRef.current.uniforms.iodMap.value = iodMap;
    if (floodShaderRef.current && sshMap) floodShaderRef.current.uniforms.sshMap.value = sshMap;
    if (heatwaveShaderRef.current && sstMap) heatwaveShaderRef.current.uniforms.sstMap.value = sstMap;
    if (erosionShaderRef.current && currentsMap) erosionShaderRef.current.uniforms.currentsMap.value = currentsMap;
  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap]);

  useFrame((state) => {"""

code = code.replace("  useFrame((state) => {", force_update_code)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
