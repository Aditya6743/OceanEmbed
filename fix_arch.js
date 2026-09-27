const fs = require('fs');
const file = 'frontend/src/components/landing/ArchitectureSection.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Header Text \*\/\}.*?<div className="relative w-full max-w-\[1400px\] mt-20 z-10">/s;

const replacement = `{/* Header Text Area (Flex on Mobile to prevent overlap) */}
      <div className="relative z-20 flex flex-col md:flex-row md:justify-between px-6 md:px-24 pt-24 gap-8">
        <div className="pointer-events-none">
          <h2 className="text-4xl md:text-7xl font-light tracking-tight leading-[1.05]">
            <span className="text-white">Observe the surface.</span><br />
            <span className="text-cyan-400/80">Predict the deep.</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent mt-6" />
        </div>
        <div className="flex flex-col md:items-end md:text-right">
          <p className="text-white/60 text-sm mb-6 max-w-[300px] leading-relaxed font-sans">
            From multi-source satellite observations to volumetric subsurface profiles.<br />
            One connected learning framework.
          </p>
          <Link 
            to="/architecture" 
            className="group inline-flex w-max items-center justify-center gap-3 px-7 py-3.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-400 hover:text-black transition-all text-xs font-mono font-bold tracking-widest text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            EXPLORE ARCHITECTURE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* SVG Diagram Area */}
      <div className="relative w-full max-w-[1400px] mt-10 md:mt-20 z-10">`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Fixed architecture section layout.');
