const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /setTimeout\(\(\) => setLoadingStep\(1\), 100\),/g,
  "setTimeout(() => setLoadingStep(1), 200),"
);
content = content.replace(
  /setTimeout\(\(\) => setLoadingStep\(2\), 300\),/g,
  "setTimeout(() => setLoadingStep(2), 600),"
);
content = content.replace(
  /setTimeout\(\(\) => setLoadingStep\(3\), 500\)/g,
  "setTimeout(() => setLoadingStep(3), 1000)"
);
content = content.replace(
  /\}, 600\); \/\/ 600ms cinematic loading delay/g,
  "}, 1300); // 1300ms cinematic loading delay"
);

fs.writeFileSync(file, content);
console.log('Tripled loading time');
