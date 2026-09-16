import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

bad_effect = """  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.target instanceof Element) {
         // Don't close if clicking a button (like rotation lock) or the HUD itself
         if (e.target.closest('button') || e.target.closest('.hud-popup')) return;
         if (!e.target.closest('canvas')) {
            setActivePin(null);
         }
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);"""

new_effect = """  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.target instanceof Element) {
         // Ignore clicks on any UI overlays (buttons, HUD, absolute positioned toggles on the right panel)
         if (e.target.closest('button') || e.target.closest('.hud-popup') || e.target.closest('.z-20')) return;
         
         // If clicking on the left panel (which is outside canvas), we DO clear the pin
         if (!e.target.closest('canvas')) {
            setActivePin(null);
         }
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);"""

code = code.replace(bad_effect, new_effect)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Patched handleGlobalClick to ignore .z-20 wrappers.")
