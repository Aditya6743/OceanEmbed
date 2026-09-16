import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Add playSimplePing outside component if not there
ping_code = """
const playSimplePing = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    if (!(window as any).audioCtx) (window as any).audioCtx = new AudioContext();
    const ctx = (window as any).audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};
"""

if "playSimplePing" not in code:
    code = code.replace("export default function MosdacGlobe({", ping_code + "\nexport default function MosdacGlobe({")

# Call playSimplePing in handleGlobeClick
old_click = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();"""

new_click = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    playSimplePing();"""

code = code.replace(old_click, new_click)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Added ping sound.")
