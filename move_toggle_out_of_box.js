const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const toggleBlock = `
            <div className="mb-4 flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Show Current Vectors</span>
              <button onClick={() => { setShowCurrents(!showCurrents); }} className={\`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none \${showCurrents ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}\`}>
                 <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${showCurrents ? 'translate-x-[18px]' : 'translate-x-0.5'}\`} />
               </button>
            </div>`;

// Remove it from its current position
content = content.replace(toggleBlock, '');

// The target to insert BEFORE
const targetSimBox = `          <div className="bg-[#030712]/80 border border-cyan-500/30 rounded-xl p-5 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 bg-cyan-500/20 text-cyan-400 text-[8px] font-mono font-bold px-2 py-1 rounded-bl-lg border-l border-b border-cyan-500/30 tracking-widest">SIMULATION</div>`;

const toggleBlockAdjusted = `
          <div className="mb-6 flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Show Current Vectors</span>
              <button onClick={() => { setShowCurrents(!showCurrents); }} className={\`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none \${showCurrents ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}\`}>
                 <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${showCurrents ? 'translate-x-[18px]' : 'translate-x-0.5'}\`} />
               </button>
          </div>
`;

content = content.replace(targetSimBox, toggleBlockAdjusted + '\n' + targetSimBox);

fs.writeFileSync(file, content);
console.log('Moved toggle out of the routing box');
