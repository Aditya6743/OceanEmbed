const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* THERMAL HAZARD AWARENESS \*\/\}\s*<div className="mb-8">[\s\S]*?Caution advised\.<\/span>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newBlock = `{/* THERMAL HAZARD AWARENESS */}
          <div className="mb-8">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-[12px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Thermometer size={14} className="text-amber-400" /> Thermal Risk Awareness
               </h3>
               <button onClick={() => setShowThermalRisk(!showThermalRisk)} className={\`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none \${showThermalRisk ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}\`}>
                 <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${showThermalRisk ? 'translate-x-[18px]' : 'translate-x-0.5'}\`} />
               </button>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed font-light mb-4">
               The V6 Engine uses reconstructed subsurface temperature information together with available ocean-state information to identify regions requiring additional operational attention.
             </p>
             <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Predicted Thermal Risk Zone</span>
                  <span className="text-[10px] text-amber-200/70 font-mono block">SIMULATION: Elevated thermal gradient detected at 50m-100m depth near waypoint Alpha. Caution advised.</span>
                </div>
             </div>
          </div>`;

content = content.replace(regex, newBlock);

fs.writeFileSync(file, content);
