import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ResultsSection() {
  const navigate = useNavigate();

  return (
    <section id="results" className="w-full pt-24 pb-32 relative z-10 bg-transparent flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
      
      {/* Subtle deep ocean background glow (Restored original BG) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.08)_0,transparent_70%)] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 max-w-[1200px] text-center relative z-20">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-px bg-cyan-900/50"></div>
          <div className="text-cyan-400 font-mono text-xs tracking-[0.25em] font-bold uppercase">
            The Dashboard
          </div>
          <div className="w-8 h-px bg-cyan-900/50"></div>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-2xl">
          See Beneath the <span className="text-cyan-400">Surface.</span>
        </h2>
        
        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-16">
          Experience our live machine learning inference. Drop a pin anywhere in the<br/>North Indian Ocean to instantly extract a 3D thermodynamic profile.
        </p>

        {/* 3-Column Features */}
        <div className="grid grid-cols-3 gap-4 md:gap-12 max-w-4xl mx-auto relative z-30">
          
          {/* LEFT: 3D VOLUME */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border border-white/10 bg-black/60 flex items-center justify-center mb-6 text-cyan-400 backdrop-blur-md transform-gpu will-change-transform shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] relative z-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-cyan-400"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" /></svg>
            </div>
            <h4 className="text-white font-bold text-lg mb-2">3D Volume</h4>
            <p className="text-white/50 text-sm font-light max-w-[200px]">Interactive physical layers up<br/>to 1000m deep.</p>
            {/* Drop line */}
            <div className="w-px h-32 md:h-28 bg-gradient-to-b from-transparent via-white/10 to-cyan-400 mt-6 relative z-10">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]"></div>
            </div>
          </div>

          {/* CENTER: LIVE VALIDATION */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border border-white/10 bg-black/60 flex items-center justify-center mb-6 text-cyan-400 backdrop-blur-md transform-gpu will-change-transform shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] relative z-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-cyan-400"><polyline points="2 12 7 12 10 3 14 21 17 12 22 12" /></svg>
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Live Validation</h4>
            <p className="text-white/50 text-sm font-light max-w-[200px]">Real-time comparison<br/>against Argo float data.</p>
            {/* Drop line (Shorter because the arc is at its peak here) */}
            <div className="w-px h-16 md:h-14 bg-gradient-to-b from-transparent via-white/10 to-cyan-400 mt-6 relative z-10">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]"></div>
            </div>
          </div>

          {/* RIGHT: SCIENTIFIC OUTPUT */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border border-white/10 bg-black/60 flex items-center justify-center mb-6 text-cyan-400 backdrop-blur-md transform-gpu will-change-transform shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] relative z-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-cyan-400"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Scientific Output</h4>
            <p className="text-white/50 text-sm font-light max-w-[200px]">Thermal gradients and ±95%<br/>uncertainty bounds.</p>
            {/* Drop line */}
            <div className="w-px h-32 md:h-28 bg-gradient-to-b from-transparent via-white/10 to-cyan-400 mt-6 relative z-10">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]"></div>
            </div>
          </div>

        </div>

      </div>

      {/* HORIZON ARC & GLOW */}
      {/* Stricter curve width (130vw) for higher arc, and raised up relative to the bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[115vw] h-[700px] rounded-[100%] border-t-[1.5px] border-cyan-400/80 shadow-[0_-15px_50px_rgba(34,211,238,0.2)] bg-gradient-to-b from-cyan-950/20 to-black z-10 pointer-events-none" style={{ top: 'calc(100% - 360px)' }}></div>
      <div className="absolute left-1/2 -translate-x-1/2 w-[115vw] h-[700px] rounded-[100%] border-t-[6px] border-cyan-400/30 blur-md pointer-events-none z-10" style={{ top: 'calc(100% - 360px)' }}></div>

      {/* CTA BUTTON */}
      <div className="relative z-40 mt-16">
        <button 
          onClick={() => navigate('/explore')}
          className="group relative inline-flex items-center gap-4 px-10 py-4 bg-white hover:bg-slate-100 text-black text-[11px] tracking-[0.25em] font-extrabold rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1"
        >
          <span>LAUNCH INTERACTIVE DASHBOARD</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </button>
      </div>

    </section>
  );
}
