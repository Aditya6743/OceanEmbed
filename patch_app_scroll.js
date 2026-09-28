const fs = require('fs');
let file = 'frontend/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('overflow-x-hidden')) {
  content = content.replace(
    'className="min-h-screen bg-[#030712] text-foreground flex flex-col font-sans relative"',
    'className="min-h-screen w-full overflow-x-hidden bg-[#030712] text-foreground flex flex-col font-sans relative"'
  );
  fs.writeFileSync(file, content);
  console.log('Patched App.tsx with overflow-x-hidden to completely prevent mobile horizontal scroll bugs');
} else {
  console.log('App.tsx already has overflow-x-hidden');
}
