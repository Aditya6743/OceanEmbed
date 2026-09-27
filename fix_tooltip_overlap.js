const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Shift Tooltips to the right so they don't block vertical clicking
content = content.replaceAll(
    'className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl pointer-events-auto min-w-[150px]"',
    'className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl pointer-events-auto min-w-[150px] translate-x-[60%]"'
);
content = content.replaceAll(
    'className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl pointer-events-auto min-w-[170px]"',
    'className="text-[10px] font-mono bg-black text-white p-2 rounded border border-white/10 shadow-xl pointer-events-auto min-w-[170px] translate-x-[60%]"'
);

// 2. Restore X buttons robustly
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('GATEWAY #01') || lines[i].includes('FISHERMAN VESSEL') || lines[i].includes('TOURIST BOAT')) {
        // The very next line is where we need to inject the button, overriding the empty space
        lines[i] = lines[i] + '\n                                <button onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); }} className="text-white/50 hover:text-white cursor-pointer pointer-events-auto ml-4">✕</button>';
    }
}
content = lines.join('\n');

fs.writeFileSync(file, content);
console.log('Fixed tooltip positioning and X buttons');
