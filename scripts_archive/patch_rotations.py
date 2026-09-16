import os
import glob

def patch_file(filepath):
    with open(filepath, 'r') as f:
        code = f.read()

    # Remove the mesh spinning
    if "globeRef.current.rotation.y += 0.0005" in code:
        code = code.replace("if (globeRef.current && !isRotationLocked) globeRef.current.rotation.y += 0.0005;", "")
        code = code.replace("if (globeRef.current) globeRef.current.rotation.y += 0.0005;", "")

    with open(filepath, 'w') as f:
        f.write(code)

patch_file("frontend/src/components/MosdacGlobe.tsx")
patch_file("frontend/src/components/EarthGlobe.tsx")
