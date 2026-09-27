const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the solid rose background with the transparent style
const targetClass = "'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'";
const newClass = "'bg-black/60 hover:bg-black/80 border border-white/10 hover:border-rose-500/50 text-rose-400 shadow-lg'";

content = content.replace(targetClass, newClass);

fs.writeFileSync(file, content);
console.log('Fixed RUN ALERT SIMULATION button');
