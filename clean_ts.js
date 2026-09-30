const fs = require('fs');

// RoutingSarLeftPanel
let r = fs.readFileSync('frontend/src/components/RoutingSarLeftPanel.tsx', 'utf8');
r = r.replace(/const { selectedLocation, selectedDate, prediction } = useOceanStore\(\);/g, 'const { selectedLocation } = useOceanStore();');
r = r.replace(/const displayDate.*\n/g, '');
r = r.replace(/const displayLat.*\n/g, '');
r = r.replace(/const displayLon.*\n/g, '');
r = r.replace(/<div className="flex justify-center items-center gap-4 mb-2 text-\[10px\] font-mono text-cyan-400 bg-cyan-950\/30 py-1.5 rounded-lg border border-cyan-500\/20">[\s\S]*?<\/div>/g, '');
fs.writeFileSync('frontend/src/components/RoutingSarLeftPanel.tsx', r);

// IotBeaconsPanel
let i = fs.readFileSync('frontend/src/components/IotBeaconsPanel.tsx', 'utf8');
i = i.replace(/const displayDate.*\n/g, '');
i = i.replace(/const displayLat.*\n/g, '');
i = i.replace(/const displayLon.*\n/g, '');
i = i.replace(/const b3.*\n/g, '');
i = i.replace(/<div className="flex justify-center items-center gap-4 mb-4 text-\[10px\] font-mono text-cyan-400 bg-cyan-950\/30 py-1.5 rounded-lg border border-cyan-500\/20">[\s\S]*?<\/div>/g, '');
fs.writeFileSync('frontend/src/components/IotBeaconsPanel.tsx', i);

