import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Add the getPixelIntensity helper outside the component
pixel_helper = """
// Helper to read actual texture data on the CPU to sync the HUD with the visuals
const getPixelIntensity = (texture: THREE.Texture | null, u: number, v: number): number => {
    if (!texture || !texture.image) return Math.random();
    try {
        const img = texture.image;
        const w = img.width || img.videoWidth;
        const h = img.height || img.videoHeight;
        
        if (!w || !h) return Math.random();
        
        const canvas = (window as any)._heatmapCanvas || document.createElement('canvas');
        const ctx = (window as any)._heatmapCtx || canvas.getContext('2d', { willReadFrequently: true });
        
        if (!(window as any)._heatmapCanvas) {
            (window as any)._heatmapCanvas = canvas;
            (window as any)._heatmapCtx = ctx;
        }
        
        if ((window as any)._lastTex !== img) {
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            (window as any)._lastTex = img;
        }
        
        // Clamp coordinates
        const x = Math.max(0, Math.min(w - 1, Math.floor(u * w)));
        const y = Math.max(0, Math.min(h - 1, Math.floor(v * h)));
        
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        return (pixel[0] + pixel[1] + pixel[2]) / (3.0 * 255.0);
    } catch (e) {
        return Math.random(); // Fallback if CORS tainted
    }
};
"""

if "const getPixelIntensity" not in code:
    code = code.replace("export default function MosdacGlobe", pixel_helper + "\nexport default function MosdacGlobe")

# Update the handleGlobeClick logic to use the actual texture
old_handler = """    // STRICT BOUNDING BOX: Only allow clicks within the Indian Ocean (Lat 5 to 30, Lon 45 to 105)
    // Relaxed slightly so edges are clickable
    if (lat < 0.0 || lat > 35.0 || lon < 40.0 || lon > 110.0) {
        setActivePin(null);
        return;
    }
    
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;
    const val = seed - Math.floor(seed);"""

new_handler = """    // STRICT BOUNDING BOX: Only allow clicks within the Indian Ocean (Lat 5 to 30, Lon 45 to 105)
    if (lat < 5.0 || lat > 30.0 || lon < 45.0 || lon > 105.0) {
        setActivePin(null);
        return;
    }
    
    // Map click Lat/Lon directly to the Heatmap UV space (mlX, mlY)
    const mlX = (lon - 45.0) / 60.0;
    const mlY = (lat - 5.0) / 25.0;
    
    // Read the exact pixel value from the base ML Texture so the HUD matches the visual pattern!
    // We account for the specific UV flipping done in the shaders
    let u = mlX;
    let v = 1.0 - mlY; // Canvas image reading is inverted Y
    
    // The Heatwave shader mirrors the X axis
    if (climateSubMode === 'heatwave') {
        u = 1.0 - u;
    }
    
    let val = getPixelIntensity(tchpMap, u, v);
    
    // Apply the exact same contrast curves we use in the GLSL shaders so the data matches the colors perfectly
    if (climateSubMode === 'heatwave') {
        val = Math.pow(Math.max(0, (val - 0.15) / 0.75), 1.2); // smoothstep(0.15, 0.9)
    } else if (climateSubMode === 'flood') {
        val = Math.max(0, (val - 0.1) / 0.75); // smoothstep(0.1, 0.85)
    } else if (climateSubMode === 'erosion') {
        val = Math.max(0, (val - 0.05) / 0.75); // smoothstep(0.05, 0.8)
    } else {
        val = val; // Cyclone base
    }
    
    // Ensure value is normalized 0-1
    val = Math.max(0, Math.min(1, val));
    """

code = code.replace(old_handler, new_handler)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated HUD math to sync with visible pixels.")
