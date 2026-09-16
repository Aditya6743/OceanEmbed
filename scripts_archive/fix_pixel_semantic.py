import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

old_get_pixel = """const getPixelIntensity = (texture: THREE.Texture | null, u: number, v: number): number => {
    if (!texture || !texture.image) return Math.random();
    try {
        const img = texture.image as any;
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
};"""


new_get_pixel = """// Semantic color reader: Translates specific color maps into a strict 0.0 to 1.0 intensity scale
const getPixelIntensity = (texture: THREE.Texture | null, u: number, v: number, mode: string): number => {
    if (!texture || !texture.image) return Math.random();
    try {
        const img = texture.image as any;
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
        
        const x = Math.max(0, Math.min(w - 1, Math.floor(u * w)));
        const y = Math.max(0, Math.min(h - 1, Math.floor(v * h)));
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        const r = pixel[0] / 255.0;
        const g = pixel[1] / 255.0;
        const b = pixel[2] / 255.0;
        
        // Strictly map the color scale based on the specific section's gradient pattern
        if (mode === 'navy') {
            // Navy (Sonar): Blue (Clear) -> Red (Severe)
            return Math.max(0, Math.min(1, r - b + 0.5)); // High Red = High val, High Blue = Low val
        } else if (mode === 'fishery') {
            // Fishery: Blue (Low) -> Green (Medium) -> Yellow/Red (High)
            // Yellow has high R and G. Blue has high B.
            return Math.max(0, Math.min(1, (r + g) * 0.5 - b * 0.5 + 0.2));
        } else if (mode === 'enso') {
            // ENSO: Blue (Cool/Negative) -> White (Neutral) -> Red (Warm/Positive)
            if (b > r && b > 0.5) return 0.2; // Blue (Negative)
            if (r > b && r > 0.5) return 0.8; // Red (Positive)
            return 0.5; // Neutral
        } else if (mode === 'cable') {
            // Cable: Blue -> Purple -> White/Red
            return Math.max(0, Math.min(1, r)); // Red channel dominance represents high stress
        }
        
        // Default (Climate Heatmaps): Brightness
        return (r + g + b) / 3.0;
    } catch (e) {
        return Math.random();
    }
};"""

code = code.replace(old_get_pixel, new_get_pixel)

old_call = "let val = getPixelIntensity(activeTex, u, v);"
new_call = "let val = getPixelIntensity(activeTex, u, v, viewMode);"
code = code.replace(old_call, new_call)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated semantic color reading.")
