import { motion } from 'framer-motion';

export default function ProblemSection() {
  return (
    <section id="problem-section" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* THE PROBLEM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="text-[11px] font-mono text-rose-400 uppercase tracking-[0.2em] mb-4">01. The Problem</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">The Ocean We Cannot See.</h2>
          <div className="grid md:grid-cols-2 gap-12 text-white/60 text-lg font-light leading-relaxed">
            <p>
              Satellites provide massive amounts of real-time data about the ocean's surface—temperature, height, and salinity. However, they cannot penetrate the water. The deep ocean, which drives global climate, marine ecosystems, and cyclonic weather events, remains entirely hidden from space.
            </p>
            <p>
              Currently, we rely on expensive, sparse physical sensors (like Argo floats) to measure deep-water temperatures. Because the ocean is vast, these physical sensors leave massive gaps in our real-time understanding of the 3D thermodynamic volume beneath the surface.
            </p>
          </div>
        </motion.div>

        {/* THE SOLUTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-[0.2em] mb-4">02. The Solution</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">AI-Driven Depth Reconstruction.</h2>
          <div className="grid md:grid-cols-2 gap-12 text-white/60 text-lg font-light leading-relaxed">
            <p>
              By leveraging advanced machine learning, we can bridge the gap between what we see on the surface and what lies beneath. OceanEmbed learns the complex thermodynamic relationships between surface telemetry (SST, SSH, SSS, winds) and the physical ocean layers up to 1000m deep.
            </p>
            <p>
              This allows us to generate a highly accurate, continuous 3D model of the ocean entirely from satellite data, bypassing the need for physical probes and delivering instant, scalable oceanographic mapping.
            </p>
          </div>
        </motion.div>

        {/* HOW OUR PROTOTYPE HELPS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">03. Our Prototype</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Real-Time ML Inference.</h2>
          
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-12">
            <div className="w-full p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">INPUT: SATELLITE TELEMETRY</div>
              <div className="text-white/80 font-mono tracking-widest text-sm md:text-base">SST • SSS • SSH/SLA • CURRENTS • WINDS</div>
            </div>
            
            <div className="h-16 w-px bg-gradient-to-b from-white/20 to-cyan-500/50 my-2 relative">
              <motion.div 
                animate={{ y: [0, 64] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"
              />
            </div>

            <div className="w-full p-8 md:p-10 rounded-2xl bg-cyan-950/20 border border-cyan-900/30 text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.05] to-transparent pointer-events-none"></div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">OUTPUT: OCEANEMBED PROTOTYPE</div>
              <div className="text-white/90 font-mono tracking-widest text-sm md:text-base mb-3">3D THERMODYNAMIC VOLUME & THERMOCLINE GRADIENT</div>
              <div className="text-cyan-400/50 font-mono text-xs tracking-widest leading-relaxed">
                ±95% Scientific Confidence Intervals • Climatology Anomaly Heatmaps<br/>
                Continuous Profiling from 0 to 1000m Depth
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
