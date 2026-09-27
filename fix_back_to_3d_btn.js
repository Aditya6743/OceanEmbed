const fs = require('fs');

const targetClasses = 'className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg pointer-events-auto"';
const newClasses = 'className="bg-black/60 hover:bg-black/80 border border-white/10 hover:border-indigo-500/50 text-indigo-300 px-4 py-2 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg pointer-events-auto"';

// 1. RoutingSar2DMap.tsx
let fileRoutingMap = 'frontend/src/components/RoutingSar2DMap.tsx';
let cRoutingMap = fs.readFileSync(fileRoutingMap, 'utf8');
cRoutingMap = cRoutingMap.replace(targetClasses, newClasses);
fs.writeFileSync(fileRoutingMap, cRoutingMap);

// 2. IotBeaconsPanel.tsx
let fileIotMap = 'frontend/src/components/IotBeaconsPanel.tsx';
let cIotMap = fs.readFileSync(fileIotMap, 'utf8');
cIotMap = cIotMap.replace(targetClasses, newClasses);
fs.writeFileSync(fileIotMap, cIotMap);

console.log('Fixed Back to 3D Buttons Styling');
