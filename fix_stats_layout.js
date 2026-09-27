const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Let the inner wrapper grow on mobile
content = content.replace(
  /<div className="relative z-10 flex flex-col gap-3 h-full animate-in fade-in slide-in-from-bottom-8 duration-700 pb-2">/g,
  '<div className="relative z-10 flex flex-col gap-4 flex-1 h-auto md:h-full animate-in fade-in slide-in-from-bottom-8 duration-700 pb-2">'
);

// 2. Ensure header items can wrap and not overlap
content = content.replace(
  /<div className="flex justify-between items-start border-b border-white\/10 pb-2 shrink-0">/g,
  '<div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 gap-4 shrink-0">'
);

// 3. Make the title and date picker stack better on mobile
content = content.replace(
  /<div className="flex items-center gap-3 mt-2">/g,
  '<div className="flex flex-wrap items-center gap-3 mt-2">'
);

// 4. Ensure PREDICTION RESULTS container can grow and space things out
content = content.replace(
  /<div className="flex-1 flex flex-col justify-center gap-3 min-h-0">/g,
  '<div className="flex-1 flex flex-col justify-start md:justify-center gap-4 min-h-0 mt-4 md:mt-0">'
);

// 5. Change min-h-[80vh] to h-auto on mobile for the right panel so it can expand fully
content = content.replace(
  /min-h-\[80vh\] md:h-full bg-transparent/g,
  'h-auto min-h-[100vh] md:h-full bg-transparent'
);

// 6. Ensure the main layout is h-auto on mobile
content = content.replace(
  /w-full min-h-screen md:h-screen bg-transparent flex flex-col md:flex-row pt-14 selection:bg-cyan-500\/30 font-sans md:overflow-hidden/g,
  'w-full h-auto min-h-screen md:h-screen bg-transparent flex flex-col md:flex-row pt-14 selection:bg-cyan-500/30 font-sans md:overflow-hidden'
);


fs.writeFileSync(file, content);
console.log('Fixed Stats Panel overlapping layout for mobile.');
