const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// I'll add the toggle right after the intro text for SAR mode
const targetStr = `          <p className="text-[12px] text-slate-400 leading-relaxed font-light mb-6">
            If a maritime incident occurs, the same ocean intelligence engine can estimate the movement of a drifting vessel, beacon, or object using ocean-current conditions and predicted drift.
          </p>`;

const replacementStr = `          <p className="text-[12px] text-slate-400 leading-relaxed font-light mb-6">
            If a maritime incident occurs, the same ocean intelligence engine can estimate the movement of a drifting vessel, beacon, or object using ocean-current conditions and predicted drift.
          </p>
          
          <div className="mb-6 flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Show Current Vectors</span>
              <button onClick={() => { setShowCurrents(!showCurrents); }} className={\`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none \${showCurrents ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}\`}>
                 <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${showCurrents ? 'translate-x-[18px]' : 'translate-x-0.5'}\`} />
               </button>
            </div>`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(file, content);
console.log('Added currents toggle to SAR pane');
