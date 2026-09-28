const fs = require('fs');
let file = 'src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];", "");

fs.writeFileSync(file, content);
console.log('Fixed final TypeScript error');
