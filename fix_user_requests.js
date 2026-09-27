const fs = require('fs');

// 1. DigitalTwinGlobe.tsx: Remove cyclone pattern for IoT mode
let fileGlobe = 'frontend/src/components/DigitalTwinGlobe.tsx';
let cGlobe = fs.readFileSync(fileGlobe, 'utf8');
cGlobe = cGlobe.replace(/\{\(viewMode === 'iot' \|\| \(viewMode === 'climate' && climateSubMode === 'cyclone'\)\) && \(/, 
                        "{(viewMode === 'climate' && climateSubMode === 'cyclone') && (");
// Wait, is there any other place?
fs.writeFileSync(fileGlobe, cGlobe);


// 2. Solutions.tsx: Layout changes
let fileSolutions = 'frontend/src/pages/Solutions.tsx';
let cSolutions = fs.readFileSync(fileSolutions, 'utf8');

// The Rotation button wrapper condition is currently:
// {activeTab !== 'iot' && (
//   <div className="absolute top-24 right-6 z-20 pointer-events-auto">
//     <button onClick={() => setIsRotationLocked(!isRotationLocked)} ...

// Let's replace the whole top right block to include both rotation and the 2D button.
// Actually, let's just find the Rotation lock div and replace it.

const rotationBlockRegex = /\{activeTab !== 'iot' && \(\n\s*<div className="absolute top-24 right-6 z-20 pointer-events-auto">[\s\S]*?<\/button>\n\s*<\/div>\n\s*\)\}/;

const newRotationBlock = `
        <div className="absolute top-24 right-6 z-20 pointer-events-auto flex flex-col gap-2 items-end">
          <button
            onClick={() => setIsRotationLocked(!isRotationLocked)}
            className={\`flex items-center gap-2 bg-black/60 border px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all \${isRotationLocked ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-white/10 hover:border-sky-500/20'}\`}
          >
            <span className={\`text-[9px] font-mono tracking-widest font-bold \${isRotationLocked ? 'text-sky-100' : 'text-slate-300'}\`}>
              ROTATION
            </span>
            {isRotationLocked ? (
              <Lock size={12} className="text-amber-500" />
            ) : (
              <Unlock size={12} className="text-sky-300" />
            )}
          </button>
          
          {(activeTab === 'iot' || activeTab === 'sar') && (
            <button
              onClick={() => setIs2DMode(true)}
              className="flex items-center gap-2 bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
            >
              <span className="text-[9px] font-mono tracking-widest font-bold text-white">
                2D TACTICAL
              </span>
              <Scan size={12} className="text-indigo-200" />
            </button>
          )}
        </div>
`;
cSolutions = cSolutions.replace(rotationBlockRegex, newRotationBlock);

// The ARGO fleet condition:
// {activeTab !== 'iot' && (
//   <div className="absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">

const argoBlockRegex = /\{activeTab !== 'iot' && \(\n\s*<div className="absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black\/60 border border-white\/10 px-3 py-1\.5 rounded-full backdrop-blur-md shadow-lg">[\s\S]*?<\/div>\n\s*\)\}/;

const newArgoBlock = `
        {/* ARGO HUD Overlay - Visible on all tabs now */}
        <div className="absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <span className={\`text-[9px] font-mono tracking-widest font-bold \${showGlobeArgo ? 'text-lime-400' : 'text-slate-400'}\`}>
            LIVE ARGO FLEET
          </span>
          <button
            onClick={() => setShowGlobeArgo(!showGlobeArgo)}
            className={\`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none \${showGlobeArgo ? 'bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.5)]' : 'bg-slate-700'}\`}
          >
            <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${showGlobeArgo ? 'translate-x-[18px]' : 'translate-x-0.5'}\`} />
          </button>
        </div>
`;

cSolutions = cSolutions.replace(argoBlockRegex, newArgoBlock);

// We need to import Scan in Solutions.tsx if it's not already there.
if (!cSolutions.includes('Scan,')) {
    cSolutions = cSolutions.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Scan } from 'lucide-react';");
}

fs.writeFileSync(fileSolutions, cSolutions);
console.log('Fixed IoT Cyclone and Added Toggles');
