import { useOceanStore } from '../store/oceanStore';
import { mockArgoComparison } from '../data/mockOceanData';

export default function ValidationPanel() {
  const prediction = useOceanStore(state => state.prediction);
  const metrics = mockArgoComparison.metrics;

  if (!prediction) return null;

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
        <h2 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
          OceanEmbed vs Argo
        </h2>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-500 border border-cyan-900/50">
          DEMO DATA
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-px bg-white/5">
        <div className="bg-card p-4 text-center">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">RMSE</div>
          <div className="text-sm font-mono text-white">{metrics.rmse.toFixed(2)}</div>
        </div>
        <div className="bg-card p-4 text-center">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">MAE</div>
          <div className="text-sm font-mono text-white">{metrics.mae.toFixed(2)}</div>
        </div>
        <div className="bg-card p-4 text-center">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">R²</div>
          <div className="text-sm font-mono text-white">{metrics.r2.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
