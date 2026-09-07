export default function AboutSection() {
  return (
    <section id="about" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-cyan-950/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-6">ABOUT THE PROJECT</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 tracking-tight leading-tight">
          Understanding the Ocean<br/>Beyond the Surface.
        </h2>
        
        <div className="space-y-8 text-white/60 font-light text-lg leading-relaxed text-left p-10 md:p-12 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl">
          <p>
            <span className="text-white font-medium">OceanEmbed</span> is an AI-driven framework engineered to reconstruct the deep 3D thermodynamic volume of the ocean entirely from non-invasive satellite surface observations.
          </p>
          <p>
            Subsurface thermodynamic profiling is critical for understanding global ocean circulation, thermal heat storage, climate variability, and extreme marine events. While direct physical probes (like Argo floats) are highly accurate, they are incredibly sparse, leaving massive blind spots across the globe.
          </p>
          <p>
            OceanEmbed solves this by utilizing deep learning to isolate the nonlinear correlation between surface telemetry and deep-water stratifications, delivering a scalable, instant, and continuous intelligence layer for the North Indian Ocean.
          </p>
        </div>
      </div>
    </section>
  );
}
