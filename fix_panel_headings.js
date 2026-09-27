const fs = require('fs');

// 1. Update IoT Beacons
let iotFile = 'frontend/src/components/IotBeaconsPanel.tsx';
let iotContent = fs.readFileSync(iotFile, 'utf8');
iotContent = iotContent.replace(
  /<h2 className="text-xl font-black tracking-widest uppercase text-white">IoT Beacons<\/h2>/g,
  '<h2 className="text-xl font-black tracking-widest uppercase text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">IoT Beacons</h2>'
);
fs.writeFileSync(iotFile, iotContent);

// 2. Update Routing & SAR
let sarFile = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let sarContent = fs.readFileSync(sarFile, 'utf8');
sarContent = sarContent.replace(
  /<h1 className="text-3xl font-black tracking-widest uppercase text-white mb-2">\s*Routing & <span className="text-cyan-400">SAR<\/span>\s*<\/h1>/g,
  '<h1 className="text-3xl font-black tracking-widest uppercase text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] mb-2">\n          Routing & SAR\n        </h1>'
);
sarContent = sarContent.replace(
  /text-cyan-300\/80/g,
  'text-indigo-300/80'
);
fs.writeFileSync(sarFile, sarContent);

console.log('Fixed panel headings');
