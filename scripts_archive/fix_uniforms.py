import re
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = """  const sharedUniforms = useMemo(() => ({ 
    time: { value: 0 }, 
    earthMap: { value: specularMap },
    tchpMap: { value: tchpMap },
    fisheryMap: { value: fisheryMap },
    navyMap: { value: navyMap },
    benthicMap: { value: benthicMap },
    iodMap: { value: iodMap },
    sshMap: { value: sshMap },
    sstMap: { value: sstMap },
    currentsMap: { value: currentsMap }
  }), [specularMap, tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap]);"""

replacement = """  const sharedUniforms = useMemo(() => ({ 
    time: { value: 0 }, 
    earthMap: { value: specularMap },
    tchpMap: { value: tchpMap },
    fisheryMap: { value: fisheryMap },
    navyMap: { value: navyMap },
    benthicMap: { value: benthicMap },
    iodMap: { value: iodMap },
    sshMap: { value: sshMap },
    sstMap: { value: sstMap },
    currentsMap: { value: currentsMap }
  }), []);

  useEffect(() => {
    if (tchpShaderRef.current && tchpMap) tchpShaderRef.current.uniforms.tchpMap.value = tchpMap;
    if (fisheryShaderRef.current && fisheryMap) fisheryShaderRef.current.uniforms.fisheryMap.value = fisheryMap;
    if (navyShaderRef.current && navyMap) navyShaderRef.current.uniforms.navyMap.value = navyMap;
    if (cableShaderRef.current && benthicMap) cableShaderRef.current.uniforms.benthicMap.value = benthicMap;
    if (ensoShaderRef.current && iodMap) ensoShaderRef.current.uniforms.iodMap.value = iodMap;
    if (floodShaderRef.current && sshMap) floodShaderRef.current.uniforms.sshMap.value = sshMap;
    if (heatwaveShaderRef.current && sstMap) heatwaveShaderRef.current.uniforms.sstMap.value = sstMap;
    if (erosionShaderRef.current && currentsMap) erosionShaderRef.current.uniforms.currentsMap.value = currentsMap;
  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap]);"""

code = code.replace(target, replacement)
with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
