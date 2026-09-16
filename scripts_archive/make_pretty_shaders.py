import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Replace the FBM function to be much smoother (fewer octaves)
old_fbm = """float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}"""
new_fbm = """float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    // Reduced to 2 octaves for much smoother, elegant, flowing gradients rather than dense static
    for (int i = 0; i < 2; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}"""
code = code.replace(old_fbm, new_fbm)

# Flood: Soft, sweeping, elegant waves
old_flood_math = """        // Massive, slow-moving coastal surges simulating SSH anomalies
        float val = fbm(vec2(mlX * 3.0, mlY * 3.0) - time * 0.05) * 0.5 + 0.5;
        
        // Flood = Deep Blue to Bright Cyan
        vec3 finalColor = vec3(val * 0.1, val * 0.6, val * 1.5);
        float alpha = smoothstep(0.2, 1.0, val) * 0.85 + 0.15;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));"""
new_flood_math = """        // Very soft, large-scale sweeping oceanic surges
        float val = fbm(vec2(mlX * 1.2, mlY * 1.2) - time * 0.03) * 0.5 + 0.5;
        // Blend with a gentle sine wave for a flowing water effect
        val = mix(val, sin(mlX * 3.14 + time * 0.05) * 0.5 + 0.5, 0.2);
        
        // Flood = Deep Blue to Bright Cyan
        vec3 finalColor = vec3(val * 0.0, val * 0.7, val * 1.5);
        // Soft alpha falloff so it looks like fluid, not a dense block
        float alpha = smoothstep(0.3, 0.8, val) * 0.6;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));"""
code = code.replace(old_flood_math, new_flood_math)

# Heatwave: Isolated, soft thermal blooms
old_heatwave_math = """        // Concentrated thermal pockets expanding and glowing
        float val = fbm(vec2(mlX * 5.0, mlY * 5.0) + time * 0.02) * 0.5 + 0.5;
        val = pow(val, 1.5); // Increase contrast for intense hotspots
        
        // Heatwave = Deep Magenta to Fiery Orange/Red
        vec3 finalColor = vec3(val * 1.5, val * 0.3, val * 0.1);
        float alpha = smoothstep(0.1, 1.0, val) * 0.9 + 0.1;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));"""
new_heatwave_math = """        // Large, soft, isolated thermal blooms
        float val = fbm(vec2(mlX * 1.8 + time * 0.015, mlY * 1.8)) * 0.5 + 0.5;
        // High power curve to isolate only the peak hotspots, leaving the rest of the ocean dark
        val = pow(val, 3.0); 
        
        // Heatwave = Deep Magenta to Fiery Yellow/Orange
        vec3 finalColor = mix(vec3(0.6, 0.0, 0.3), vec3(1.2, 0.8, 0.1), val);
        float alpha = smoothstep(0.05, 0.5, val) * 0.7;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));"""
code = code.replace(old_heatwave_math, new_heatwave_math)

# Erosion: Graceful boundary currents
old_erosion_math = """        // High-velocity directional boundary currents
        // Stretch X coordinate to make them look like lateral currents sweeping across the ocean
        float val = fbm(vec2(mlX * 12.0, mlY * 2.0) + time * 0.15) * 0.5 + 0.5;
        
        // Erosion = Bright Emerald / Green shear stress
        vec3 finalColor = vec3(val * 0.1, val * 1.2, val * 0.4);
        float alpha = smoothstep(0.2, 1.0, val) * 0.9 + 0.1;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));"""
new_erosion_math = """        // Graceful, sweeping boundary currents (like the Gulf Stream)
        float yDistort = fbm(vec2(mlX * 1.5, time * 0.05)) * 0.3;
        float val = fbm(vec2(mlX * 3.0 - time * 0.06, mlY * 2.5 + yDistort)) * 0.5 + 0.5;
        // Raise to power to form distinct "rivers" of current rather than a dense static field
        val = pow(val, 2.0);
        
        // Erosion = Bright Emerald / Green
        vec3 finalColor = vec3(val * 0.1, val * 1.2, val * 0.5);
        float alpha = smoothstep(0.15, 0.7, val) * 0.6;
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));"""
code = code.replace(old_erosion_math, new_erosion_math)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated procedural shaders to be soft, elegant, and realistic.")
