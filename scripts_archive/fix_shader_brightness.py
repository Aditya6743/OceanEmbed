import re
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = """        vec3 finalColor = mlData.rgb;
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));"""

replacement = """        vec3 finalColor = mlData.rgb * 1.5; // Boost brightness for Additive Blending
        float alpha = 1.0; // Maximize visibility
        
        gl_FragColor = vec4(finalColor, alpha);"""

code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
