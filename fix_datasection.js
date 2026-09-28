const fs = require('fs');
let file = 'frontend/src/components/landing/DataSection.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix Desktop
const desktopTarget = `                  <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ backgroundColor: item.color }}></div>
                </div>
              ))}
           </div>`;

const desktopNew = `                  <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ backgroundColor: item.color }}></div>
                </div>
              ))}
              <div className="absolute left-0 w-full flex flex-col items-start translate-y-12" style={{ top: '100%' }}>
                 <span className="text-emerald-500/70 font-mono text-[10px] font-bold tracking-[0.15em] leading-relaxed">SOURCE:<br/>COPERNICUS<br/>MARINE DATA</span>
              </div>
           </div>`;

content = content.replace(desktopTarget, desktopNew);

// Fix Mobile
const mobileTarget = `        {/* ================================================== */}
        <div className="flex lg:hidden flex-col items-center gap-16 relative mt-16">
           <div className="flex flex-wrap justify-center gap-4 w-full max-w-sm">
             {['SST', 'SSS', 'SSH', 'CURRENTS', 'WINDS'].map(v => (
               <div key={v} className="px-4 py-2 bg-black/40 border border-white/10 rounded-full"><span className="text-white font-bold font-mono text-xs tracking-widest">{v}</span></div>
             ))}
           </div>`;

const mobileNew = `        {/* ================================================== */}
        <div className="flex lg:hidden flex-col items-center gap-16 relative mt-16">
           <div className="flex flex-col items-center gap-6 w-full max-w-sm">
             <div className="flex flex-wrap justify-center gap-4 w-full">
               {['SST', 'SSS', 'SSH', 'CURRENTS', 'WINDS'].map(v => (
                 <div key={v} className="px-4 py-2 bg-black/40 border border-white/10 rounded-full"><span className="text-white font-bold font-mono text-xs tracking-widest">{v}</span></div>
               ))}
             </div>
             <div className="text-emerald-500/70 font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-center border border-emerald-500/20 bg-emerald-950/30 px-4 py-2 rounded-full">
                SOURCE: COPERNICUS MARINE DATA
             </div>
           </div>`;

content = content.replace(mobileTarget, mobileNew);

fs.writeFileSync(file, content);
console.log('Fixed DataSection.tsx');
