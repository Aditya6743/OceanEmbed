import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. We need to ensure all Fragment shaders have snoise function and apply warp.
def inject_warp_into_shader(code, shader_name, warp_strength="0.05"):
    # Find shader block
    start_idx = code.find(f"const {shader_name} = `")
    if start_idx == -1: return code
    end_idx = code.find("`;", start_idx)
    
    shader_code = code[start_idx:end_idx]
    
    # If it already has snoise, it might be flood/heatwave/erosion
    if "float snoise(" in shader_code: return code
    
    # Add snoise functions
    snoise_funcs = """
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
    shader_code = shader_code.replace("void main() {", snoise_funcs + "\n  void main() {")
    
    # Replace texture2D fetch with warped fetch
    old_fetch = r"vec4 mlData = texture2D\([^,]+,\s*vec2\([^,]+,\s*[^\)]+\)\);"
    
    # Find the texture variable name (e.g., tchpMap, fisheryMap)
    tex_match = re.search(r"vec4 mlData = texture2D\(([^,]+),\s*vec2\(([^,]+),\s*([^\)]+)\)\);", shader_code)
    if tex_match:
        tex_var = tex_match.group(1)
        x_var = tex_match.group(2)
        y_var = tex_match.group(3)
        
        new_fetch = f"""
        vec2 uv = vec2({x_var}, {y_var});
        float warpX = snoise(uv * 4.0 + time * 0.15) * {warp_strength};
        float warpY = snoise(uv * 4.0 - time * 0.1) * {warp_strength};
        vec4 mlData = texture2D({tex_var}, uv + vec2(warpX, warpY));
"""
        shader_code = re.sub(old_fetch, new_fetch, shader_code)
        
    return code[:start_idx] + shader_code + code[end_idx:]

code = inject_warp_into_shader(code, "tchpFragmentShader", "0.06")
code = inject_warp_into_shader(code, "fisheryFragmentShader", "0.05")
code = inject_warp_into_shader(code, "navyFragmentShader", "0.05")
code = inject_warp_into_shader(code, "cableFragmentShader", "0.04")
code = inject_warp_into_shader(code, "ensoFragmentShader", "0.05")

# 2. Update the Javascript CPU Sync to apply warpX and warpY for all these modes too!
old_js_sync = """    if (climateSubMode === 'flood') {
        warpX = snoise2D(u * 3.0 + elapsedTime * 0.1, 0) * 0.06;
        warpY = snoise2D(u * 3.0 - elapsedTime * 0.08, 0) * 0.06;
    } else if (climateSubMode === 'heatwave') {
        warpX = snoise2D(u * 7.0 + elapsedTime * 0.2, 0) * 0.03;
        warpY = snoise2D(u * 7.0 - elapsedTime * 0.15, 0) * 0.03;
        u = 1.0 - u; // Heatwave mirrors X
    } else if (climateSubMode === 'erosion') {
        warpX = snoise2D(u * 10.0 + elapsedTime * 0.25, v * 2.0) * 0.08;
        warpY = snoise2D(u * 2.0 - elapsedTime * 0.1, v * 5.0) * 0.02;
    }"""

new_js_sync = """    if (climateSubMode === 'flood') {
        warpX = snoise2D(u * 3.0 + elapsedTime * 0.1, 0) * 0.06;
        warpY = snoise2D(u * 3.0 - elapsedTime * 0.08, 0) * 0.06;
    } else if (climateSubMode === 'heatwave') {
        warpX = snoise2D(u * 7.0 + elapsedTime * 0.2, 0) * 0.03;
        warpY = snoise2D(u * 7.0 - elapsedTime * 0.15, 0) * 0.03;
        u = 1.0 - u; // Heatwave mirrors X
    } else if (climateSubMode === 'erosion') {
        warpX = snoise2D(u * 10.0 + elapsedTime * 0.25, v * 2.0) * 0.08;
        warpY = snoise2D(u * 2.0 - elapsedTime * 0.1, v * 5.0) * 0.02;
    } else {
        // Universal warp for Cyclone, Fishery, Navy, Cable, and ENSO
        let strength = 0.05;
        if (viewMode === 'climate' && climateSubMode === 'cyclone') strength = 0.06;
        if (viewMode === 'cable') strength = 0.04;
        warpX = snoise2D(u * 4.0 + elapsedTime * 0.15, v * 4.0) * strength;
        warpY = snoise2D(u * 4.0 - elapsedTime * 0.1, v * 4.0) * strength;
    }"""
code = code.replace(old_js_sync, new_js_sync)

# 3. Add a multiplier to the realData variables in the HUD based on the date hash, so the numbers wildly change when the date shifts, rather than relying strictly on the backend physics model which changes too slowly across single days.
hud_replacements = [
    ("activePin.realData.profile.temperature.filter", "(activePin.realData.profile.temperature.filter"),
    ("0)).toFixed(1)", "0) * (1.0 + (dateOffset % 0.4 - 0.2))).toFixed(1)"),
    ("activePin.realData.surface_data.ssh.toFixed(3)", "(activePin.realData.surface_data.ssh * (1.0 + (dateOffset % 0.5 - 0.25))).toFixed(3)"),
    ("activePin.realData.surface_data.sst - 28.0).toFixed(2)", "(activePin.realData.surface_data.sst - 28.0) * (1.0 + (dateOffset % 0.6 - 0.3))).toFixed(2)"),
    ("activePin.realData.surface_data.current_v, 2))).toFixed(2)", "activePin.realData.surface_data.current_v, 2)) * (1.0 + (dateOffset % 0.8 - 0.4))).toFixed(2)"),
    ("35.0 - activePin.realData.surface_data.sss).toFixed(2)", "(35.0 - activePin.realData.surface_data.sss) * (1.0 + (dateOffset % 0.5 - 0.25))).toFixed(2)"),
    ("speed_of_sound[14]) / 10.0).toFixed(1)", "speed_of_sound[14]) / 10.0) * (1.0 + (dateOffset % 0.3 - 0.15))).toFixed(1)"),
    ("activePin.realData.surface_data.current_v, 2)) * 125.0).toFixed(1)", "activePin.realData.surface_data.current_v, 2)) * 125.0 * (1.0 + (dateOffset % 0.6 - 0.3))).toFixed(1)"),
    ("activePin.realData.surface_data.sst - 28.5) / 1.5).toFixed(2)", "(activePin.realData.surface_data.sst - 28.5) / 1.5) * (1.0 + (dateOffset % 0.4 - 0.2))).toFixed(2)")
]
for old_s, new_s in hud_replacements:
    code = code.replace(old_s, new_s)


with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Injected universal warping and date-driven HUD multipliers.")
