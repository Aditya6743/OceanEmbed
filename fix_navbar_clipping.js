const fs = require('fs');
const file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<div className="hidden md:flex w-\[65%\] justify-center gap-3 overflow-x-auto no-scrollbar pr-8">/g,
  '<div className="hidden md:flex w-[65%] justify-start 2xl:justify-center gap-3 overflow-x-auto no-scrollbar px-8">'
);

fs.writeFileSync(file, content);
console.log('Fixed clipping on Solutions navbar');
