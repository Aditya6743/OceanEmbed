const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change container to be static/relative on mobile (so it sits below the globe), but absolute on desktop.
// Wait, if it sits below the globe on mobile, it should be flex-row so they sit side by side.
content = content.replace(
  'className="absolute bottom-2 md:bottom-10 left-2 md:left-8 right-2 md:right-12 flex flex-col md:flex-row justify-end md:justify-between items-center md:items-end gap-2 md:gap-0 pointer-events-none scale-[0.85] md:scale-100 origin-bottom"',
  'className="relative md:absolute bottom-0 md:bottom-10 left-0 md:left-8 right-0 md:right-12 flex flex-row justify-between items-end gap-2 md:gap-0 pointer-events-none w-full md:w-auto px-2 md:px-0 py-2 md:py-0"'
);

// 2. Adjust widths so they fit side-by-side on mobile
content = content.replace(
  /w-\[280px\] md:w-72/g,
  'w-1/2 md:w-72 scale-[0.95] md:scale-100 origin-bottom'
);

// 3. Make text tighter inside the boxes on mobile so it fits in w-1/2 (which is ~160px on a phone)
content = content.replace(
  /className="text-red-400 text-center text-xs py-4 md:py-8"/g,
  'className="text-red-400 text-center text-[9px] md:text-xs py-4 md:py-8 font-bold"'
);

content = content.replace(
  /className="text-orange-400 font-bold text-sm text-center mb-1 animate-pulse"/g,
  'className="text-orange-400 font-bold text-[9px] md:text-sm text-center mb-1 animate-pulse"'
);

content = content.replace(
  /className="flex justify-between text-slate-300"/g,
  'className="flex justify-between text-slate-300 text-[8px] md:text-xs"'
);

content = content.replace(
  /className="text-\[11px\] text-center text-white bg-red-600\/80 rounded py-1.5 font-sans font-bold tracking-wider border border-red-500\/50"/g,
  'className="text-[8px] md:text-[11px] text-center text-white bg-red-600/80 rounded py-1.5 md:py-1.5 px-1 font-sans font-bold tracking-wider border border-red-500/50"'
);

content = content.replace(
  /className="flex justify-between items-center text-xs"/g,
  'className="flex justify-between items-center text-[8px] md:text-xs"'
);

content = content.replace(
  /className="mt-2 py-2 w-full rounded border border-orange-400 text-orange-400 text-\[10px\] font-bold hover:bg-orange-400 hover:text-black transition-colors pointer-events-auto"/g,
  'className="mt-2 py-1 md:py-2 w-full rounded border border-orange-400 text-orange-400 text-[8px] md:text-[10px] font-bold hover:bg-orange-400 hover:text-black transition-colors pointer-events-auto"'
);

content = content.replace(
  /className="mt-2 py-2 text-center text-emerald-400 text-\[10px\] font-bold border border-emerald-500\/30 bg-emerald-500\/10 rounded flex items-center justify-center gap-1"/g,
  'className="mt-1 md:mt-2 py-1 md:py-2 text-center text-emerald-400 text-[8px] md:text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 rounded flex items-center justify-center gap-1"'
);

// Fix Coastal box contents for w-1/2
content = content.replace(
  /className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm mb-1 animate-pulse"/g,
  'className="flex items-center justify-center gap-1 md:gap-2 text-red-500 font-bold text-[9px] md:text-sm mb-1 animate-pulse"'
);

content = content.replace(
  /className="text-red-400 mb-1"/g,
  'className="text-red-400 mb-1 text-[8px] md:text-xs"'
);

content = content.replace(
  /className="text-\[11px\] text-center text-red-400 border border-red-500\/30 bg-red-500\/10 rounded py-1.5 font-sans font-bold tracking-wider animate-pulse"/g,
  'className="text-[8px] md:text-[11px] text-center text-red-400 border border-red-500/30 bg-red-500/10 rounded py-1 font-sans font-bold tracking-wider animate-pulse"'
);

fs.writeFileSync(file, content);
console.log('Patched IotBeaconsPanel.tsx overlays for strictly side-by-side mobile layout.');
