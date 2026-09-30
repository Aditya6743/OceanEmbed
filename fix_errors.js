const fs = require('fs');
let r = fs.readFileSync('frontend/src/components/RoutingSarLeftPanel.tsx', 'utf8');

// The replacement in RoutingSarLeftPanel failed to replace the actual occurrences if they didn't match perfectly.
// Let's use strict regex.
r = r.replace(/15\.2 SQ NM/g, '{area} SQ NM');
r = r.replace(/NE \(045°\)/g, '{dir}');
r = r.replace(/Radius: 0\.8 NM/g, 'Radius: {r1} NM');
r = r.replace(/Radius: 3\.2 NM/g, 'Radius: {r6} NM');
r = r.replace(/Radius: 15\.2 NM/g, 'Radius: {r24} NM');

fs.writeFileSync('frontend/src/components/RoutingSarLeftPanel.tsx', r);

let i = fs.readFileSync('frontend/src/components/IotBeaconsPanel.tsx', 'utf8');

// IotBeaconsPanel has re-declared variables. Let's remove the old declarations.
i = i.replace('const gateway = [18.92, 72.82]; // Mumbai', '');
i = i.replace('const b1 = [16.0, 68.0];', '');
i = i.replace('const b2 = [12.0, 72.0];', '');
i = i.replace('const b3 = [18.0, 69.0];', '');

// And fix the displayLat in IotLeftPanel. My injection replaced '<div className="text-center mb-6">'
// But maybe IotLeftPanel didn't have that div!
if (!i.includes('{displayLat}')) {
  // Try injecting it below 'export const IotLeftPanel = ... {'
  i = i.replace(
    'export const IotLeftPanel = ({ simState, runSimulation, resetSimulation, iotLogs, toggleMute }: any) => {',
    `export const IotLeftPanel = ({ simState, runSimulation, resetSimulation, iotLogs, toggleMute }: any) => {
    // We already injected the vars before, so let's just make sure they are used.
    `
  );
}
// I will just rewrite the IotBeaconsPanel UI header manually.
i = i.replace(
  '<div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-8 backdrop-blur-sm">',
  `<div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-8 backdrop-blur-sm">
        <div className="flex justify-center items-center gap-4 mb-4 text-[10px] font-mono text-cyan-400 bg-cyan-950/30 py-1.5 rounded-lg border border-cyan-500/20">
             <span>LAT: {displayLat}°</span>
             <span>LON: {displayLon}°</span>
             <span>{displayDate}</span>
        </div>`
);

fs.writeFileSync('frontend/src/components/IotBeaconsPanel.tsx', i);

