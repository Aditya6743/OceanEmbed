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

// We will replace it where it currently is with nothing, and insert it after the Vessel Profile grid.
// First, find the vessel profile grid end.
const targetVesselEnd = `              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1.5">Target Speed</label>
                <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-[11px] text-white font-mono">14.5 knots</div>
              </div>
            </div>`;

// Check if we can find it
if (content.includes(toggleBlock.trim())) {
    content = content.replace(toggleBlock.trim(), ''); // Remove from original spot
    
    // Insert after the grid
    content = content.replace(targetVesselEnd, targetVesselEnd + '\n' + toggleBlock);
    
    fs.writeFileSync(file, content);
    console.log("Moved toggle in Routing mode");
} else {
    console.log("Could not find exact toggle block string.");
}
