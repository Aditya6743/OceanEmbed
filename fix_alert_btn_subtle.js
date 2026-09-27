const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetClass = "'bg-black/60 hover:bg-black/80 border border-white/10 hover:border-rose-500/50 text-rose-400 shadow-lg'";
const newClass = "'bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-400/60 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.15)]'";

content = content.replace(targetClass, newClass);

fs.writeFileSync(file, content);
console.log('Fixed RUN ALERT SIMULATION button to subtle red');
