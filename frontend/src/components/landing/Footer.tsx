import { Link } from 'react-router-dom';

export default function Footer() {
  const platformLinks = [
    { name: 'Home', path: '/' },
    { name: 'Interactive Dashboard', path: '/explore' },
    { name: 'Neural Architecture', path: '/architecture' },
    { name: 'Project Vision', path: '/project-vision' },
    { name: 'Global Solutions', path: '/solutions' }
  ];

  const sectionLinks = [
    { name: 'Architecture Overview', path: '/#architecture' },
    { name: 'Data Ingestion', path: '/#data' },
    { name: 'Live Inference', path: '/#results' },
    { name: 'About The Project', path: '/#about' }
  ];

  return (
    <footer className="w-full pt-20 pb-12 bg-black/30 backdrop-blur-md transform-gpu will-change-transform border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h3 className="text-xl font-black tracking-[0.2em] uppercase text-white mb-3">
              OCEAN<span className="text-cyan-400">EMBED</span>
            </h3>
            <p className="text-white/40 font-light text-sm mb-8 max-w-sm leading-relaxed">
              Decoding the deep ocean entirely from surface satellite telemetry. A neural interpolation layer for continuous 3D thermodynamic profiling.
            </p>
            <div className="inline-block px-4 py-2 bg-white/[0.02] border border-white/10 rounded-full mb-5">
              <p className="text-white/60 font-mono text-[11px] tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Team CodeStormers 20
              </p>
            </div>
            <p className="text-white/40 font-light text-sm leading-relaxed max-w-[320px]">
              Developed for the <span className="text-cyan-400/80">INCOIS</span> problem statement under the <span className="text-white/60">Ministry of Earth Sciences (MoES)</span>.
            </p>
          </div>
          
          <div>
            <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] mb-6 font-bold">Platform</div>
            <ul className="space-y-4">
              {platformLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/60 hover:text-cyan-400 transition-colors text-sm font-light">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] mb-6 font-bold">Page Sections</div>
            <ul className="space-y-4">
              {sectionLinks.map(link => (
                <li key={link.name}>
                  <a href={link.path} className="text-white/60 hover:text-cyan-400 transition-colors text-sm font-light">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] mb-6 font-bold">Project Scope</div>
            <ul className="space-y-4 text-white/50 text-sm font-light">
              <li className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2"><div className="w-1 h-1 bg-white/20 rounded-full shrink-0"></div> North Indian Ocean</div>
                <div className="text-[10px] text-cyan-500/70 ml-[12px] font-mono whitespace-nowrap">5°N - 30°N, 45°E - 105°E</div>
              </li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/20 rounded-full"></div> 0m — 1000m Depth</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/20 rounded-full"></div> 0.25° Spatial Res.</li>
              <li className="pt-4 mt-4 border-t border-white/5">
                <a href="https://github.com/Aditya6743/OceanEmbed" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
                  GitHub Repository ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-[11px] font-light tracking-wide">
            OceanEmbed — Neural Subsurface Intelligence
          </p>
          <p className="text-white/30 text-[11px] font-light tracking-wide">
            © 2026 OceanEmbed. Built for marine science and innovation.
          </p>
        </div>
      </div>
    </footer>
  );
}
