const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `<div className="flex gap-2">
                  <div className="flex gap-1 mb-4">
                  {[1, 3, 6, 12, 24].map((h) => (
                    <button key={h} onClick={() => { setSarTimeHour(h); setSimState('complete'); onInteract(); }} className={\`flex-1 py-1.5 rounded border text-[9px] font-bold font-mono transition-all \${sarTimeHour === h ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-black border-white/10 text-slate-400 hover:text-white hover:border-white/30'}\`}>+\${h}H</button>
                  ))}
                </div>`;

const replaceStr = `<div className="flex gap-2 items-center">
                  <div className="flex gap-1">
                  {[1, 3, 6, 12, 24].map((h) => (
                    <button key={h} onClick={() => { setSarTimeHour(h); setSimState('complete'); onInteract(); }} className={\`flex-1 py-2 px-1.5 rounded border text-[9px] font-bold font-mono transition-all \${sarTimeHour === h ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-black border-white/10 text-slate-400 hover:text-white hover:border-white/30'}\`}>+\${h}H</button>
                  ))}
                </div>`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync(file, content);
console.log('Fixed vertical alignment of SAR time buttons');
