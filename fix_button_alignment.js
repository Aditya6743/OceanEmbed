const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Center the right-side header section on mobile, right-align on desktop
content = content.replace(
  /<div className="flex flex-col items-end gap-2 shrink-0">/g,
  '<div className="flex flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto">'
);

// 2. Center the button row on mobile, right-align on desktop
content = content.replace(
  /<div className="flex flex-nowrap justify-end gap-2\.5 sm:gap-3 mt-auto mb-1 w-full">/g,
  '<div className="flex flex-nowrap justify-center md:justify-end gap-2.5 sm:gap-3 mt-auto mb-1 w-full">'
);

fs.writeFileSync(file, content);
console.log('Centered buttons on mobile.');
