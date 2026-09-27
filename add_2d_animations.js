const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replaceAll(
    'flex flex-col backdrop-blur-md bg-black/85',
    'flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md bg-black/85'
);

fs.writeFileSync(file, content);
console.log('Added animations to 2D tooltips');
