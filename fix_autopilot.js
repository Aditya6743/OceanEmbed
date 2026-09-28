const fs = require('fs');

// 1. Fix Ocean3D.tsx
let f1 = 'frontend/src/components/Ocean3D.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(
  'const { hoveredDepth, setHoveredDepth, showArgoTubes } = useOceanStore();',
  'const { hoveredDepth, setHoveredDepth, showArgoTubes, viewMode } = useOceanStore();'
);
c1 = c1.replace(
  '    if (isDiving) {\n      diveProgressRef.current += delta / 4.5;',
  '    if (isDiving) {\n      if (viewMode !== "3d") {\n        setIsDiving(false);\n        return;\n      }\n      diveProgressRef.current += delta / 4.5;'
);
fs.writeFileSync(f1, c1);
console.log('Fixed Ocean3D.tsx');

// 2. Fix DepthSlice2D.tsx
let f2 = 'frontend/src/components/DepthSlice2D.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
c2 = c2.replace(
  '    let pct = (clientX - rect.left) / rect.width;\n    pct = Math.max(0, Math.min(1, pct));\n    const index = Math.round(pct * (availableDepths.length - 1));\n    const newDepth = availableDepths[index];',
  '    let pct = (clientX - rect.left) / rect.width;\n    pct = Math.max(0, Math.min(1, pct));\n    const maxDepth = availableDepths[availableDepths.length - 1] || 1000;\n    const targetDepth = pct * maxDepth;\n    const newDepth = availableDepths.reduce((prev, curr) => Math.abs(curr - targetDepth) < Math.abs(prev - targetDepth) ? curr : prev);'
);
c2 = c2.replace(
  'style={{ width: `${(availableDepths.indexOf(sliderDepth) / (availableDepths.length - 1)) * 100}%` }}',
  'style={{ width: `${(sliderDepth / (availableDepths[availableDepths.length - 1] || 1000)) * 100}%` }}'
);
c2 = c2.replace(
  'style={{ left: `${(availableDepths.indexOf(sliderDepth) / (availableDepths.length - 1)) * 100}%`, transform: \'translateX(-50%)\' }}',
  'style={{ left: `${(sliderDepth / (availableDepths[availableDepths.length - 1] || 1000)) * 100}%`, transform: \'translateX(-50%)\' }}'
);
fs.writeFileSync(f2, c2);
console.log('Fixed DepthSlice2D.tsx');

// 3. Fix autopilot.ts
let f3 = 'frontend/src/lib/autopilot.ts';
let c3 = fs.readFileSync(f3, 'utf8');
c3 = c3.replace(
  '      const steps = availableDepths.length - 1;\n      const delayPerStep = 5000 / steps; // 5 seconds total for smoother descent\n      for (let i = 1; i <= steps; i++) {\n        if (isCancelled || !useOceanStore.getState().autoPilotMode) return;\n        window.dispatchEvent(new CustomEvent(\'autopilot-depth\', { detail: availableDepths[i] }));\n        await wait(delayPerStep);\n      }',
  '      const maxD = availableDepths[availableDepths.length - 1] || 1000;\n      const steps = 50;\n      const delayPerStep = 5000 / steps;\n      for (let i = 1; i <= steps; i++) {\n        if (isCancelled || !useOceanStore.getState().autoPilotMode) return;\n        const targetDepth = (i / steps) * maxD;\n        const boundedDepth = availableDepths.reduce((prev, curr) => Math.abs(curr - targetDepth) < Math.abs(prev - targetDepth) ? curr : prev);\n        window.dispatchEvent(new CustomEvent(\'autopilot-depth\', { detail: boundedDepth }));\n        await wait(delayPerStep);\n      }'
);
fs.writeFileSync(f3, c3);
console.log('Fixed autopilot.ts');

