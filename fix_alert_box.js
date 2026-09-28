const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="absolute top-16 right-8 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500"',
  'className="absolute top-24 md:top-16 right-2 md:right-8 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500 scale-[0.75] md:scale-100 origin-top-right z-[50]"'
);

content = content.replace(
  'className="bg-black/90 backdrop-blur-md border border-red-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] min-w-[280px]"',
  'className="bg-black/90 backdrop-blur-md border border-red-500/50 p-3 md:p-4 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] min-w-[220px] md:min-w-[280px]"'
);

fs.writeFileSync(file, content);
console.log('Scaled down and shifted the Critical Alert Dispatched popup.');
