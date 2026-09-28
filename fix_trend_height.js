const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = '<div className="h-[200px] xl:h-full xl:flex-1 -ml-3 mt-4 flex items-center justify-center w-[105%]">';
const replacement1 = '<div className="h-[150px] md:h-[120px] xl:h-[150px] -ml-3 mt-2 flex items-center justify-center w-[105%] shrink-0">';

content = content.replace(target1, replacement1);
fs.writeFileSync(file, content);
console.log('Fixed trend chart height!');
