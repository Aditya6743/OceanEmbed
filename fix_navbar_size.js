const fs = require('fs');
let file = 'frontend/src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '<span className="-ml-[8px] font-black text-[18px] tracking-[0.2em] uppercase text-white mt-[1px]">';
const newStr = '<span className="-ml-[8px] font-black text-[15px] tracking-[0.2em] uppercase text-white mt-[1px]">';

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log('Decreased navbar text size!');
