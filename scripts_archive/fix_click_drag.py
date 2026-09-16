import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

old_click = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    playSimplePing();"""

new_click = """  const handleGlobeClick = useCallback((e: any) => {
    if (e.delta > 3) return; // Prevent accidental clicks while rotating/dragging
    e.stopPropagation();
    playSimplePing();"""

code = code.replace(old_click, new_click)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Patched handleGlobeClick to ignore drags.")
