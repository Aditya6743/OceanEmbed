const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="absolute top-24 left-6 z-20 pointer-events-auto',
  'className="absolute top-[120px] md:top-24 left-4 md:left-6 z-20 pointer-events-auto'
);

content = content.replace(
  'className="absolute top-24 right-6 z-20 pointer-events-auto',
  'className="absolute top-[120px] md:top-24 right-4 md:right-6 z-20 pointer-events-auto'
);

fs.writeFileSync(file, content);
console.log('Fixed button offsets in Solutions.tsx');
