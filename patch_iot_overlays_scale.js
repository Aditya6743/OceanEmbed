const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add scaling and origin classes to the bottom row container
content = content.replace(
  'className="absolute bottom-2 md:bottom-10 left-2 md:left-8 right-2 md:right-12 flex flex-col md:flex-row justify-end md:justify-between items-center md:items-end gap-2 md:gap-0 pointer-events-none"',
  'className="absolute bottom-2 md:bottom-10 left-2 md:left-8 right-2 md:right-12 flex flex-col md:flex-row justify-end md:justify-between items-center md:items-end gap-2 md:gap-0 pointer-events-none scale-[0.85] md:scale-100 origin-bottom"'
);

// Ensure widths are tight on mobile
content = content.replace(
  /w-full md:w-72/g,
  'w-[280px] md:w-72'
);

fs.writeFileSync(file, content);
console.log('Scaled down IoT overlay boxes on mobile.');
