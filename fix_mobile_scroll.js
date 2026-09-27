const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix parent layout to allow scrolling on mobile, but keep h-screen on desktop
content = content.replace(
  /<div className="w-full h-screen bg-transparent flex flex-col md:flex-row pt-14 selection:bg-cyan-500\/30 font-sans overflow-hidden">/g,
  '<div className="w-full min-h-screen md:h-screen bg-transparent flex flex-col md:flex-row pt-14 selection:bg-cyan-500/30 font-sans md:overflow-hidden">'
);

// 2. Fix Globe panel to not be sticky on mobile, allowing it to scroll away
content = content.replace(
  /h-\[50vh\] md:h-\[calc\(100vh-3\.5rem\)\] sticky top-14 relative/g,
  'h-[45vh] md:h-[calc(100vh-3.5rem)] relative'
);

// 3. Fix Stats panel to allow its contents to dictate height on mobile
content = content.replace(
  /className=\{`w-full \$\{isMaximized \? 'md:w-full' : 'md:w-1\/2'\} h-full bg-transparent relative p-4 flex flex-col overflow-hidden`\}/g,
  "className={`w-full ${isMaximized ? 'md:w-full' : 'md:w-1/2'} min-h-[80vh] md:h-full bg-transparent relative p-4 flex flex-col overflow-visible md:overflow-hidden`}"
);

fs.writeFileSync(file, content);
console.log('Fixed mobile layout to allow scrolling.');
