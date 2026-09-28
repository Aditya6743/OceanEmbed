const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="absolute top-24 md:top-16 right-2 md:right-8 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500 scale-[0.75] md:scale-100 origin-top-right z-[50]"',
  'className="absolute top-24 md:top-[200px] right-2 md:right-6 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500 scale-[0.75] md:scale-100 origin-top-right z-[50]"'
);

fs.writeFileSync(file, content);
console.log('Moved the popup down on desktop so it does not overlap the rotation controls.');
