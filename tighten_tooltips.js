const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Tighten Gateway gap and add animation
content = content.replace(
    'pointer-events-none flex flex-col ml-4 -translate-y-1/2 backdrop-blur-md',
    'pointer-events-none flex flex-col ml-2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md'
);

// 2. Tighten Fisherman gap and add animation
content = content.replace(
    'pointer-events-none flex flex-col -ml-4 -translate-x-full -translate-y-1/2 backdrop-blur-md',
    'pointer-events-none flex flex-col -ml-2 -translate-x-full -translate-y-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md'
);

// 3. Add animation to Tourist Boat (already mt-2)
content = content.replace(
    'pointer-events-none flex flex-col mt-2 -translate-x-1/2 backdrop-blur-md',
    'pointer-events-none flex flex-col mt-2 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md'
);

fs.writeFileSync(file, content);
console.log('Tightened gaps and added animations');
