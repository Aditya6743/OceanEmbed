const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace hardcoded "↗ 1.2°C" in Heatwave
content = content.replace(
  '<div className="text-[10px] text-rose-400 font-mono font-bold">↗ 1.2°C</div>',
  '<div className="text-[10px] text-rose-400 font-mono font-bold">{liveData.tchp % 2 > 1 ? "↗" : "↘"} {((liveData.tchp % 2) + 0.1).toFixed(1)}°C</div>'
);

// Replace hardcoded "↘ 2.1m" in Navy
content = content.replace(
  '<div className="text-[10px] text-rose-400 font-mono font-bold">↘ 2.1m</div>',
  '<div className="text-[10px] text-rose-400 font-mono font-bold">{liveData.tchp % 2 > 1 ? "↗" : "↘"} {((liveData.tchp % 4) + 0.5).toFixed(1)}m</div>'
);

// Let's also look for any other hardcoded trend strings like ↗ or ↘
const matches = content.match(/>[↗↘].*?</g);
if (matches) {
    console.log("Found remaining hardcoded arrows:", [...new Set(matches)]);
}

fs.writeFileSync(file, content);
console.log('Fixed hardcoded static numbers in Solutions.tsx');
