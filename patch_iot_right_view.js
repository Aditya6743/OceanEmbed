const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure ArrowLeft is imported
if (!content.includes('ArrowLeft')) {
  content = content.replace(/import \{ AlertTriangle, ShieldAlert, CheckCircle2, Bell, RadioReceiver, Activity, Wifi, Radio \} from 'lucide-react';/, "import { AlertTriangle, ShieldAlert, CheckCircle2, Bell, RadioReceiver, Activity, Wifi, Radio, ArrowLeft } from 'lucide-react';");
}

// 1. Update Props
content = content.replace(
  /export const IotRightView = \(\{ simState, handleIotAck \}: any\) => \{/,
  "export const IotRightView = ({ simState, handleIotAck, onClose }: any) => {"
);

// 2. Wrap return and add Back button
const returnRegex = /return \(\n\s*<div className="w-full h-full bg-slate-900 relative">/;
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
      <div className="w-full h-full bg-slate-900 relative">`;
content = content.replace(returnRegex, replacement);

// Close the wrapper at the end
content = content.replace(
  /<\/MapContainer>\n\s*<\/div>\n\s*\);\n\};/g,
  "    </MapContainer>\n            </div>\n        </div>\n    );\n};"
);

fs.writeFileSync(file, content);
console.log('Patched IotRightView');
