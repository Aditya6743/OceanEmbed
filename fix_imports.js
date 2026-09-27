const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove Anchor and Layers from the lucide-react import
content = content.replace(/Anchor, /, '');
content = content.replace(/Layers, /, '');

// Remove the Scan function at the bottom
content = content.replace(/function Scan\(props: any\) \{\n  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" \{\.\.\.props\}><path d="M3 7V5a2 2 0 0 1 2-2h2"\/><path d="M17 3h2a2 2 0 0 1 2 2v2"\/><path d="M21 17v2a2 2 0 0 1-2 2h-2"\/><path d="M7 21H5a2 2 0 0 1-2-2v-2"\/><\/svg>;\n\}/, '');

fs.writeFileSync(file, content);
console.log('Fixed TS unused imports');
