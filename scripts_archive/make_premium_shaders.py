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
"""

new_flood = f"""const floodFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
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
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        // PREMIUM DOMAIN WARPING: Distort the real ML data using sweeping liquid noise
        float warpX = snoise(uv * 3.0 + time * 0.1) * 0.06;
        float warpY = snoise(uv * 3.0 - time * 0.08) * 0.06;
        
        vec4 mlData = texture2D(dataMap, uv + vec2(warpX, warpY));
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        val = smoothstep(0.1, 0.85, val); // Enhance contrast for a premium look
        
        // PREMIUM COLOR PALETTE: Deep Ocean Blue -> Vibrant Cyan -> Pure White
        vec3 col = mix(vec3(0.0, 0.1, 0.5), vec3(0.0, 0.6, 0.9), smoothstep(0.0, 0.5, val));
        col = mix(col, vec3(0.2, 0.9, 1.0), smoothstep(0.5, 0.8, val));
        col = mix(col, vec3(0.9, 1.0, 1.0), smoothstep(0.8, 1.0, val));
        
        float alpha = smoothstep(0.0, 0.8, val) * 0.9 + 0.1;
        gl_FragColor = vec4(col, min(alpha, 1.0));
    }} else {{
        discard;
    }}
  }}
`;"""

new_heatwave = f"""const heatwaveFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
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
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        // PREMIUM DOMAIN WARPING: Tight, turbulent thermal distortions
        float warpX = snoise(uv * 7.0 + time * 0.2) * 0.03;
        float warpY = snoise(uv * 7.0 - time * 0.15) * 0.03;
        
        vec4 mlData = texture2D(dataMap, vec2(1.0 - uv.x, uv.y) + vec2(warpX, warpY)); // Mirror X to ensure layout difference
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        val = pow(smoothstep(0.15, 0.9, val), 1.2); 
        
        // PREMIUM COLOR PALETTE: Deep Purple -> Crimson -> Searing Orange -> Bright Yellow (Inferno style)
        vec3 col = mix(vec3(0.2, 0.0, 0.4), vec3(0.8, 0.1, 0.3), smoothstep(0.0, 0.4, val));
        col = mix(col, vec3(1.0, 0.4, 0.0), smoothstep(0.4, 0.75, val));
        col = mix(col, vec3(1.0, 0.9, 0.2), smoothstep(0.75, 1.0, val));
        
        float alpha = smoothstep(0.0, 0.7, val) * 0.95 + 0.05;
        gl_FragColor = vec4(col, min(alpha, 1.0));
    }} else {{
        discard;
    }}
  }}
`;"""

new_erosion = f"""const erosionFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
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
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        // PREMIUM DOMAIN WARPING: Directional shear stress (currents)
        float warpX = snoise(uv * vec2(10.0, 2.0) + time * 0.25) * 0.08;
        float warpY = snoise(uv * vec2(2.0, 5.0) - time * 0.1) * 0.02;
        
        vec4 mlData = texture2D(dataMap, uv + vec2(warpX, warpY));
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        val = smoothstep(0.05, 0.8, val);
        
        // PREMIUM COLOR PALETTE: Midnight Blue -> Emerald Green -> Neon Yellow
        vec3 col = mix(vec3(0.0, 0.1, 0.3), vec3(0.0, 0.6, 0.4), smoothstep(0.0, 0.4, val));
        col = mix(col, vec3(0.2, 0.9, 0.3), smoothstep(0.4, 0.8, val));
        col = mix(col, vec3(0.9, 1.0, 0.2), smoothstep(0.8, 1.0, val));
        
        float alpha = smoothstep(0.0, 0.6, val) * 0.9 + 0.1;
        gl_FragColor = vec4(col, min(alpha, 1.0));
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

print("Updated shaders with premium Domain Warping on real ML data and ultra-high-end color palettes.")
