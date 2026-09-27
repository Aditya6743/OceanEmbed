const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block to extract
const blockStart = `      {/* UNIFIED CONCEPT */}`;
const blockEnd = `      {/* MARITIME ROUTING MODE */}`;
const startIndex = content.indexOf(blockStart);
const endIndex = content.indexOf(blockEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find block bounds");
    process.exit(1);
}

// Extract the block
const blockToMove = content.slice(startIndex, endIndex);

// Remove the block from its original position
let newContent = content.slice(0, startIndex) + content.slice(endIndex);

// Find where to insert it: before {/* DATA & AI EXPLANATION */}
const insertTarget = `      {/* DATA & AI EXPLANATION */}`;
const insertIndex = newContent.indexOf(insertTarget);

if (insertIndex === -1) {
    console.error("Could not find insert target");
    process.exit(1);
}

// Insert the block
newContent = newContent.slice(0, insertIndex) + blockToMove + newContent.slice(insertIndex);

fs.writeFileSync(file, newContent);
console.log("Moved UNIFIED CONCEPT block down.");
