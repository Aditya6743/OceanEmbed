const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = '          {/* DRIFT WORKFLOW */}';
const endStr = '          </div>\n\n          <div className="bg-black/60 border border-rose-500/30 rounded-xl p-5 relative overflow-hidden mb-6';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find bounds");
    process.exit(1);
}

// Keep the end block starting div
let newContent = content.slice(0, startIndex) + content.slice(endIndex + 17); // 17 is length of '          </div>\n\n'

fs.writeFileSync(file, newContent);
console.log('Removed Drift Workflow box');
