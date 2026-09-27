const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file currently has duplicate ArrowLeft imports because of my previous scripts. Let's clean that up.
content = content.replace(/ArrowLeft, ArrowLeft/g, 'ArrowLeft');

// Fix signature if needed
content = content.replace(
  /export const IotRightView = \(\{ simState, handleIotAck \}: any\) => \{/,
  "export const IotRightView = ({ simState, handleIotAck, onClose }: any) => {"
);

// Apply wrapper
const returnRegex = /return \(\n\s*<div className="w-full h-full relative bg-slate-900 overflow-hidden animate-in fade-in duration-500">/;
const replacement = `return (
    <div className="absolute inset-0 z-20 bg-slate-900 rounded-l-3xl overflow-hidden border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-500">
      <div className="absolute top-6 right-6 z-[400] flex gap-3">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
           <span className="text-emerald-400 font-mono text-xs font-bold tracking-widest">TACTICAL 2D LINK ACTIVE</span>
        </div>
        <button 
          onClick={onClose}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg pointer-events-auto"
        >
          <ArrowLeft size={14} /> BACK TO 3D GLOBE
        </button>
      </div>
      <div className="w-full h-full relative bg-slate-900 overflow-hidden animate-in fade-in duration-500">`;

if (!content.includes('TACTICAL 2D LINK ACTIVE')) {
    content = content.replace(returnRegex, replacement);
    
    // Add closing div exactly at the end of the file
    content = content.replace(/<\/div>\n\s*\);\n\};$/m, "        </div>\n    </div>\n    );\n};");
} else {
    // If it's already there but the closing is messed up, let's fix the end of the file
    const endFix = /<\/div>\n\s*\);\n\};\n*\z/m;
    content = content.replace(/<\/div>\n\s*\);\n\};\s*$/m, "        </div>\n    </div>\n    );\n};");
}

fs.writeFileSync(file, content);
console.log('Fixed syntax errors');
