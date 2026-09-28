const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'z-20 absolute top-0 w-full',
  'z-50 sticky md:absolute top-0 w-full'
);

fs.writeFileSync(file, content);
console.log('Made navbar sticky on mobile');
