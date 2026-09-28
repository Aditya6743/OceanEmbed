const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Remove unused displayDate
const oldDisplayDate = 'const displayDate = `${d.getDate()} ${months[d.getMonth()]}`;';
content = content.replace(oldDisplayDate, '');

// Fix 2: Add type annotation to offset
const oldNoise = 'const noise = (offset, scale = 1.0) => (rnd(offset) + rnd(offset + 100) + rnd(offset + 200) - 1.5) * scale;';
const newNoise = 'const noise = (offset: number, scale = 1.0) => (rnd(offset) + rnd(offset + 100) + rnd(offset + 200) - 1.5) * scale;';
content = content.replace(oldNoise, newNoise);

fs.writeFileSync(file, content);
console.log('Fixed TypeScript errors');
