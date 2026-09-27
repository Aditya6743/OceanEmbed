import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useOceanStore } from '../store/oceanStore';
import { stopAutoPilot } from '../lib/autopilot';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const autoPilotMode = useOceanStore((state) => state.autoPilotMode);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Hide navbar on the Solutions page for a cleaner fullscreen dashboard
  if (location.pathname === '/solutions') return null;
  
  // Simplified uncluttered navbar
  const navLinks: Array<{ name: string; id: string; path?: string }> = [
    { name: 'Data Ingestion', id: 'data' },
    { name: 'Architecture', id: 'architecture', path: '/architecture' },
    { name: 'About', id: 'about' },
    { name: 'Solutions', id: 'mosdac', path: '/solutions' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id?: string, path?: string) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu if open
    
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
    <header className="fixed top-0 w-full z-[90] select-none border-b border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-6 mx-auto">
        <div className="flex items-center gap-12 w-full md:w-auto justify-between">
          
          <Link to="/" onClick={(e) => handleNavClick(e, 'top', '/')} className="flex items-center gap-0 opacity-90 cursor-pointer hover:opacity-100 transition-opacity">
            <img src="/logo_cropped.png" alt="OceanEmbed Logo" className="-mt-1.5 ml-2 h-8 w-auto object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
            <span className="-ml-[11.5px] font-semibold text-[15px] tracking-[0.15em] uppercase">
              <span className="text-white">OCEAN</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EMBED</span>
            </span>
          </Link>
          
          <button 
            className="md:hidden text-white/80 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path || `/#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id, link.path)}
                className={`text-[11px] font-mono tracking-[0.1em] uppercase transition-all ${
                  link.name === 'Solutions' 
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <a 
            href="https://oceanembed-backend-av3e.onrender.com/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)]"
          >
            DEVELOPER API
          </a>
          {autoPilotMode ? (
            <button 
              onClick={stopAutoPilot}
              className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-red-50 font-bold bg-red-950 border border-red-500/50 px-4 py-1.5 rounded-full hover:bg-red-900 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              STOP DEMO
            </button>
          ) : (
            <button 
              onClick={() => {
                useOceanStore.getState().setAutoPilotMode(true);
                navigate('/explore');
              }}
              className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-black font-bold bg-white px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              AUTO-PILOT DEMO
            </button>
          )}
          <a href="https://github.com/Aditya6743/OceanEmbed" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all" title="GitHub Repository">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </a>
        </div>
      </div>
      
      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-[#030712]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-4 px-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path || `/#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id, link.path)}
                className={`text-[13px] font-mono tracking-[0.1em] uppercase ${
                  link.name === 'Solutions' 
                    ? 'text-cyan-400 font-bold' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            <hr className="border-white/10 my-2" />
            
            <a 
              href="https://oceanembed-backend-av3e.onrender.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[12px] uppercase tracking-widest font-mono text-cyan-400 font-bold"
            >
              Developer API
            </a>
            
            <a href="https://github.com/Aditya6743/OceanEmbed" target="_blank" rel="noopener noreferrer" className="text-[12px] uppercase tracking-widest font-mono text-white/80 font-bold">
              GitHub Repository
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
