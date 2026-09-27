const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// The main right panel wrapper
const rightPanelRegex = /<div className=\{`w-full md:w-\[60%\] lg:w-\[70%\] xl:w-\[75%\] h-1\/2 md:h-full bg-\[#050505\] flex flex-col p-4 md:p-6 pb-20 md:pb-6 relative z-10/g;
const replacement = '<div className={`w-full md:w-[60%] lg:w-[70%] xl:w-[75%] h-1/2 md:h-full bg-[#050505] flex flex-col p-4 md:p-6 pb-20 md:pb-6 relative z-10 overflow-y-auto overflow-x-hidden custom-scrollbar';
content = content.replace(rightPanelRegex, replacement);

// Make sure the ROW 2 containers have a minimum height on desktop so they don't squish too much and instead trigger scroll
content = content.replace(
  /className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0 stagger-2"/g,
  'className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-[400px] xl:min-h-[500px] stagger-2"'
);

// We should also remove min-h-0 from the parent so it naturally grows and causes scrolling
content = content.replace(
  /className="flex-1 flex flex-col justify-start md:justify-center gap-4 min-h-0 mt-4 md:mt-0"/g,
  'className="flex-1 flex flex-col justify-start md:justify-center gap-4 mt-4 md:mt-0 pb-10"'
);

fs.writeFileSync(file, content);
console.log('Fixed Explore scroll');
