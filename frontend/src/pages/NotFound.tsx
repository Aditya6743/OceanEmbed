import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 w-full h-full min-h-[calc(100vh-5rem)] flex items-center justify-center relative bg-transparent pointer-events-auto">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0,transparent_70%)] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <ShieldAlert className="w-20 h-20 text-rose-500 mb-6" strokeWidth={1} />
        <h1 className="text-6xl font-black text-white tracking-widest mb-4">404</h1>
        <h2 className="text-xl text-cyan-400 uppercase tracking-[0.3em] font-bold mb-8">Signal Lost</h2>
        <p className="text-slate-400 font-mono text-xs max-w-md mx-auto mb-10 leading-relaxed">
          The coordinate or system module you are trying to access does not exist in the current OceanEmbed matrix. Please recalibrate your navigation.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full transition-all uppercase tracking-widest text-xs font-bold font-mono"
        >
          <ArrowLeft size={14} /> Return to Home
        </button>
      </div>
    </div>
  );
}
