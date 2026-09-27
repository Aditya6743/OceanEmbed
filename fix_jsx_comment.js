const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\/\* ROW 2: VISUALIZATIONS \*\/\}/, '{/* ROW 2: VISUALIZATIONS */}');

fs.writeFileSync(file, content);
console.log('Fixed JSX comment');
