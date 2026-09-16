import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Add useCallback to imports
if "useCallback" not in code:
    code = code.replace("import { useState, useRef, useEffect }", "import { useState, useRef, useEffect, useCallback }")

# 2. Fix the activePin state.
# Let's insert it inside `export default function MosdacGlobe`
# Let's find: `const [currentsMap, setCurrentsMap] = useState<THREE.Texture | null>(null);`
if "const [activePin" not in code:
    old_state = "const [currentsMap, setCurrentsMap] = useState<THREE.Texture | null>(null);"
    new_state = "const [currentsMap, setCurrentsMap] = useState<THREE.Texture | null>(null);\n  const [activePin, setActivePin] = useState<{lat: number, lon: number, point: THREE.Vector3, val: number} | null>(null);"
    code = code.replace(old_state, new_state)

# 3. Remove ALL instances of handleGlobeClick
code = re.sub(r'  const handleGlobeClick = useCallback\(\(e: any\).*?  \}, \[\]\);\n\n', '', code, flags=re.DOTALL)

# 4. Insert handleGlobeClick exactly once, right before the MAIN useFrame
# Let's insert it right after `useOceanStore()` inside MosdacGlobe
old_hook = "const { selectedDate } = useOceanStore();"
new_hook = """const { selectedDate } = useOceanStore();

  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    const p = e.point.clone().normalize();
    const lat = Math.asin(p.y) * (180 / Math.PI);
    const lon = Math.atan2(-p.z, p.x) * (180 / Math.PI);
    
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;
    const val = seed - Math.floor(seed);
    const surfacePoint = p.multiplyScalar(2.02);
    
    setActivePin({ lat, lon, point: surfacePoint, val });
  }, []);"""
if "handleGlobeClick = useCallback" not in code:
    code = code.replace(old_hook, new_hook)

# write the code back
with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("File fixed.")
