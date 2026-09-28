const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Top Navbar Wrapper
content = content.replace(
  'className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center z-20 absolute top-0 w-full"',
  'className="h-auto md:h-20 py-3 md:py-0 border-b border-white/10 bg-black/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center z-20 absolute top-0 w-full gap-3 md:gap-0"'
);

// 2. Fix Left Section of Top Navbar
content = content.replace(
  'className="w-full md:w-[35%] px-4 md:px-8 flex items-center justify-between md:justify-start gap-4"',
  'className="w-full md:w-[35%] px-4 md:px-8 flex items-center justify-between md:justify-start gap-4 shrink-0"'
);

// 3. Fix Right Section (Tabs) of Top Navbar
content = content.replace(
  'className="hidden md:flex w-[65%] justify-start 2xl:justify-center gap-3 overflow-x-auto no-scrollbar px-8"',
  'className="flex md:flex w-full md:w-[65%] justify-start 2xl:justify-center gap-2 md:gap-3 overflow-x-auto no-scrollbar px-4 md:px-8 shrink-0"'
);

// 4. Update Padding for Left Panel (pt-24 to pt-[120px] md:pt-24)
content = content.replace(
  'className={`h-full bg-transparent border-r border-white/10 pt-24 px-8',
  'className={`h-full bg-transparent border-r border-white/10 pt-[120px] md:pt-24 px-8'
);

// 5. Update Padding for Right Panel (Globe) (pt-20 to pt-[110px] md:pt-20)
content = content.replace(
  'className={`h-full pt-20 relative z-0',
  'className={`h-full pt-[110px] md:pt-20 relative z-0'
);

fs.writeFileSync(file, content);
console.log('Mobile tabs fixed in Solutions.tsx');
