import { motion } from 'framer-motion';

export default function ProblemSection() {
  return (
    <section id="problem" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Ocean We Cannot See.</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Satellite observations continuously capture the ocean surface, but direct observations below the surface remain sparse.
          </p>
        </motion.div>

        <div className="flex flex-col items-center max-w-3xl mx-auto">
          <div className="w-full p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">SURFACE OBSERVATIONS</div>
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
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">HIDDEN OCEAN STRUCTURE</div>
            <div className="text-white/90 font-mono tracking-widest text-sm md:text-base mb-2">SUBSURFACE TEMPERATURE</div>
            <div className="text-cyan-400/50 font-mono text-xs tracking-widest">0–1000 m</div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 text-center text-white/50 text-lg font-light"
          >
            OceanEmbed bridges the gap using representation learning and deep learning.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
