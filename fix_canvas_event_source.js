const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div className="w-full h-full relative">',
  '<div id="solutions-canvas-container" className="w-full h-full relative">'
);

content = content.replace(
  'eventSource={document.getElementById("root") as any}',
  'eventSource={document.getElementById("solutions-canvas-container") as any}'
);

fs.writeFileSync(file, content);
console.log('Fixed Canvas eventSource to use local container.');
