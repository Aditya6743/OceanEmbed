const fs = require('fs');
let file = 'src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Remove unused displayDate
content = content.replace('const displayDate = `${d.getDate()} ${months[d.getMonth()]}`;', '');

// Fix 2: Add type annotation to offset
content = content.replace('const noise = (offset, scale = 1.0) =>', 'const noise = (offset: number, scale = 1.0) =>');

fs.writeFileSync(file, content);
console.log('Fixed TypeScript errors');
