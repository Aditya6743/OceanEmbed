const fs = require('fs');

// 1. IOT Beacons
let iotFile = 'frontend/src/components/IotBeaconsPanel.tsx';
let iotContent = fs.readFileSync(iotFile, 'utf8');

// Ensure Radio icon is imported
if (!iotContent.includes('Radio')) {
  iotContent = iotContent.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Radio} from 'lucide-react';");
}

iotContent = iotContent.replace(
  /<h2 className="text-xl font-black tracking-widest uppercase text-cyan-400 drop-shadow-\[0_0_10px_rgba\(34,211,238,0\.5\)\]">IoT Beacons<\/h2>/,
  '<h2 className="text-cyan-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Radio size={20}/> IOT BEACONS</h2>'
);
fs.writeFileSync(iotFile, iotContent);

// 2. Routing & SAR
let sarFile = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let sarContent = fs.readFileSync(sarFile, 'utf8');

// Ensure Navigation icon is imported
if (!sarContent.includes('Navigation')) {
  sarContent = sarContent.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Navigation} from 'lucide-react';");
}

sarContent = sarContent.replace(
  /<h1 className="text-3xl font-black tracking-widest uppercase text-indigo-400 drop-shadow-\[0_0_10px_rgba\(99,102,241,0\.5\)\] mb-2">\n\s*Routing & SAR\n\s*<\/h1>/,
  '<h2 className="text-indigo-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Navigation size={20}/> ROUTING & SAR</h2>'
);

fs.writeFileSync(sarFile, sarContent);
console.log('Unified heading styles');
