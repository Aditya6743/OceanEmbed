const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// The current values in the file:
// gain.gain.linearRampToValueAtTime(0.025, now + 0.02);
// gain.gain.linearRampToValueAtTime(0.0625, now + 0.2);
// gain.gain.linearRampToValueAtTime(0.0375, now + 0.05);

content = content.replace(/gain\.gain\.linearRampToValueAtTime\(0\.025, /g, 'gain.gain.linearRampToValueAtTime(0.04, ');
content = content.replace(/gain\.gain\.linearRampToValueAtTime\(0\.0625, /g, 'gain.gain.linearRampToValueAtTime(0.1, ');
content = content.replace(/gain\.gain\.linearRampToValueAtTime\(0\.0375, /g, 'gain.gain.linearRampToValueAtTime(0.06, ');

fs.writeFileSync(file, content);
console.log('Increased UI sound volumes again (now up by ~100% total)');
