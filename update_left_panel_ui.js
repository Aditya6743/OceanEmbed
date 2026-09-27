const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Props interface
content = content.replace(
  /interface RoutingSarLeftPanelProps \{[\s\S]*?setActiveMode: \(mode: 'routing' \| 'sar'\) => void;\n\}/s,
  `interface RoutingSarLeftPanelProps {
  simState: 'idle' | 'running' | 'complete';
  setSimState: (state: 'idle' | 'running' | 'complete') => void;
  activeMode: 'routing' | 'sar';
  setActiveMode: (mode: 'routing' | 'sar') => void;
  sarTimeHour: number;
  setSarTimeHour: (h: number) => void;
  showCurrents: boolean;
  setShowCurrents: (s: boolean) => void;
  showThermalRisk: boolean;
  setShowThermalRisk: (s: boolean) => void;
}`
);

// Update function signature
content = content.replace(
  /export default function RoutingSarLeftPanel\(\{ simState, setSimState, activeMode, setActiveMode \}: RoutingSarLeftPanelProps\) \{/g,
  `export default function RoutingSarLeftPanel({ simState, setSimState, activeMode, setActiveMode, sarTimeHour, setSarTimeHour, showCurrents, setShowCurrents, showThermalRisk, setShowThermalRisk }: RoutingSarLeftPanelProps) {`
);

// Add interactive mock buttons for Start/Dest in Routing
content = content.replace(
  /<div className="bg-black\/50 border border-white\/10 rounded px-3 py-2 text-\[11px\] text-white font-mono">Chennai Port, IN<\/div>/g,
  `<button className="w-full text-left bg-black/50 hover:bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded px-3 py-2 text-[11px] text-white font-mono transition-all">Chennai Port, IN</button>`
);
content = content.replace(
  /<div className="bg-black\/50 border border-white\/10 rounded px-3 py-2 text-\[11px\] text-white font-mono">Port Blair, IN<\/div>/g,
  `<button className="w-full text-left bg-black/50 hover:bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded px-3 py-2 text-[11px] text-white font-mono transition-all">Port Blair, IN</button>`
);

// Add the Thermal Risk toggle
const thermalTarget = /<h3 className="text-\[12px\] font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3">/g;
content = content.replace(thermalTarget, `<div className="flex justify-between items-center mb-3">
               <h3 className="text-[12px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Thermometer size={14} className="text-amber-400" /> Thermal Risk Awareness
               </h3>
               <button onClick={() => setShowThermalRisk(!showThermalRisk)} className={\`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none \${showThermalRisk ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}\`}>
                 <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${showThermalRisk ? 'translate-x-[18px]' : 'translate-x-0.5'}\`} />
               </button>
             </div>`);
content = content.replace(/mb-3">\s*<Thermometer size=\{14\}/s, '">\n<Thermometer size={14}'); // cleanup rogue match

// Add the Current Assistance toggle
content = content.replace(
  /<div className="grid grid-cols-2 gap-4 mb-6">/g,
  `<div className="mb-4 flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Show Current Vectors</span>
              <button onClick={() => setShowCurrents(!showCurrents)} className={\`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none \${showCurrents ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}\`}>
                 <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${showCurrents ? 'translate-x-[18px]' : 'translate-x-0.5'}\`} />
               </button>
            </div>\n            <div className="grid grid-cols-2 gap-4 mb-6">`
);

// Add Incident Location button
content = content.replace(
  /<div className="bg-black\/50 border border-white\/10 rounded px-3 py-2 text-\[11px\] text-rose-200 font-mono">11\.5°N, 85\.2°E<\/div>/g,
  `<button className="w-full text-left bg-black/50 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/50 rounded px-3 py-2 text-[11px] text-rose-200 font-mono transition-all">11.5°N, 85.2°E</button>`
);

// Add SAR Time Controls
const expandAreaBtn = /<button className="flex-1 bg-white\/10 hover:bg-white\/20 border border-white\/20 text-white rounded py-2 font-mono text-\[9px\] tracking-widest font-bold transition-all">/g;
content = content.replace(expandAreaBtn, `<div className="flex gap-1 mb-4">
                  {[1, 3, 6, 12, 24].map((h) => (
                    <button key={h} onClick={() => setSarTimeHour(h)} className={\`flex-1 py-1.5 rounded border text-[9px] font-bold font-mono transition-all \${sarTimeHour === h ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-black border-white/10 text-slate-400 hover:text-white hover:border-white/30'}\`}>+{h}H</button>
                  ))}
                </div>
                <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded py-2 font-mono text-[9px] tracking-widest font-bold transition-all">`);

fs.writeFileSync(file, content);
console.log('Updated Left Panel UI');
