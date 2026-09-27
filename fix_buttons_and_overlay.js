const fs = require('fs');
const file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Dim the 'Plan a Route' active button
content = content.replace(
  /bg-cyan-500 text-black shadow-\[0_0_20px_rgba\(34,211,238,0\.4\)\]/g,
  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
);

// Dim the 'Simulate SAR' active button
content = content.replace(
  /bg-rose-500 text-black shadow-\[0_0_20px_rgba\(244,63,94,0\.4\)\]/g,
  'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
);

fs.writeFileSync(file, content);
console.log('Dimmed buttons');
