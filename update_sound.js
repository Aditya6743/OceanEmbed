const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/gain\.gain\.linearRampToValueAtTime\(0\.02, /g, 'gain.gain.linearRampToValueAtTime(0.025, ');
content = content.replace(/gain\.gain\.linearRampToValueAtTime\(0\.05, /g, 'gain.gain.linearRampToValueAtTime(0.0625, ');
content = content.replace(/gain\.gain\.linearRampToValueAtTime\(0\.03, /g, 'gain.gain.linearRampToValueAtTime(0.0375, ');

fs.writeFileSync(file, content);
console.log('Increased UI sound volumes by 25%');
