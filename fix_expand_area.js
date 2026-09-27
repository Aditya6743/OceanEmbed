const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = /<button className="flex-1 bg-white\/10 hover:bg-white\/20 border border-white\/20 text-white rounded py-2 font-mono text-\[9px\] tracking-widest font-bold transition-all">\s*EXPAND AREA\s*<\/button>/g;

const replacement = `<button 
                    onClick={() => {
                      const next = sarTimeHour === 1 ? 3 : sarTimeHour === 3 ? 6 : sarTimeHour === 6 ? 12 : 24;
                      setSarTimeHour(next);
                      onInteract();
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded py-2 font-mono text-[9px] tracking-widest font-bold transition-all"
                  >
                    EXPAND AREA
                  </button>`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Fixed expand area button');
