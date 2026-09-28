const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'className="w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl bg-black/80 border-slate-700/50"',
    'className={`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl ${isFail ? "bg-black/80 border-slate-700 opacity-90" : isAlert ? "bg-black/80 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]" : "bg-black/80 border-slate-700/50"}`}'
);

content = content.replace(
    'className="p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b bg-white/5 border-white/5 text-slate-400"',
    'className={`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b ${isFail ? "bg-white/5 border-slate-700/50 text-slate-500" : isAlert ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-white/5 border-white/5 text-slate-400"}`}'
);

content = content.replace(
    'className="w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl bg-black/80 border-slate-700/50"',
    'className={`w-72 min-h-[155px] flex flex-col rounded-xl border backdrop-blur-md overflow-hidden transition-all duration-500 shadow-2xl ${simState.step >= 8 && !isAck ? "bg-black/80 border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]" : "bg-black/80 border-slate-700/50"}`}'
);

content = content.replace(
    'className="p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b bg-white/5 border-white/5 text-slate-400"',
    'className={`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b ${simState.step >= 8 && !isAck ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white/5 border-white/5 text-slate-400"}`}'
);

fs.writeFileSync(file, content);
console.log('Restored dynamic state borders without syntax errors.');
