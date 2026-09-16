import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Fix the TS error in getPixelIntensity
code = code.replace("const img = texture.image;", "const img = texture.image as any;")

# Now replace the math in handleGlobeClick
old_handler = """    // BOUNDING BOX: Allow clicks within the Indian Ocean (Lat 0 to 35, Lon 40 to 110)
    // Relaxed slightly so edges are clickable
    if (lat < 0.0 || lat > 35.0 || lon < 40.0 || lon > 110.0) {
        setActivePin(null);
        return;
    }
    
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;
    const val = seed - Math.floor(seed);"""

new_handler = """    // BOUNDING BOX: Allow clicks within the Indian Ocean (Lat 0 to 35, Lon 40 to 110)
    if (lat < 0.0 || lat > 35.0 || lon < 40.0 || lon > 110.0) {
        setActivePin(null);
        return;
    }
    
    // Map click Lat/Lon directly to the Heatmap UV space (mlX, mlY)
    const mlX = (lon - 45.0) / 60.0;
    const mlY = (lat - 5.0) / 25.0;
    
    // Read the exact pixel value from the base ML Texture so the HUD matches the visual pattern!
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

code = code.replace(old_handler, new_handler)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated HUD math.")
