const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// The 3D block has: hidden xl:flex
// We should remove 'hidden xl:flex' and replace it with 'flex' so it always shows!
content = content.replace(
  /className=\{`hidden xl:flex w-full bg-white\/\[0\.02\]/g,
  'className={`flex w-full bg-white/[0.02]'
);

// We should also make sure the grid can accommodate it.
// Right now it's: className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-[400px] xl:min-h-[500px] stagger-2"
// On small screens, both the 3D block and the Temp chart will stack vertically. That's fine! 
// Let's just make sure min-h-[400px] is enough for both to stack, or apply it to the children.
content = content.replace(
  /className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-\[400px\] xl:min-h-\[500px\] stagger-2"/g,
  'className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-[800px] xl:min-h-[500px] stagger-2"'
);

fs.writeFileSync(file, content);
console.log('Fixed Explore responsive 3D block');
