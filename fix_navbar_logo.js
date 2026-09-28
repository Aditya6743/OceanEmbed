const fs = require('fs');
let file = 'frontend/src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `<span className="-ml-[8px] font-semibold text-[15px] tracking-[0.15em] uppercase">
              <span className="text-white">OCEAN</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EMBED</span>
            </span>`;

const newStr = `<span className="-ml-[8px] font-black text-[18px] tracking-[0.2em] uppercase text-white mt-[1px]">
              OCEAN<span className="text-cyan-400">EMBED</span>
            </span>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log('Fixed Navbar logo text to match footer!');
