const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the container (stack them on mobile)
content = content.replace(
  'className="absolute bottom-10 left-8 right-12 flex justify-between items-end pointer-events-none"',
  'className="absolute bottom-2 md:bottom-10 left-2 md:left-8 right-2 md:right-12 flex flex-col md:flex-row justify-end md:justify-between items-center md:items-end gap-2 md:gap-0 pointer-events-none"'
);

// 2. Fix the widths and paddings of both boxes
// Box 1 (Marine Pager)
content = content.replace(
  'className={`w-72 min-h-[155px]',
  'className={`w-full md:w-72 min-h-[auto] md:min-h-[155px]'
);
// Shrink padding
content = content.replace(
  'className="p-4 flex flex-col flex-1 justify-center gap-3 font-mono"',
  'className="p-2 md:p-4 flex flex-col flex-1 justify-center gap-1.5 md:gap-3 font-mono"'
);
content = content.replace(
  '<div className="text-red-400 text-center text-xs py-8">',
  '<div className="text-red-400 text-center text-xs py-4 md:py-8">'
);

// Box 2 (Coastal Warning Station)
content = content.replace(
  'className={`w-72 min-h-[155px]',
  'className={`w-full md:w-72 min-h-[auto] md:min-h-[155px]'
);
// Shrink padding
content = content.replace(
  'className="p-4 flex flex-col flex-1 justify-center gap-3 font-mono"',
  'className="p-2 md:p-4 flex flex-col flex-1 justify-center gap-1.5 md:gap-3 font-mono"'
);

// 3. Make text slightly smaller on mobile to ensure it fits perfectly
// Marine Pager top row
content = content.replace(
  'className={`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b',
  'className={`p-1.5 md:p-2 text-[8px] md:text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b'
);
// Coastal Siren top row
content = content.replace(
  'className={`p-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b',
  'className={`p-1.5 md:p-2 text-[8px] md:text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b'
);

fs.writeFileSync(file, content);
console.log('Patched IotBeaconsPanel.tsx overlays for mobile.');
