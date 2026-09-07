export default function ResultsSection() {
  return (
    <section id="results" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      {/* Background glow behind dashboard */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">See Beneath the Surface.</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-16">
          Actual model outputs, precision metrics, and spatial predictions.
        </p>

        <div className="w-full h-[600px] rounded-3xl border border-white/10 bg-transparent/80 backdrop-blur-xl relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="z-10 text-center px-6">
            <div className="w-16 h-16 rounded-full border border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_30px_rgba(34,211,238,0.1)] flex items-center justify-center mx-auto mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
            </div>
            <h3 className="text-cyan-400 font-mono tracking-widest text-sm mb-3">AWAITING BACKEND CONNECTION</h3>
            <p className="text-white/40 font-light max-w-md mx-auto text-sm leading-relaxed">
              Model output will appear here once inference is connected. The dashboard will display Actual vs Predicted Temperature, RMSE, Spatial Maps, and Error Distributions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
