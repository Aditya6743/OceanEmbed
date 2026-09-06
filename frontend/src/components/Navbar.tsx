import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Waves } from 'lucide-react';
import React from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Simplified uncluttered navbar
  const navLinks = [
    { name: 'Home', id: 'top', path: '/' },
    { name: 'Data', id: 'data' },
    { name: 'Model', id: 'model' },
    { name: 'About', id: 'about' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id?: string, path?: string) => {
    e.preventDefault();
    if (path) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id!);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id!);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 select-none border-b border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-6 mx-auto">
        <div className="flex items-center gap-12">
          
          <Link to="/" onClick={(e) => handleNavClick(e, 'top', '/')} className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <Waves className="w-6 h-6 text-cyan-400" strokeWidth={1.5} />
            <span className="font-semibold text-[15px] tracking-[0.15em] uppercase">
              <span className="text-white">OCEAN</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EMBED</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path || `/#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id, link.path)}
                className="text-[11px] font-mono tracking-[0.1em] uppercase transition-colors text-white/40 hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/explore" 
            className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-black font-bold bg-white px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            Launch UI
          </Link>
        </div>
      </div>
    </header>
  );
}
