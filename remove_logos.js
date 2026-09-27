const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove left-side logo from Maritime Routing
const routingLogoRegex = /<div className="w-10 h-10 rounded-full bg-cyan-500\/20 flex items-center justify-center border border-cyan-500\/40 shadow-\[0_0_15px_rgba\(34,211,238,0\.2\)\]">\s*<Navigation className="w-5 h-5 text-cyan-400" \/>\s*<\/div>/;
content = content.replace(routingLogoRegex, '');

// 2. Remove left-side logo from SAR
const sarLogoRegex = /<div className="w-10 h-10 rounded-full bg-rose-500\/20 flex items-center justify-center border border-rose-500\/40 shadow-\[0_0_15px_rgba\(244,63,94,0\.2\)\]">\s*<ShieldAlert className="w-5 h-5 text-rose-400" \/>\s*<\/div>/;
content = content.replace(sarLogoRegex, '');

// 3. Remove proactive / reactive icons
const proactiveLogoRegex = /<Navigation className="w-5 h-5 text-cyan-400 mx-auto mb-2" \/>/;
content = content.replace(proactiveLogoRegex, '');

const reactiveLogoRegex = /<ShieldAlert className="w-5 h-5 text-indigo-400 mx-auto mb-2" \/>/;
content = content.replace(reactiveLogoRegex, '');

fs.writeFileSync(file, content);
console.log('Removed logos');
