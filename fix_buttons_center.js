const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Container to items-center
content = content.replace(
    'absolute top-24 right-6 z-20 pointer-events-auto flex flex-col gap-2 items-end',
    'absolute top-24 right-6 z-20 pointer-events-auto flex flex-col gap-2 items-center'
);

// Rotation Button auto-size
content = content.replace(
    'className={`flex items-center justify-between w-[130px] bg-black/60 border px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all ${isRotationLocked',
    'className={`flex items-center gap-2 bg-black/60 border px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all ${isRotationLocked'
);

// 2D Tactical auto-size
content = content.replace(
    'className="flex items-center justify-between w-[130px] bg-black/60 hover:bg-black/80 border border-white/10 hover:border-indigo-500/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all"',
    'className="flex items-center gap-2 bg-black/60 hover:bg-black/80 border border-white/10 hover:border-indigo-500/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all"'
);

fs.writeFileSync(file, content);
console.log('Fixed buttons layout');
