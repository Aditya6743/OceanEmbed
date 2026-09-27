const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const soundHelper = `
  const playUISound = (type: 'click' | 'start' | 'expand') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      if (!(window as any).audioCtx) (window as any).audioCtx = new AudioContext();
      const ctx = (window as any).audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.8);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'expand') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch(e) {}
  };
`;

// Insert the sound helper right after state declarations
content = content.replace(
  /const \[progress, setProgress\] = useState\(0\);\n/g,
  `const [progress, setProgress] = useState(0);\n${soundHelper}`
);

// Add to startSimulation
content = content.replace(
  /const startSimulation = \(\) => \{\n\s*onInteract\(\);/g,
  "const startSimulation = () => {\n    onInteract();\n    playUISound('start');"
);

// Add to reset
content = content.replace(
  /const reset = \(\) => \{\n\s*setSimState\('idle'\);/g,
  "const reset = () => {\n    playUISound('click');\n    setSimState('idle');"
);

// Add to ShowThermalRisk toggle
content = content.replace(
  /onClick=\{\(\) => setShowThermalRisk\(!showThermalRisk\)\}/g,
  "onClick={() => { setShowThermalRisk(!showThermalRisk); playUISound('click'); }}"
);

// Add to ShowCurrents toggle
content = content.replace(
  /onClick=\{\(\) => setShowCurrents\(!showCurrents\)\}/g,
  "onClick={() => { setShowCurrents(!showCurrents); playUISound('click'); }}"
);

// Add to Time Controls
content = content.replace(
  /onClick=\{\(\) => \{ setSarTimeHour\(h\); setSimState\('complete'\); onInteract\(\); \}\}/g,
  "onClick={() => { setSarTimeHour(h); setSimState('complete'); onInteract(); playUISound('click'); }}"
);

// Add to Expand Area
content = content.replace(
  /setSarTimeHour\(next\);\n\s*setSimState\('complete'\);\n\s*onInteract\(\);/g,
  "setSarTimeHour(next);\n                      setSimState('complete');\n                      onInteract();\n                      playUISound('expand');"
);

// Add to Start/Dest mock buttons
content = content.replace(
  /<button className="w-full text-left bg-black/g,
  `<button onClick={() => playUISound('click')} className="w-full text-left bg-black`
);

fs.writeFileSync(file, content);
console.log('Injected UI Sounds');
