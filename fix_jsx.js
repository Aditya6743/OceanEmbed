const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\n\s*<Thermometer size=\{14\} className="text-amber-400" \/> Thermal Risk Awareness\n\s*<\/h3>/,
  ""
);

fs.writeFileSync(file, content);
console.log('Fixed JSX tags');
