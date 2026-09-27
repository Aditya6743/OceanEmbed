const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Better gap spacing for the container
content = content.replace(
  /<div className="flex flex-nowrap gap-1\.5 sm:gap-2 mt-auto mb-1">/g,
  '<div className="flex flex-nowrap justify-end gap-2.5 sm:gap-3 mt-auto mb-1 w-full">'
);

// 2. Normalize the Maximize button padding for mobile so it doesn't look awkwardly wide
content = content.replace(
  /className=\{`relative px-5 py-2\.5 rounded-full/g,
  'className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full'
);

// 3. Normalize the X (clear) button padding for mobile
content = content.replace(
  /className="px-3 py-2 bg-white\/5 hover:bg-white\/10 disabled:opacity-50/g,
  'className="px-2.5 sm:px-3 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50'
);

// 4. Give the Export button a bit more breathing room so it doesn't look like a tiny dot
content = content.replace(
  /className="h-9 px-2 sm:px-3 bg-cyan-950\/40 hover:bg-cyan-900 border border-cyan-500\/30/g,
  'className="h-9 px-2.5 sm:px-3 bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-500/30'
);

// 5. Ensure the intelligence report button has balanced padding
content = content.replace(
  /className="h-9 px-2 sm:px-3 bg-cyan-600 hover:bg-cyan-500 shadow-\[0_0_15px_rgba\(34,211,238,0\.3\)\]/g,
  'className="h-9 px-2.5 sm:px-3 bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
);

fs.writeFileSync(file, content);
console.log('Fixed button spacing and proportions.');
