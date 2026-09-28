const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Box 1: Data Source
content = content.replace(
  'p-3 py-6 min-h-[160px]',
  'p-1 py-2 md:p-3 md:py-6 min-h-[60px] md:min-h-[160px]'
);

// 2. Box 2: Core Intelligence
content = content.replace(
  'p-4 py-8 min-h-[220px]',
  'p-1.5 py-3 md:p-4 md:py-8 min-h-[100px] md:min-h-[220px]'
);

// 3. Box 3: Gateway
content = content.replace(
  'p-3 py-6 min-h-[160px]',
  'p-1 py-2 md:p-3 md:py-6 min-h-[60px] md:min-h-[160px]'
);

// 4. Box 4: Endpoints (Pager and Coastal Siren)
// First occurrence (Marine Pager)
content = content.replace(
  /p-3 py-4 min-h-\[72px\]/g,
  'p-1 py-1.5 md:p-3 md:py-4 min-h-[36px] md:min-h-[72px]'
);

// Fix gap between endpoints on mobile
content = content.replace(
  'gap-4 w-full mt-1',
  'gap-1 md:gap-4 w-full mt-1'
);

// Reduce overall min-height of the horizontal layout container on mobile
content = content.replace(
  'p-6 py-12 min-h-[350px]',
  'p-3 py-6 md:p-6 md:py-12 min-h-[200px] md:min-h-[350px]'
);

fs.writeFileSync(file, content);
console.log('Patched IotBeaconsPanel.tsx boxes to be small on mobile.');
