const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="relative md:absolute bottom-0 md:bottom-10 left-0 md:left-8 right-0 md:right-12 flex flex-row justify-between items-end gap-2 md:gap-0 pointer-events-none w-full md:w-auto px-2 md:px-0 py-2 md:py-0"',
  'className="absolute bottom-0 md:bottom-10 left-0 md:left-8 right-0 md:right-12 flex flex-row justify-between items-end gap-1 md:gap-0 pointer-events-none w-full md:w-auto px-2 md:px-0 py-2 md:py-0"'
);

fs.writeFileSync(file, content);
console.log('Restored absolute positioning so it anchors to the bottom of the globe container');
