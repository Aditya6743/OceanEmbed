import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Database, Layers } from 'lucide-react';

export default function ResultsSection() {
  const navigate = useNavigate();

  return (
    <section id="results" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">THE DASHBOARD</div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">See Beneath the Surface.</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-16">
          Experience our live machine learning inference. Dive into the North Indian Ocean and extract a 3D thermodynamic profile in real-time.
        </p>

        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-xl relative overflow-hidden flex flex-col shadow-2xl p-8 md:p-12">
          
          <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-left backdrop-blur-md">
              <Layers className="text-cyan-400 w-8 h-8 mb-4" />
              <h4 className="text-white font-bold mb-2">3D Volume Rendering</h4>
              <p className="text-white/50 text-sm font-light">Interactive visualization of the ocean's physical layers up to 1000m deep.</p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-left backdrop-blur-md">
              <BarChart3 className="text-emerald-400 w-8 h-8 mb-4" />
              <h4 className="text-white font-bold mb-2">Argo Validation</h4>
              <p className="text-white/50 text-sm font-light">Direct real-time comparison against independent Argo float ground truth data.</p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-left backdrop-blur-md">
              <Database className="text-rose-400 w-8 h-8 mb-4" />
              <h4 className="text-white font-bold mb-2">Scientific Output</h4>
              <p className="text-white/50 text-sm font-light">Calculates dT/dz thermal gradients and ±95% CI uncertainty bounds dynamically.</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/explore')}
            className="group z-10 mx-auto flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-[12px] tracking-[0.2em] font-bold rounded-lg transition-all shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:shadow-[0_0_50px_rgba(8,145,178,0.5)]"
          >
            <span>LAUNCH INTERACTIVE DASHBOARD</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
