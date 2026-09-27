const fs = require('fs');
const file = 'frontend/src/components/landing/ArchitectureSection.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the SVG Diagram Area div
const target = `{/* SVG Diagram Area */}
      <div className="relative w-full max-w-[1400px] mt-10 md:mt-20 z-10">
        <svg viewBox="0 0 1200 600" className="w-full h-auto drop-shadow-2xl">`;

const replacement = `{/* SVG Diagram Area */}
      <div className="relative w-full max-w-[1400px] mt-10 md:mt-20 z-10 overflow-x-auto overflow-y-hidden md:overflow-visible pb-10 hide-scrollbar scroll-smooth snap-x snap-mandatory">
        <div className="w-[1000px] md:w-full min-w-[1000px] md:min-w-0 mx-auto px-4 md:px-0">
          <svg viewBox="100 80 1000 460" className="w-full h-auto drop-shadow-2xl">`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Fixed architecture SVG responsiveness');
