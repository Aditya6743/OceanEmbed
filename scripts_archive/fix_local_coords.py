import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

old_click = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    const p = e.point.clone().normalize();
    const lat = Math.asin(p.y) * (180 / Math.PI);
    const lon = Math.atan2(-p.z, p.x) * (180 / Math.PI);"""

new_click = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    
    // VERY IMPORTANT: Convert world intersection point to the globe's local coordinate space!
    // Since the globe is rotated, e.point (world) gives the wrong lat/lon. 
    const localPoint = e.object.worldToLocal(e.point.clone()).normalize();
    
    const lat = Math.asin(localPoint.y) * (180 / Math.PI);
    const lon = Math.atan2(-localPoint.z, localPoint.x) * (180 / Math.PI);"""

code = code.replace(old_click, new_click)

# Also let's broaden the bounding box slightly to make it more forgiving to click
# and use onPointerDown which is much more reliable for mobile/taps than onClick
old_bounds = """    // STRICT BOUNDING BOX: Only allow clicks within the Indian Ocean (Lat 5 to 30, Lon 45 to 105)
    if (lat < 5.0 || lat > 30.0 || lon < 45.0 || lon > 105.0) {"""
new_bounds = """    // BOUNDING BOX: Allow clicks within the Indian Ocean (Lat 0 to 35, Lon 40 to 110)
    // Relaxed slightly so edges are clickable
    if (lat < 0.0 || lat > 35.0 || lon < 40.0 || lon > 110.0) {"""
code = code.replace(old_bounds, new_bounds)

# change onClick to onPointerDown for the click catcher
old_catcher = """<Sphere args={[2.015, 64, 64]} onClick={handleGlobeClick}><meshBasicMaterial transparent opacity={0} depthWrite={false} /></Sphere>"""
new_catcher = """<Sphere args={[2.015, 64, 64]} onPointerDown={handleGlobeClick}><meshBasicMaterial transparent opacity={0} depthWrite={false} /></Sphere>"""
code = code.replace(old_catcher, new_catcher)

# Also, change the activePin position to use e.point directly so it hovers exactly where they clicked in WORLD space!
# We pushed the WORLD point out slightly
old_surface = """    const surfacePoint = p.multiplyScalar(2.02);
    
    setActivePin({ lat, lon, point: surfacePoint, val });"""
new_surface = """    // Push the WORLD point slightly outwards toward the camera
    const surfacePoint = e.point.clone().normalize().multiplyScalar(2.05);
    
    setActivePin({ lat, lon, point: surfacePoint, val });"""
code = code.replace(old_surface, new_surface)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Fixed raycast coordinates and touch events.")
