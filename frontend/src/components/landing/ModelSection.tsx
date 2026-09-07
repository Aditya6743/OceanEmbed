import { motion } from 'framer-motion';

export default function ModelSection() {
  const depths = ["0m", "5m", "10m", "20m", "30m", "50m", "75m", "100m", "125m", "150m", "200m", "300m", "500m", "700m", "1000m"];
  
  return (
    <section id="model" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">THE MODEL</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">From Surface Data to Subsurface Intelligence.</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            OceanEmbed is powered by a highly optimized ML Model (Random Forest Regressor) engineered to map the complex, non-linear thermodynamic relationships between surface signatures and deep-water layers.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 lg:gap-12">
          {/* Input */}
          <div className="flex-1 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center relative shadow-xl">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-8 text-center">INPUT TELEMETRY</div>
            <div className="flex flex-col gap-4 w-full">
              {['SST', 'SSS', 'SSH/SLA', 'CURRENTS', 'WINDS'].map(v => (
                <div key={v} className="py-2 border-b border-white/5 text-center text-white/80 font-mono tracking-widest text-sm">{v}</div>
              ))}
            </div>
            {/* Connector */}
            <div className="hidden md:block absolute -right-6 lg:-right-6 top-1/2 -translate-y-1/2 text-cyan-500/50">→</div>
            <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-cyan-500/50">↓</div>
          </div>

          {/* Model Core */}
          <div className="flex-1 p-8 rounded-2xl bg-cyan-950/20 border border-cyan-900/40 flex flex-col items-center justify-center relative backdrop-blur-sm overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.1)]">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
            />
            
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-[0.2em] mb-4">THERMODYNAMIC EMBEDDING</div>
            <div className="h-8 w-px bg-cyan-500/30 my-2"></div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-[0.2em] my-4 text-center">RANDOM FOREST ML MODEL</div>
            <div className="h-8 w-px bg-cyan-500/30 my-2"></div>
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-[0.2em] mt-4">MULTI-OUTPUT REGRESSION</div>

            {/* Connector */}
            <div className="hidden md:block absolute -right-6 lg:-right-6 top-1/2 -translate-y-1/2 text-cyan-500/50">→</div>
            <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-cyan-500/50">↓</div>
          </div>

          {/* Output */}
          <div className="flex-1 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center shadow-xl">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-8 text-center">OUTPUT PROFILE (0—1000m)</div>
            <div className="grid grid-cols-3 gap-2 w-full text-center">
              {depths.map(d => (
                <div key={d} className="py-1.5 bg-black/40 rounded border border-white/5 text-white/60 font-mono text-xs hover:bg-cyan-950/30 transition-colors">{d}</div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-20 flex flex-col md:flex-row gap-12 items-start justify-center">
          <div className="flex-1 text-center md:text-right md:border-r border-white/10 md:pr-12">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-6">CORE ARCHITECTURE</div>
            <div className="inline-block px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 font-bold font-mono tracking-widest text-sm shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              RANDOM FOREST ML MODEL
            </div>
            <p className="mt-4 text-white/40 text-xs font-light max-w-xs mx-auto md:ml-auto md:mr-0 leading-relaxed">
              A powerful Machine Learning (ML) model operating by constructing a multitude of decision trees at training time, outputting the mean prediction for robust, non-linear depth extrapolation.
            </p>
          </div>
          
          <div className="flex-1 text-center md:text-left md:pl-0">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-6">SUPPORTED MODEL OUTPUTS</div>
            <div className="flex flex-col items-center md:items-start gap-3 text-white/50 font-mono text-xs">
              <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300">Continuous Temperature Profile</span>
              <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300">Thermodynamic Gradient (dT/dz)</span>
              <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300">±95% Confidence Intervals</span>
              <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300">Depth-Layer Climatology Anomalies</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
