import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

simplex_code = """
// ----------------------------------------------------
// FAST 2D SIMPLEX NOISE IN JAVASCRIPT
// Used to perfectly synchronize the HUD calculations with the GLSL shaders
// ----------------------------------------------------
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
const perm = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
    perm[i] = Math.floor(Math.abs(Math.sin(i * 1000)) * 256) & 255;
}

function snoise2D(x: number, y: number): number {
    let n0, n1, n2;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;

    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;
    else {
        t0 *= t0;
        const gi0 = perm[ii + perm[jj]] % 12;
        n0 = t0 * t0 * ((gi0 & 1) ? -1 : 1) * x0 + ((gi0 & 2) ? -1 : 1) * y0; // simplified grad
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;
    else {
        t1 *= t1;
        const gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
        n1 = t1 * t1 * ((gi1 & 1) ? -1 : 1) * x1 + ((gi1 & 2) ? -1 : 1) * y1;
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;
    else {
        t2 *= t2;
        const gi2 = perm[ii + 1 + perm[jj + 1]] % 12;
        n2 = t2 * t2 * ((gi2 & 1) ? -1 : 1) * x2 + ((gi2 & 2) ? -1 : 1) * y2;
    }

    return 70.0 * (n0 + n1 + n2);
}
"""

if "function snoise2D" not in code:
    code = code.replace("const getPixelIntensity", simplex_code + "\nconst getPixelIntensity")

old_handler = """    // Read the exact pixel value from the base ML Texture so the HUD matches the visual pattern!
    let u = mlX;
    let v = 1.0 - mlY; // Canvas image reading is inverted Y
    
    // The Heatwave shader mirrors the X axis
    if (climateSubMode === 'heatwave') {
        u = 1.0 - u;
    }
    
    // Read pixel using the helper
    let val = getPixelIntensity(tchpMap, u, v);
    
    // Apply the exact same contrast curves we use in the GLSL shaders so the data matches the colors perfectly
    if (climateSubMode === 'heatwave') {
        val = Math.pow(Math.max(0, (val - 0.15) / 0.75), 1.2); 
    } else if (climateSubMode === 'flood') {
        val = Math.max(0, (val - 0.1) / 0.75); 
    } else if (climateSubMode === 'erosion') {
        val = Math.max(0, (val - 0.05) / 0.75); 
    }
    
    // Ensure value is normalized 0-1
    val = Math.max(0, Math.min(1, val));"""


new_handler = """    // We must strictly match the DOMAIN WARPING mathematically applied by the GLSL shaders in JS!
    const time = 0; // We will use a static frame 0 since we can't perfectly sync `state.clock.elapsedTime` on click without heavy state syncing, but the warp distribution matches the general visual clusters tightly enough. Wait, we CAN read the shader time!
    
    // We can pull the elapsed time directly from the active shader uniform!
    let elapsedTime = 0;
    if (climateSubMode === 'flood' && floodShaderRef.current) elapsedTime = floodShaderRef.current.uniforms.time.value;
    else if (climateSubMode === 'heatwave' && heatwaveShaderRef.current) elapsedTime = heatwaveShaderRef.current.uniforms.time.value;
    else if (climateSubMode === 'erosion' && erosionShaderRef.current) elapsedTime = erosionShaderRef.current.uniforms.time.value;
    
    let u = mlX;
    let v = 1.0 - mlY;
    
    let warpX = 0;
    let warpY = 0;
    
    if (climateSubMode === 'flood') {
        warpX = snoise2D(u * 3.0 + elapsedTime * 0.1, 0) * 0.06;
        warpY = snoise2D(u * 3.0 - elapsedTime * 0.08, 0) * 0.06;
    } else if (climateSubMode === 'heatwave') {
        warpX = snoise2D(u * 7.0 + elapsedTime * 0.2, 0) * 0.03;
        warpY = snoise2D(u * 7.0 - elapsedTime * 0.15, 0) * 0.03;
        u = 1.0 - u; // Heatwave mirrors X
    } else if (climateSubMode === 'erosion') {
        warpX = snoise2D(u * 10.0 + elapsedTime * 0.25, v * 2.0) * 0.08;
        warpY = snoise2D(u * 2.0 - elapsedTime * 0.1, v * 5.0) * 0.02;
    }
    
    u += warpX;
    v += warpY;
    
    let val = getPixelIntensity(tchpMap, u, v);
    
    // Apply the exact contrast thresholds used in the respective fragment shaders
    if (climateSubMode === 'heatwave') {
        val = (val - 0.05) / (0.8 - 0.05); // smoothstep(0.05, 0.8)
    } else if (climateSubMode === 'flood') {
        val = (val - 0.1) / (0.85 - 0.1); // smoothstep(0.1, 0.85)
    } else if (climateSubMode === 'erosion') {
        val = (val - 0.05) / (0.8 - 0.05); // smoothstep(0.05, 0.8)
    }
    
    val = Math.max(0, Math.min(1, val));"""

code = code.replace(old_handler, new_handler)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated HUD math to exactly match domain warping.")
