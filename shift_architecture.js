const fs = require('fs');
let file = 'frontend/src/components/landing/ArchitectureSection.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original div didn't have w-full so justify-between wasn't spreading out across the screen
const oldDiv = '<div className="relative z-20 flex flex-col md:flex-row md:justify-between px-6 md:px-24 pt-24 gap-8">';
const newDiv = '<div className="relative z-20 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row md:justify-between px-6 md:px-16 pt-24 gap-8">';

content = content.replace(oldDiv, newDiv);

fs.writeFileSync(file, content);
console.log('Architecture header shifted outward!');
