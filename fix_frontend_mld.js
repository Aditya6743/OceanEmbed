const fs = require('fs');
let file = 'frontend/src/lib/api.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the fallback MLD generation
const regex = /let finalMLD = 75 \+ rnd\(100\) \* 125;\n\s*if \(rnd\(200\) > 0\.90\) \{ finalMLD = 220 \+ rnd\(300\) \* 80; \} \/\/ Rare 10% chance for 220-300\n\s*const mld = Math\.round\(finalMLD\);/;
const replacement = `let finalMLD = 75 + rnd(100) * 125;\n    const mld = Math.round(Math.max(75, Math.min(200, finalMLD)));`;
content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log('Fixed frontend MLD limits');
