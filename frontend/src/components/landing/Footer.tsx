export default function Footer() {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Project Vision', path: '/how-it-works' },
    { name: 'Explore Dashboard', path: '/explore' },
    { name: 'Data', path: '/#data' },
    { name: 'Model', path: '/#model' },
    { name: 'About', path: '/#about' }
  ];

  return (
    <footer className="w-full py-16 bg-transparent border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold tracking-[0.2em] uppercase text-white mb-2">
              OCEAN<span className="text-cyan-400">EMBED</span>
            </h3>
            <p className="text-white/40 font-light text-sm mb-6">Understanding the ocean beyond the surface.</p>
            <div className="inline-block px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/20 rounded-md">
              <p className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase">Presented by Team CodeStormers</p>
            </div>
          </div>
          
          <div>
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">NAVIGATION</div>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.name}>
                  <a href={link.path} className="text-white/60 hover:text-white transition-colors text-sm font-light">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">PROJECT INFO</div>
            <ul className="space-y-3 text-white/60 text-sm font-light">
              <li>North Indian Ocean</li>
              <li>5°N–30°N | 45°E–105°E</li>
              <li>Daily • 0.25° Resolution</li>
              <li className="pt-4"><a href="https://github.com/Aditya6743/OceanEmbed" target="_blank" rel="noopener noreferrer" className="text-cyan-400/80 hover:text-cyan-400 transition-colors">GitHub Repository ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-light">OceanEmbed — AI-powered subsurface ocean intelligence</p>
          <p className="text-white/30 text-xs font-light">© 2026 OceanEmbed. Built for ocean science and innovation.</p>
        </div>
      </div>
    </footer>
  );
}
