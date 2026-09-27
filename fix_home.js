const fs = require('fs');
const file = 'frontend/src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix H1 sizes on mobile
content = content.replace(/text-5xl md:text-7xl lg:text-\[80px\]/g, 'text-4xl md:text-7xl lg:text-[80px]');
// Ensure the left aligned block has margin top on mobile so navbar doesn't cover it
content = content.replace(/<div className="w-full max-w-\[520px\] flex flex-col pointer-events-auto">/g, '<div className="w-full max-w-[520px] flex flex-col pointer-events-auto mt-16 md:mt-0">');

fs.writeFileSync(file, content);
console.log('Fixed home text size and padding.');
