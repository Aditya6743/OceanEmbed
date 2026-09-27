const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove left-side logo from SAR (LifeBuoy)
const sarLogoRegex = /<div className="w-10 h-10 rounded-full bg-rose-500\/20 flex items-center justify-center border border-rose-500\/40 shadow-\[0_0_15px_rgba\(244,63,94,0\.2\)\]">\s*<LifeBuoy className="w-5 h-5 text-rose-400" \/>\s*<\/div>/;
content = content.replace(sarLogoRegex, '');

// 2. Remove reactive icon (LifeBuoy)
const reactiveLogoRegex = /<LifeBuoy className="w-5 h-5 text-rose-400 mx-auto mb-2" \/>/;
content = content.replace(reactiveLogoRegex, '');

fs.writeFileSync(file, content);
console.log('Removed missed logos');
