const fs = require('fs');

// Fix Ocean3D
let f1 = 'frontend/src/components/Ocean3D.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace('eventSource={containerRef}', 'eventSource={containerRef as any}');
fs.writeFileSync(f1, c1);

// Fix Home
let f2 = 'frontend/src/pages/Home.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
c2 = c2.replace('eventSource={canvasContainerRef}', 'eventSource={canvasContainerRef as any}');
fs.writeFileSync(f2, c2);

// Fix Explore
let f3 = 'frontend/src/pages/Explore.tsx';
let c3 = fs.readFileSync(f3, 'utf8');
c3 = c3.replace('eventSource={earthContainerRef}', 'eventSource={earthContainerRef as any}');
fs.writeFileSync(f3, c3);

// Fix Solutions
let f4 = 'frontend/src/pages/Solutions.tsx';
let c4 = fs.readFileSync(f4, 'utf8');
c4 = c4.replace('eventSource={solutionsContainerRef}', 'eventSource={document.getElementById("root") as any}');
fs.writeFileSync(f4, c4);

// Fix Architecture
let f5 = 'frontend/src/pages/Architecture.tsx';
let c5 = fs.readFileSync(f5, 'utf8');
c5 = c5.replace('eventSource={archContainerRef}', 'eventSource={archContainerRef as any}');
fs.writeFileSync(f5, c5);

console.log('Fixed TS errors');
