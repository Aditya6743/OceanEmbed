const fs = require('fs');

// 1. Solutions.tsx: Change 2D Tactical Button Styling
let fileSolutions = 'frontend/src/pages/Solutions.tsx';
let cSolutions = fs.readFileSync(fileSolutions, 'utf8');

cSolutions = cSolutions.replace(
  /className="flex items-center gap-2 bg-indigo-600\/80 hover:bg-indigo-500 border border-indigo-400\/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-\[0_0_15px_rgba\(79,70,229,0\.3\)\] transition-all"/g,
  'className="flex items-center gap-2 bg-black/60 hover:bg-black/80 border border-white/10 hover:border-indigo-500/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all"'
);
cSolutions = cSolutions.replace(
  /<span className="text-\[9px\] font-mono tracking-widest font-bold text-white">/g,
  '<span className="text-[9px] font-mono tracking-widest font-bold text-indigo-300">'
);
fs.writeFileSync(fileSolutions, cSolutions);


// 2. RoutingSar2DMap.tsx: Fix Back to 3D button pointer events
let fileRoutingMap = 'frontend/src/components/RoutingSar2DMap.tsx';
let cRoutingMap = fs.readFileSync(fileRoutingMap, 'utf8');
cRoutingMap = cRoutingMap.replace(
  /className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg"/g,
  'className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg pointer-events-auto"'
);
// Also elevate the top bar z-index just in case
cRoutingMap = cRoutingMap.replace(
  /<div className="absolute top-6 right-6 z-\[400\] flex gap-3">/g,
  '<div className="absolute top-6 right-6 z-[1000] flex gap-3 pointer-events-none">'
);
// The tactical link active indicator
cRoutingMap = cRoutingMap.replace(
  /<div className="bg-black\/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white\/10 flex items-center gap-2">/g,
  '<div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 pointer-events-auto">'
);
fs.writeFileSync(fileRoutingMap, cRoutingMap);


// 3. IotBeaconsPanel.tsx: Do the exact same z-index / pointer events fix
let fileIotMap = 'frontend/src/components/IotBeaconsPanel.tsx';
let cIotMap = fs.readFileSync(fileIotMap, 'utf8');
cIotMap = cIotMap.replace(
  /<div className="absolute top-6 right-6 z-\[400\] flex gap-3">/g,
  '<div className="absolute top-6 right-6 z-[1000] flex gap-3 pointer-events-none">'
);
cIotMap = cIotMap.replace(
  /<div className="bg-black\/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white\/10 flex items-center gap-2">/g,
  '<div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 pointer-events-auto">'
);
fs.writeFileSync(fileIotMap, cIotMap);

console.log('Fixed 2D buttons and styling');
