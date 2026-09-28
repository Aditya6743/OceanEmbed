const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = 'relative bg-transparent border-l border-white/[0.05]';
const newStr = 'relative bg-black border-l border-white/[0.05]';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Fixed Explore Globe Background');
} else {
    console.log('Could not find string in Explore.tsx.');
}
