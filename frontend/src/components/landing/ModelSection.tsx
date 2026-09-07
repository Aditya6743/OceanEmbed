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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">From Surface Data to Subsurface Intelligence.</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            OceanEmbed uses deep learning to learn nonlinear relationships between surface ocean conditions and the temperature structure beneath them.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 lg:gap-12">
          {/* Input */}
          <div className="flex-1 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center relative">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-8 text-center">SURFACE OBSERVATIONS</div>
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
          <div className="flex-1 p-8 rounded-2xl bg-cyan-950/20 border border-cyan-900/40 flex flex-col items-center justify-center relative backdrop-blur-sm overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
            />
            
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-[0.2em] mb-4">SATELLITE EMBEDDING</div>
            <div className="h-8 w-px bg-cyan-500/30 my-2"></div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] my-4 text-center">DEEP LEARNING RECONSTRUCTION</div>
            <div className="h-8 w-px bg-cyan-500/30 my-2"></div>
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-[0.2em] mt-4">DEPTH-WISE TEMPERATURE</div>

            {/* Connector */}
            <div className="hidden md:block absolute -right-6 lg:-right-6 top-1/2 -translate-y-1/2 text-cyan-500/50">→</div>
            <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-cyan-500/50">↓</div>
          </div>

          {/* Output */}
          <div className="flex-1 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-8 text-center">PREDICTED PROFILE</div>
            <div className="grid grid-cols-3 gap-2 w-full text-center">
              {depths.map(d => (
                <div key={d} className="py-1.5 bg-black/40 rounded text-white/60 font-mono text-xs">{d}</div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-6">SUPPORTED ARCHITECTURES</div>
          <div className="flex flex-wrap justify-center gap-4 text-white/50 font-mono text-xs">
            <span className="px-3 py-1 rounded-full border border-white/10">CNN</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Vision Transformer</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Autoencoder</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Graph Neural Network</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Attention-based Hybrid</span>
          </div>
        </div>
      </div>
    </section>
  );
}
