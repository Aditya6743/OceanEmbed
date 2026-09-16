import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

noise_lib = """
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}
"""

new_flood = f"""const floodFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  {noise_lib}
  
  void main() {{
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {{
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // Massive, slow-moving coastal surges simulating SSH anomalies
        float val = fbm(vec2(mlX * 3.0, mlY * 3.0) - time * 0.05) * 0.5 + 0.5;
        
        // Flood = Deep Blue to Bright Cyan
        vec3 finalColor = vec3(val * 0.1, val * 0.6, val * 1.5);
        float alpha = smoothstep(0.2, 1.0, val) * 0.85 + 0.15;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    }} else {{
        discard;
    }}
  }}
`;"""

new_heatwave = f"""const heatwaveFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  {noise_lib}
  
  void main() {{
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {{
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // Concentrated thermal pockets expanding and glowing
        float val = fbm(vec2(mlX * 5.0, mlY * 5.0) + time * 0.02) * 0.5 + 0.5;
        val = pow(val, 1.5); // Increase contrast for intense hotspots
        
        // Heatwave = Deep Magenta to Fiery Orange/Red
        vec3 finalColor = vec3(val * 1.5, val * 0.3, val * 0.1);
        float alpha = smoothstep(0.1, 1.0, val) * 0.9 + 0.1;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    }} else {{
        discard;
    }}
  }}
`;"""

new_erosion = f"""const erosionFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  {noise_lib}
  
  void main() {{
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {{
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // High-velocity directional boundary currents
        // Stretch X coordinate to make them look like lateral currents sweeping across the ocean
        float val = fbm(vec2(mlX * 12.0, mlY * 2.0) + time * 0.15) * 0.5 + 0.5;
        
        // Erosion = Bright Emerald / Green shear stress
        vec3 finalColor = vec3(val * 0.1, val * 1.2, val * 0.4);
        float alpha = smoothstep(0.2, 1.0, val) * 0.9 + 0.1;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    }} else {{
        discard;
    }}
  }}
`;"""

code = re.sub(r'const floodFragmentShader = `.*?`;', new_flood, code, flags=re.DOTALL)
code = re.sub(r'const heatwaveFragmentShader = `.*?`;', new_heatwave, code, flags=re.DOTALL)
code = re.sub(r'const erosionFragmentShader = `.*?`;', new_erosion, code, flags=re.DOTALL)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)

print("Updated shaders with stunning, ultra-realistic animated procedural noise that spans the full region.")
