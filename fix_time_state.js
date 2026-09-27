const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add setSimState('complete') to the +1H row buttons
content = content.replace(
  /onClick=\{\(\) => setSarTimeHour\(h\)\}/g,
  "onClick={() => { setSarTimeHour(h); setSimState('complete'); onInteract(); }}"
);

// Add setSimState('complete') to Expand Area button
content = content.replace(
  /setSarTimeHour\(next\);\n\s*onInteract\(\);/g,
  "setSarTimeHour(next);\n                      setSimState('complete');\n                      onInteract();"
);

fs.writeFileSync(file, content);
console.log('Fixed time state forcing');
