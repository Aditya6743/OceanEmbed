const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Header Text Size on Mobile
content = content.replace(
  '<h1 className="text-xl font-black tracking-widest uppercase text-white whitespace-nowrap">',
  '<h1 className="text-sm md:text-xl font-black tracking-widest uppercase text-white whitespace-nowrap">'
);
content = content.replace(
  '<p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">',
  '<p className="text-slate-400 text-[8px] md:text-[10px] uppercase tracking-widest mt-0.5 md:mt-1">'
);

// 2. Fix Main Container (Make it scrollable on mobile, flex-col-reverse so Globe is top)
content = content.replace(
  'className="w-full h-[100dvh] bg-transparent flex flex-col md:flex-row font-sans text-slate-300 overflow-hidden relative"',
  'className="w-full min-h-[100dvh] md:h-[100dvh] h-auto bg-transparent flex flex-col-reverse md:flex-row font-sans text-slate-300 overflow-y-auto overflow-x-hidden md:overflow-hidden relative"'
);

// 3. Fix Dashboard Panel (Left Panel)
// Make it auto height on mobile, solid background, smaller padding top.
content = content.replace(
  'className={`h-full bg-transparent border-r border-white/10 pt-[120px] md:pt-24 px-8 pb-4 z-10 overflow-y-auto overflow-x-hidden shadow-2xl relative custom-scrollbar pointer-events-auto transition-all duration-300',
  'className={`h-auto md:h-full min-h-[50vh] bg-[#050b14] md:bg-transparent border-t md:border-t-0 md:border-r border-white/10 pt-8 md:pt-24 px-4 md:px-8 pb-12 md:pb-4 z-10 md:overflow-y-auto overflow-x-hidden shadow-2xl relative md:custom-scrollbar pointer-events-auto transition-all duration-300'
);

// 4. Fix Globe Panel (Right Panel)
// Give it 55vh on mobile so it fits nicely under the header and leaves room for the dashboard below.
content = content.replace(
  'className={`h-full pt-[110px] md:pt-20 relative z-0 bg-black transition-all duration-300',
  'className={`h-[55vh] md:h-full pt-[110px] md:pt-20 shrink-0 relative z-0 bg-black transition-all duration-300'
);

// 5. Shrink Date Picker box slightly on mobile to prevent overflow
content = content.replace(
  'className="bg-transparent text-cyan-100 font-mono text-xs py-1.5 pl-9 pr-3',
  'className="bg-transparent text-cyan-100 font-mono text-[10px] md:text-xs py-1.5 pl-8 md:pl-9 pr-2 md:pr-3'
);

fs.writeFileSync(file, content);
console.log('Mobile layout completely redesigned in Solutions.tsx');
