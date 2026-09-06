export default function Footer() {
  return (
    <footer className="w-full py-16 bg-[#010101] border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold tracking-[0.2em] uppercase text-white mb-2">
              OCEAN<span className="text-cyan-400">EMBED</span>
            </h3>
            <p className="text-white/40 font-light text-sm">Understanding the ocean beyond the surface.</p>
          </div>
          
          <div>
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">NAVIGATION</div>
            <ul className="space-y-3">
              {['Home', 'Data', 'Model', 'Results', 'About'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors text-sm font-light">
                    {link}
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
              <li className="pt-4"><a href="#" className="text-cyan-400/80 hover:text-cyan-400 transition-colors">GitHub Repository ↗</a></li>
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
