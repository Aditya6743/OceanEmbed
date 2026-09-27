const fs = require('fs');
let fileMap = 'frontend/src/components/RoutingSar2DMap.tsx';
let cMap = fs.readFileSync(fileMap, 'utf8');

// The tiny black box is definitely the default Leaflet divIcon border/background.
// Let's use `className: ''` to completely disable the leaflet-div-icon base class.
cMap = cMap.replace(/className: 'bg-transparent'/g, "className: ''");
fs.writeFileSync(fileMap, cMap);


let filePanel = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let cPanel = fs.readFileSync(filePanel, 'utf8');

// Now let's fix the alignment that failed silently last time
// We'll use a regex to be more robust
cPanel = cPanel.replace(
  /<div className="flex gap-2">\s*<div className="flex gap-1 mb-4">\s*\{\[1, 3, 6, 12, 24\]\.map\(\(h\) => \(/g,
  '<div className="flex gap-2 items-center">\n                  <div className="flex gap-1">\n                  {[1, 3, 6, 12, 24].map((h) => ('
);

cPanel = cPanel.replace(
  /className=\{`flex-1 py-1\.5 rounded border text-\[9px\] font-bold font-mono transition-all \$\{sarTimeHour === h \?/g,
  'className={`flex-1 py-2 px-1.5 rounded border text-[9px] font-bold font-mono transition-all ${sarTimeHour === h ?'
);

fs.writeFileSync(filePanel, cPanel);

console.log('Fixed Leaflet divIcon tiny background box and Panel alignment');
