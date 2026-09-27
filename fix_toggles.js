const fs = require('fs');
const file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Restore Lock Auto-Rotate Button
content = content.replace(
  /\{\/\* Lock Auto-Rotate Button \*\/\}\s*\{activeTab !== 'iot' && activeTab !== 'sar' && \(/,
  "{/* Lock Auto-Rotate Button */}\n        {activeTab !== 'iot' && ("
);

// Restore ARGO HUD Overlay
content = content.replace(
  /\{\/\* ARGO HUD Overlay \*\/\}\s*\{activeTab !== 'iot' && activeTab !== 'sar' && \(/,
  "{/* ARGO HUD Overlay */}\n        {activeTab !== 'iot' && ("
);

fs.writeFileSync(file, content);
console.log('Restored toggles');
