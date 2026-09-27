const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Surface Observations grid for mobile
content = content.replace(
  /<div className="grid grid-cols-7 gap-2\.5 my-auto">/,
  '<div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-2.5 my-auto mt-2 md:mt-auto">'
);

// 2. Hide 3D Volume Block on Mobile
content = content.replace(
  /\{(\/\* ROW 2: VISUALIZATIONS \*\/[\s\S]*?className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0 stagger-2">)\s*<div className={`w-full([^`]+)`}/,
  (match, p1, p2) => {
    return p1 + '\n                  <div className={`hidden xl:flex w-full' + p2 + '`}'
  }
);

fs.writeFileSync(file, content);
console.log('Fixed Explore dashboard responsiveness for mobile.');
