const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// Give the history chart a minimum height on mobile
content = content.replace(
  /<div className="flex-1 min-h-0 -ml-3 flex items-center justify-center">/g,
  '<div className="flex-1 min-h-[120px] xl:min-h-0 -ml-3 flex items-center justify-center">'
);

// Give the Temperature vs Depth chart a minimum height on mobile
content = content.replace(
  /<div className="flex-1 min-h-0">\s*<TemperatureChart/g,
  '<div className="flex-1 min-h-[250px] xl:min-h-0">\n                      <TemperatureChart'
);

fs.writeFileSync(file, content);
console.log('Fixed chart minimum heights for mobile.');
