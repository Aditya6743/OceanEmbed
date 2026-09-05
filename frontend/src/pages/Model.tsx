export default function Model() {
  return (
    <div className="flex-1 p-8 md:p-16 lg:px-32 bg-background overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">The OceanEmbed Architecture</h1>
        <p className="text-white/60 text-lg mb-12">
          A PyTorch-based Deep Learning framework utilizing satellite embedding techniques to reconstruct 1D subsurface ocean temperature profiles from 2D surface observations.
        </p>

        <div className="p-8 border border-white/10 rounded-2xl bg-card mb-12 shadow-2xl">
          <div className="flex flex-col items-center space-y-6 font-mono text-sm">
            <div className="grid grid-cols-5 gap-4 w-full">
              {['SST', 'SSH', 'SSS', 'LAT', 'LON'].map(f => (
                <div key={f} className="bg-white/5 border border-white/10 p-3 rounded-lg text-center text-white/70">
                  {f}
                </div>
              ))}
            </div>
            
            <div className="text-cyan-500/50">↓</div>
            
            <div className="bg-white/10 border border-white/20 p-4 rounded-xl w-3/4 text-center text-white font-semibold">
              Feature Processing & Embedding
            </div>
            
            <div className="text-cyan-500/50">↓</div>
            
            <div className="bg-cyan-600 border border-cyan-500 p-6 rounded-2xl w-2/3 text-center text-white text-xl font-bold shadow-[0_0_30px_rgba(8,145,178,0.4)]">
              OCEANEMBED AI
            </div>
            
            <div className="text-cyan-500/50">↓</div>
            
            <div className="bg-white/10 border border-white/20 p-4 rounded-xl w-3/4 text-center text-white font-semibold">
              Vertical Temperature Profile Output
            </div>
            
            <div className="text-cyan-500/50">↓</div>
            
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center text-white/70 w-full">
              [ 10m, 50m, 100m, 200m, 500m, 1000m, 1500m, 2000m ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
