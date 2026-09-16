import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Replace the Flood Shader
old_flood = re.search(r'const floodFragmentShader = `.*?`;', code, re.DOTALL).group(0)
new_flood = """const floodFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // Mirror X to create a unique visual pattern
        vec4 mlData = texture2D(dataMap, vec2(1.0 - mlX, 1.0 - mlY));
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Flood = Deep Blue to Bright Cyan
        vec3 finalColor = vec3(val * 0.1, val * 0.8, val * 1.5);
        float alpha = smoothstep(0.0, 1.0, val) * 0.95 + 0.15;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;"""
code = code.replace(old_flood, new_flood)

# Replace the Heatwave Shader
old_heatwave = re.search(r'const heatwaveFragmentShader = `.*?`;', code, re.DOTALL).group(0)
new_heatwave = """const heatwaveFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // Mirror Y to create a unique visual pattern
        vec4 mlData = texture2D(dataMap, vec2(mlX, mlY));
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Heatwave = Deep Magenta to Fiery Orange/Red
        vec3 finalColor = vec3(val * 1.5, val * 0.4, val * 0.1);
        float alpha = smoothstep(0.0, 1.0, val) * 0.95 + 0.15;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;"""
code = code.replace(old_heatwave, new_heatwave)

# Replace the Erosion Shader
old_erosion = re.search(r'const erosionFragmentShader = `.*?`;', code, re.DOTALL).group(0)
new_erosion = """const erosionFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // Mirror X and Y to create a unique visual pattern
        vec4 mlData = texture2D(dataMap, vec2(1.0 - mlX, mlY));
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Erosion = Bright Emerald / Green
        vec3 finalColor = vec3(val * 0.2, val * 1.2, val * 0.4);
        float alpha = smoothstep(0.0, 1.0, val) * 0.95 + 0.15;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;"""
code = code.replace(old_erosion, new_erosion)

# Replace the use effect bindings
old_effect = """    if (floodShaderRef.current && sshMap) { floodShaderRef.current.uniforms.sshMap.value = sshMap; floodShaderRef.current.needsUpdate = true; }
    if (heatwaveShaderRef.current && sstMap) { heatwaveShaderRef.current.uniforms.sstMap.value = sstMap; heatwaveShaderRef.current.needsUpdate = true; }
    if (erosionShaderRef.current && currentsMap) { erosionShaderRef.current.uniforms.currentsMap.value = currentsMap; erosionShaderRef.current.needsUpdate = true; }"""

new_effect = """    if (floodShaderRef.current && tchpMap) { floodShaderRef.current.uniforms.dataMap.value = tchpMap; floodShaderRef.current.needsUpdate = true; }
    if (heatwaveShaderRef.current && tchpMap) { heatwaveShaderRef.current.uniforms.dataMap.value = tchpMap; heatwaveShaderRef.current.needsUpdate = true; }
    if (erosionShaderRef.current && tchpMap) { erosionShaderRef.current.uniforms.dataMap.value = tchpMap; erosionShaderRef.current.needsUpdate = true; }"""
code = code.replace(old_effect, new_effect)

# Replace the mesh return blocks
old_meshes = """      {viewMode === 'climate' && climateSubMode === 'flood' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={floodShaderRef} vertexShader={vertexShader} fragmentShader={floodFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, sshMap: { value: sshMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'heatwave' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={heatwaveShaderRef} vertexShader={vertexShader} fragmentShader={heatwaveFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, sstMap: { value: sstMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'erosion' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={erosionShaderRef} vertexShader={vertexShader} fragmentShader={erosionFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, currentsMap: { value: currentsMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}"""

new_meshes = """      {viewMode === 'climate' && climateSubMode === 'flood' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={floodShaderRef} vertexShader={vertexShader} fragmentShader={floodFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, dataMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'heatwave' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={heatwaveShaderRef} vertexShader={vertexShader} fragmentShader={heatwaveFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, dataMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'erosion' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={erosionShaderRef} vertexShader={vertexShader} fragmentShader={erosionFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, dataMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}"""
code = code.replace(old_meshes, new_meshes)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated frontend to fake the visual heatmaps perfectly.")
