const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure ArrowLeft is imported
content = content.replace(/import \{ AlertTriangle, ShieldAlert, CheckCircle2, Bell, RadioReceiver, Activity, Wifi \} from 'lucide-react';/, "import { AlertTriangle, ShieldAlert, CheckCircle2, Bell, RadioReceiver, Activity, Wifi, ArrowLeft } from 'lucide-react';");

// 1. Update Props
content = content.replace(
  /export const IotRightView = \(\{ simState, handleIotAck \}: \{ simState: 'idle' | 'running' | 'complete', handleIotAck: \(\) => void \}\) => \{/,
  "export const IotRightView = ({ simState, handleIotAck, onClose }: any) => {"
);
content = content.replace(
  /export const IotRightView = \(\{ simState, handleIotAck \}: any\) => \{/,
  "export const IotRightView = ({ simState, handleIotAck, onClose }: any) => {"
);

// 2. Wrap return (the exact string in the file for IotRightView)
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

content = content.replace(returnRegex, replacement);

// We need to add ONE closing </div> exactly before the final `);` of IotRightView.
// In the original file, it ends with:
//         </div>
//     );
// };
content = content.replace(
  /        <\/div>\n    \);\n\};/g,
  "        </div>\n    </div>\n    );\n};"
);

// Also fix the IoT Panel IoT BEACONS heading color (since I reset the file)
content = content.replace(
  /<h2 className="text-xl font-black tracking-widest uppercase text-white">IoT Beacons<\/h2>/,
  '<h2 className="text-cyan-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Radio size={20}/> IOT BEACONS</h2>'
);
if (!content.includes('Radio')) {
   content = content.replace(/ArrowLeft \} from 'lucide-react';/, "ArrowLeft, Radio } from 'lucide-react';");
}

fs.writeFileSync(file, content);
console.log('Clean patched IotRightView');
