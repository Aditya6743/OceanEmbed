const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /setTimeout\(\(\) => setLoadingStep\(1\), 50\),/g,
  "setTimeout(() => setLoadingStep(1), 100),"
);
content = content.replace(
  /setTimeout\(\(\) => setLoadingStep\(2\), 150\),/g,
  "setTimeout(() => setLoadingStep(2), 300),"
);
content = content.replace(
  /setTimeout\(\(\) => setLoadingStep\(3\), 250\)/g,
  "setTimeout(() => setLoadingStep(3), 500)"
);
content = content.replace(
  /\}, 300\); \/\/ Blazing fast 300ms cinematic loading delay/g,
  "}, 600); // 600ms cinematic loading delay"
);

fs.writeFileSync(file, content);
console.log('Doubled loading time');
