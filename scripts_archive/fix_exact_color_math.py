import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Fix the multiplier in snoise2D
code = code.replace("return 70.0 * (n0 + n1 + n2);", "return 130.0 * (n0 + n1 + n2);")

# Add a smoothstep function and fix the math
old_math = """    // Apply the exact contrast thresholds used in the respective fragment shaders
    if (climateSubMode === 'heatwave') {
        val = (val - 0.05) / (0.8 - 0.05); // smoothstep(0.05, 0.8)
    } else if (climateSubMode === 'flood') {
        val = (val - 0.1) / (0.85 - 0.1); // smoothstep(0.1, 0.85)
    } else if (climateSubMode === 'erosion') {
        val = (val - 0.05) / (0.8 - 0.05); // smoothstep(0.05, 0.8)
    }
    
    val = Math.max(0, Math.min(1, val));"""

new_math = """    // Exact JS implementation of GLSL smoothstep to perfectly match color gradients
    const smoothstep = (edge0: number, edge1: number, x: number) => {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3.0 - 2.0 * t);
    };
    
    // Apply the exact contrast thresholds used in the respective fragment shaders
    if (climateSubMode === 'heatwave') {
        val = smoothstep(0.05, 0.8, val);
    } else if (climateSubMode === 'flood') {
        val = smoothstep(0.1, 0.85, val);
    } else if (climateSubMode === 'erosion') {
        val = smoothstep(0.05, 0.8, val);
    } else {
        val = smoothstep(0.0, 1.0, val);
    }
    
    // Ensure value is normalized 0-1
    val = Math.max(0, Math.min(1, val));"""

code = code.replace(old_math, new_math)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Math strictly synchronized to color patterns.")
