const fs = require('fs');
let file = 'frontend/src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Decrease height from 32px (h-8) to 26px (h-[26px]), representing ~20% reduction.
// Also slightly reduce the negative margin on the text (-ml-[11.5px] -> -ml-[8px]) to compensate for the narrower image.
content = content.replace(
    'className="-mt-1.5 ml-2 h-8 w-auto object-contain',
    'className="-mt-1.5 ml-2 h-[26px] w-auto object-contain'
);

content = content.replace(
    'className="-ml-[11.5px] font-semibold text-[15px]',
    'className="-ml-[8px] font-semibold text-[15px]'
);

fs.writeFileSync(file, content);
console.log('Logo resized');
