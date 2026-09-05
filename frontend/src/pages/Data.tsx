export default function Data() {
  return (
    <div className="flex-1 p-8 md:p-16 lg:px-32 bg-background overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Data Sources & Pipeline</h1>
        <p className="text-white/60 text-lg mb-12">
          OceanEmbed relies on high-quality satellite observations and subsurface measurements to train the deep learning framework.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 border border-white/10 rounded-2xl bg-card">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Satellite Data</h2>
            <ul className="space-y-4 text-white/70">
              <li><strong className="text-white">SST:</strong> Sea Surface Temperature</li>
              <li><strong className="text-white">SSH / SLA:</strong> Sea Surface Height Anomaly</li>
              <li><strong className="text-white">SSS:</strong> Sea Surface Salinity</li>
            </ul>
          </div>
          
          <div className="p-8 border border-white/10 rounded-2xl bg-card">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Argo Float Data</h2>
            <p className="text-white/70">
              Subsurface temperature profiles used as ground truth for model training and validation. Argo floats provide sparse but highly accurate vertical profiles.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Data Pipeline</h2>
        <div className="flex flex-col items-center justify-center space-y-4 font-mono text-sm text-cyan-300 bg-white/5 p-8 rounded-2xl border border-white/10">
          <div className="flex w-full justify-around mb-4">
            <div className="bg-card p-4 rounded-xl border border-white/10 shadow-lg text-center">Satellite Observations</div>
            <div className="text-white/30 text-xl font-bold mt-4">+</div>
            <div className="bg-card p-4 rounded-xl border border-white/10 shadow-lg text-center">Argo Profiles</div>
          </div>
          <div className="text-white/30">↓</div>
          <div className="bg-card p-3 rounded-xl border border-white/10 w-64 text-center">Spatial Matching</div>
          <div className="text-white/30">↓</div>
          <div className="bg-card p-3 rounded-xl border border-white/10 w-64 text-center">Temporal Matching</div>
          <div className="text-white/30">↓</div>
          <div className="bg-card p-3 rounded-xl border border-white/10 w-64 text-center">Cleaning & Normalization</div>
          <div className="text-white/30">↓</div>
          <div className="bg-cyan-900/30 text-cyan-400 p-3 rounded-xl border border-cyan-800 w-64 text-center shadow-[0_0_15px_rgba(8,145,178,0.3)]">Training Dataset</div>
        </div>
      </div>
    </div>
  );
}
