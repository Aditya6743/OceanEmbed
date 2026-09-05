import { useOceanStore } from '../store/oceanStore';
import { Info } from 'lucide-react';

export default function SurfaceData() {
  const prediction = useOceanStore(state => state.prediction);

  const sst = prediction?.surface_data.sst || '--';
  const ssh = prediction?.surface_data.ssh !== undefined ? `+${prediction.surface_data.ssh}` : '--';
  const sss = prediction?.surface_data.sss || '--';
  const isDataAvailable = !!prediction;

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/[0.01]">
        <h2 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
          Surface Observations
        </h2>
      </div>
      
      <div className="p-4 space-y-3">
        {[
          { label: 'SST', val: sst, unit: '°C', desc: 'Sea Surface Temperature' },
          { label: 'SSH / SLA', val: ssh, unit: 'm', desc: 'Sea Surface Height Anomaly' },
          { label: 'SSS', val: sss, unit: 'PSU', desc: 'Sea Surface Salinity' }
        ].map(item => (
          <div key={item.label} className={`flex items-center justify-between p-3 rounded-lg border border-white/[0.03] bg-white/[0.02] transition-opacity ${!isDataAvailable ? 'opacity-40 grayscale' : ''}`}>
            <div className="flex items-center gap-1.5 group relative">
              <span className="text-[11px] font-mono text-white/70 tracking-widest">{item.label}</span>
              <Info className="w-3 h-3 text-white/30 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-black/90 border border-white/10 text-[10px] font-mono text-white/70 rounded z-10 pointer-events-none">
                {item.desc}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-mono text-cyan-400 font-light">{item.val}</span>
              <span className="text-[10px] font-mono text-white/30">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
