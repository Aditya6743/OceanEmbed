import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Add global click listener inside MosdacGlobe component
old_hook = "const { selectedDate } = useOceanStore();"
new_hook = """const { selectedDate } = useOceanStore();

  // GLOBAL CLICK-AWAY LISTENER: Clear HUD if clicking outside the 3D canvas entirely
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.target instanceof Element && !e.target.closest('canvas')) {
        setActivePin(null);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);"""
if "handleGlobalClick" not in code:
    code = code.replace(old_hook, new_hook)

# 2. Add onPointerMissed to the click catcher sphere for clicks inside the canvas but off the globe
old_catcher = """onPointerDown={handleGlobeClick}
        onPointerEnter={() => document.body.style.cursor = 'crosshair'}"""
new_catcher = """onPointerDown={handleGlobeClick}
        onPointerMissed={() => setActivePin(null)}
        onPointerEnter={() => document.body.style.cursor = 'crosshair'}"""
code = code.replace(old_catcher, new_catcher)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Click-away functionality added.")
