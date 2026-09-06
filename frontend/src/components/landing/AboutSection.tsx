export default function AboutSection() {
  return (
    <section id="about" className="w-full py-32 relative z-10 bg-[#020202] border-t border-white/5 overflow-hidden">
      {/* Heavy bottom glow fading into the footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-cyan-950/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-6">ABOUT</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 tracking-tight leading-tight">
          Understanding the Ocean<br/>Beyond the Surface.
        </h2>
        
        <div className="space-y-8 text-white/60 font-light text-lg leading-relaxed text-left p-10 md:p-12 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl">
          <p>
            <span className="text-white font-medium">OceanEmbed</span> is an AI-driven framework for reconstructing subsurface ocean temperature from widely available surface observations.
          </p>
          <p>
            Subsurface temperature is critical for understanding ocean circulation, heat content, stratification, climate variability, air-sea interaction, marine ecosystems, and extreme events. Yet direct subsurface observations remain spatially and temporally limited.
          </p>
          <p>
            OceanEmbed explores whether information encoded in surface ocean conditions can be used by deep learning models to infer the hidden structure beneath.
          </p>
        </div>
      </div>
    </section>
  );
}
