const fs = require('fs');
const file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the TemperatureChart wrapper
content = content.replace(
  /<div className="flex-1 min-h-\[250px\] xl:min-h-0">/g,
  '<div className="h-[400px] xl:h-full xl:flex-1 w-full mt-4">'
);

// Let's also do the same for HistoryChart to be safe
content = content.replace(
  /<div className="flex-1 min-h-\[120px\] xl:min-h-0 -ml-3 flex items-center justify-center">/g,
  '<div className="h-[200px] xl:h-full xl:flex-1 -ml-3 mt-4 flex items-center justify-center w-[105%]">'
);

fs.writeFileSync(file, content);
console.log('Fixed chart strict heights to render responsive containers properly.');
