import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Fix the marker position math
old_surface = """    // Push the WORLD point slightly outwards toward the camera
    const surfacePoint = e.point.clone().normalize().multiplyScalar(2.05);
    
    setActivePin({ lat, lon, point: surfacePoint, val });"""
new_surface = """    // Push the LOCAL point slightly outwards so it stays glued to the rotated globe
    const surfacePoint = localPoint.clone().multiplyScalar(2.05);
    
    setActivePin({ lat, lon, point: surfacePoint, val });"""
code = code.replace(old_surface, new_surface)

# Add the cursor change on hover
old_catcher = """<Sphere args={[2.015, 64, 64]} onPointerDown={handleGlobeClick}><meshBasicMaterial transparent opacity={0} depthWrite={false} /></Sphere>"""
new_catcher = """<Sphere 
        args={[2.015, 64, 64]} 
        onPointerDown={handleGlobeClick}
        onPointerEnter={() => document.body.style.cursor = 'crosshair'}
        onPointerLeave={() => document.body.style.cursor = 'auto'}
      >
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </Sphere>"""
code = code.replace(old_catcher, new_catcher)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Fixed marker placement and cursor.")
