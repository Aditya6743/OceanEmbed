const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<div className="bg-black\/50 border border-white\/10 rounded px-3 py-2 text-\[11px\] text-rose-200 font-mono">06h 45m<\/div>/,
  '<div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-[11px] text-rose-200 font-mono">{sarTimeHour.toString().padStart(2, "0")}h 00m</div>'
);

fs.writeFileSync(file, content);
console.log('Fixed incident text');
