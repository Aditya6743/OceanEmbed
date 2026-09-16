with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Add climateSubMode prop
code = code.replace("viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso', isRotationLocked?: boolean }", "viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean }")
code = code.replace("export default function MosdacGlobe({ viewMode = 'climate', isRotationLocked = false }:", "export default function MosdacGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', isRotationLocked = false }:")

# Load new maps
maps_state_old = """  const [tchpMap, setTchpMap] = useState<THREE.Texture | null>(null);
  const [fisheryMap, setFisheryMap] = useState<THREE.Texture | null>(null);
  const [navyMap, setNavyMap] = useState<THREE.Texture | null>(null);
  const [benthicMap, setBenthicMap] = useState<THREE.Texture | null>(null);
  const [iodMap, setIodMap] = useState<THREE.Texture | null>(null);"""
  
maps_state_new = """  const [tchpMap, setTchpMap] = useState<THREE.Texture | null>(null);
  const [fisheryMap, setFisheryMap] = useState<THREE.Texture | null>(null);
  const [navyMap, setNavyMap] = useState<THREE.Texture | null>(null);
  const [benthicMap, setBenthicMap] = useState<THREE.Texture | null>(null);
  const [iodMap, setIodMap] = useState<THREE.Texture | null>(null);
  const [sshMap, setSshMap] = useState<THREE.Texture | null>(null);
  const [sstMap, setSstMap] = useState<THREE.Texture | null>(null);
  const [currentsMap, setCurrentsMap] = useState<THREE.Texture | null>(null);"""
code = code.replace(maps_state_old, maps_state_new)

loader_old = """    loader.load(`${BASE_URL}/spatial/heatmap/tchp${query}`, setTchpMap, undefined, () => console.warn('Failed to load tchp'));
    loader.load(`${BASE_URL}/spatial/heatmap/fishery${query}`, setFisheryMap);
    loader.load(`${BASE_URL}/spatial/heatmap/navy${query}`, setNavyMap);
    loader.load(`${BASE_URL}/spatial/heatmap/benthic${query}`, setBenthicMap);
    loader.load(`${BASE_URL}/spatial/heatmap/iod${query}`, setIodMap);
  }, [selectedDate]);"""
  
loader_new = """    loader.load(`${BASE_URL}/spatial/heatmap/tchp${query}`, setTchpMap, undefined, () => console.warn('Failed to load tchp'));
    loader.load(`${BASE_URL}/spatial/heatmap/fishery${query}`, setFisheryMap);
    loader.load(`${BASE_URL}/spatial/heatmap/navy${query}`, setNavyMap);
    loader.load(`${BASE_URL}/spatial/heatmap/benthic${query}`, setBenthicMap);
    loader.load(`${BASE_URL}/spatial/heatmap/iod${query}`, setIodMap);
    loader.load(`${BASE_URL}/spatial/heatmap/ssh${query}`, setSshMap);
    loader.load(`${BASE_URL}/spatial/heatmap/sst${query}`, setSstMap);
    loader.load(`${BASE_URL}/spatial/heatmap/currents${query}`, setCurrentsMap);
  }, [selectedDate]);"""
code = code.replace(loader_old, loader_new)

uniforms_old = """    iodMap: { value: iodMap }
  }), [specularMap, tchpMap, fisheryMap, navyMap, benthicMap, iodMap]);"""
  
uniforms_new = """    iodMap: { value: iodMap },
    sshMap: { value: sshMap },
    sstMap: { value: sstMap },
    currentsMap: { value: currentsMap }
  }), [specularMap, tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap]);"""
code = code.replace(uniforms_old, uniforms_new)

# Refs
refs_old = """  const cableShaderRef = useRef<THREE.ShaderMaterial>(null);
  const ensoShaderRef = useRef<THREE.ShaderMaterial>(null);"""
refs_new = """  const cableShaderRef = useRef<THREE.ShaderMaterial>(null);
  const ensoShaderRef = useRef<THREE.ShaderMaterial>(null);
  const floodShaderRef = useRef<THREE.ShaderMaterial>(null);
  const heatwaveShaderRef = useRef<THREE.ShaderMaterial>(null);
  const erosionShaderRef = useRef<THREE.ShaderMaterial>(null);"""
code = code.replace(refs_old, refs_new)

# Frame update
frame_old = """    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = state.clock.elapsedTime;"""
frame_new = """    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (floodShaderRef.current) floodShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (heatwaveShaderRef.current) heatwaveShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (erosionShaderRef.current) erosionShaderRef.current.uniforms.time.value = state.clock.elapsedTime;"""
code = code.replace(frame_old, frame_new)

# Shaders
# Since we need new shaders, let's inject them below the ensoFragmentShader.
generic_shader_template = """
const %sFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D %sMap;
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
        
        vec4 mlData = texture2D(%sMap, vec2(mlX, 1.0 - mlY));
        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        if (intensity < 0.05) discard;
        
        vec3 finalColor = mlData.rgb;
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;
"""
shaders_to_inject = generic_shader_template % ("flood", "ssh", "ssh") + generic_shader_template % ("heatwave", "sst", "sst") + generic_shader_template % ("erosion", "currents", "currents")

# We find the end of ensoFragmentShader
code = code.replace("function ArgoBeacon", shaders_to_inject + "\nfunction ArgoBeacon")

# Render logic
render_old = """      {viewMode === 'climate' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={tchpShaderRef} vertexShader={vertexShader} fragmentShader={tchpFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}"""
render_new = """      {viewMode === 'climate' && climateSubMode === 'cyclone' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={tchpShaderRef} vertexShader={vertexShader} fragmentShader={tchpFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'flood' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={floodShaderRef} vertexShader={vertexShader} fragmentShader={floodFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'heatwave' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={heatwaveShaderRef} vertexShader={vertexShader} fragmentShader={heatwaveFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'erosion' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={erosionShaderRef} vertexShader={vertexShader} fragmentShader={erosionFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}"""
code = code.replace(render_old, render_new)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)

