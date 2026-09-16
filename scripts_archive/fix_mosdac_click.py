import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

bad_effect = """  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.target instanceof Element && !e.target.closest('canvas')) {
        setActivePin(null);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);"""

new_effect = """  useEffect(() => {
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

code = code.replace(bad_effect, new_effect)

# Add class hud-popup to the HUD container
code = code.replace('className="flex flex-col gap-0 min-w-[140px]"', 'className="flex flex-col gap-0 min-w-[140px] hud-popup"')

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Patched handleGlobalClick to not close HUD on button clicks.")
