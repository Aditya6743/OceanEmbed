const fs = require('fs');
const file = 'frontend/src/components/landing/ArchitectureSection.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = /\{\/\* SVG Diagram Area \*\/\}.*?<svg viewBox="100 80 1000 460" className="w-full h-auto drop-shadow-2xl">/s;

const replacement = `{/* SVG Diagram Area */}
      <div className="relative w-full max-w-[1400px] mt-10 md:mt-20 z-10 overflow-hidden h-[450px] md:h-auto flex items-center justify-center pb-10">
        <svg viewBox="0 0 1200 600" className="absolute w-[1100px] max-w-[1100px] md:relative md:w-full md:max-w-none h-auto drop-shadow-2xl">`;

content = content.replace(target, replacement);

// There's a </div> at the end of the SVG area that needs to be removed because I removed the inner wrapper div
content = content.replace(/<\/svg>\n        <\/div>\n      <\/div>/, '</svg>\n      </div>');

fs.writeFileSync(file, content);
console.log('Fixed SVG to be fixed and centered on mobile.');
