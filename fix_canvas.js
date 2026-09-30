const fs = require('fs');

const files = [
  'frontend/src/components/Ocean3D.tsx',
  'frontend/src/pages/Explore.tsx',
  'frontend/src/pages/Home.tsx',
  'frontend/src/pages/Solutions.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Remove eventSource entirely from Canvas tags
  content = content.replace(/ eventSource=\{[^}]+\}/g, '');
  fs.writeFileSync(file, content);
  console.log('Removed eventSource from ' + file);
});
