const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#030712_100%)] z-10" />';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, '');
    fs.writeFileSync(file, content);
    console.log('Removed vignette from Explore.tsx');
} else {
    console.log('Could not find vignette string.');
}
