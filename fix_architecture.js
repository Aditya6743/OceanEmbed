const fs = require('fs');
let file = 'frontend/src/components/landing/ArchitectureSection.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `<text x={cx1} y={cy1 + 205} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">SST · SSS · SSH · U · V</text>`;

const newStr = `<text x={cx1} y={cy1 + 205} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">SST · SSS · SSH · U · V</text>
            <text x={cx1} y={cy1 + 225} textAnchor="middle" fill="rgba(22,163,74,0.6)" fontSize="8" fontFamily="monospace" letterSpacing="1">SOURCE: COPERNICUS MARINE DATA</text>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log('Added data source to Architecture section');
