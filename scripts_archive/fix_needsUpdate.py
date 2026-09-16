import re
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = """  useEffect(() => {
    if (tchpShaderRef.current && tchpMap) tchpShaderRef.current.uniforms.tchpMap.value = tchpMap;
    if (fisheryShaderRef.current && fisheryMap) fisheryShaderRef.current.uniforms.fisheryMap.value = fisheryMap;
    if (navyShaderRef.current && navyMap) navyShaderRef.current.uniforms.navyMap.value = navyMap;
    if (cableShaderRef.current && benthicMap) cableShaderRef.current.uniforms.benthicMap.value = benthicMap;
    if (ensoShaderRef.current && iodMap) ensoShaderRef.current.uniforms.iodMap.value = iodMap;
    if (floodShaderRef.current && sshMap) floodShaderRef.current.uniforms.sshMap.value = sshMap;
    if (heatwaveShaderRef.current && sstMap) heatwaveShaderRef.current.uniforms.sstMap.value = sstMap;
    if (erosionShaderRef.current && currentsMap) erosionShaderRef.current.uniforms.currentsMap.value = currentsMap;
  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap, viewMode, climateSubMode]);"""

replacement = """  useEffect(() => {
    if (tchpShaderRef.current && tchpMap) { tchpShaderRef.current.uniforms.tchpMap.value = tchpMap; tchpShaderRef.current.needsUpdate = true; }
    if (fisheryShaderRef.current && fisheryMap) { fisheryShaderRef.current.uniforms.fisheryMap.value = fisheryMap; fisheryShaderRef.current.needsUpdate = true; }
    if (navyShaderRef.current && navyMap) { navyShaderRef.current.uniforms.navyMap.value = navyMap; navyShaderRef.current.needsUpdate = true; }
    if (cableShaderRef.current && benthicMap) { cableShaderRef.current.uniforms.benthicMap.value = benthicMap; cableShaderRef.current.needsUpdate = true; }
    if (ensoShaderRef.current && iodMap) { ensoShaderRef.current.uniforms.iodMap.value = iodMap; ensoShaderRef.current.needsUpdate = true; }
    if (floodShaderRef.current && sshMap) { floodShaderRef.current.uniforms.sshMap.value = sshMap; floodShaderRef.current.needsUpdate = true; }
    if (heatwaveShaderRef.current && sstMap) { heatwaveShaderRef.current.uniforms.sstMap.value = sstMap; heatwaveShaderRef.current.needsUpdate = true; }
    if (erosionShaderRef.current && currentsMap) { erosionShaderRef.current.uniforms.currentsMap.value = currentsMap; erosionShaderRef.current.needsUpdate = true; }
  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap, viewMode, climateSubMode]);"""

code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
