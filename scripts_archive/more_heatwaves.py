import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

old_heatwave = re.search(r'const heatwaveFragmentShader = `.*?`;', code, re.DOTALL).group(0)

new_heatwave_logic = """        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        // lowered threshold so much MORE of the heatmap appears, creating massive heatwave blooms
        val = smoothstep(0.05, 0.8, val); 
        
        // PREMIUM COLOR PALETTE: Colors shift earlier to create larger bands of orange and yellow
        vec3 col = mix(vec3(0.3, 0.0, 0.4), vec3(0.9, 0.2, 0.2), smoothstep(0.0, 0.3, val));
        col = mix(col, vec3(1.0, 0.5, 0.0), smoothstep(0.3, 0.6, val)); // Searing orange starts earlier
        col = mix(col, vec3(1.0, 0.95, 0.2), smoothstep(0.6, 1.0, val)); // Bright yellow expands
        
        // Increased alpha so it's less transparent and much more present
        float alpha = smoothstep(0.0, 0.6, val) * 0.95 + 0.2;
        gl_FragColor = vec4(col, min(alpha, 1.0));"""

# find the block in old_heatwave and replace it
import re
new_heatwave = re.sub(r'float val = \(mlData\.r.*gl_FragColor = vec4\(col, min\(alpha, 1\.0\)\);', new_heatwave_logic, old_heatwave, flags=re.DOTALL)

code = code.replace(old_heatwave, new_heatwave)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated Heatwave shader for more intensity and coverage.")
