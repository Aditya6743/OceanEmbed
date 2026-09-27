const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetButton = `                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded py-2 font-mono text-[9px] tracking-widest font-bold transition-all"`;
const newButton = `                    className="flex-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 rounded py-2 font-mono text-[9px] tracking-widest font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)] flex items-center justify-center gap-1.5"`;

// I also want to add a tiny visual icon or something, or just let it text.
// Let's replace the string directly.

content = content.replace(targetButton, newButton);
fs.writeFileSync(file, content);
console.log('Fixed EXPAND AREA button styling');
