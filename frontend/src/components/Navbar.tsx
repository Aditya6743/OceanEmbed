import { Link, useLocation } from 'react-router-dom';
import { Activity, Waves } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Model', path: '/model' },
    { name: 'Data', path: '/data' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 select-none border-b border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-6 mx-auto">
        <div className="flex items-center gap-12">
          
          <Link to="/" className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            {/* Classic, timeless scientific logo mark */}
            <Waves className="w-6 h-6 text-cyan-400" strokeWidth={1.5} />
            
            {/* Clean, unified typography without startup-style color splits */}
            <span className="font-semibold text-[15px] tracking-[0.15em] uppercase">
              <span className="text-white">OCEAN</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EMBED</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-[12px] tracking-[0.1em] uppercase transition-colors hover:text-white ${
                  location.pathname === link.path ? 'text-white font-medium' : 'text-white/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-cyan-400 bg-cyan-950/20 px-3 py-1 rounded-full border border-cyan-500/10">
          <Activity className="w-3 h-3" />
          OCEAN INTELLIGENCE
        </div>
      </div>
    </header>
  );
}
