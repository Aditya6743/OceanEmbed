import { motion } from 'framer-motion';

export default function DataSection() {
  const variables = [
    { name: "SST", desc: "Sea Surface Temperature" },
    { name: "SSS", desc: "Sea Surface Salinity" },
    { name: "SSH / SLA", desc: "Sea Surface Height / Sea Level Anomaly" },
    { name: "CURRENT", desc: "Surface Ocean Currents" },
    { name: "WIND", desc: "Surface Winds" }
  ];

  return (
    <section id="data" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Surface Signals.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Hidden Ocean Structure.</span>
            </h2>
            <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
              OceanEmbed learns from daily surface observations to uncover the subsurface temperature structure of the North Indian Ocean. These surface observations contain indirect signatures of what is happening beneath the ocean surface.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-[0.2em] mb-2">STUDY REGION</div>
                <div className="text-white font-medium text-sm mb-1">NORTH INDIAN OCEAN</div>
                <div className="text-white/50 font-mono text-xs">5°N — 30°N</div>
                <div className="text-white/50 font-mono text-xs">45°E — 105°E</div>
              </div>
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-[0.2em] mb-2">RESOLUTION</div>
                <div className="text-white font-medium text-sm mb-1">SPATIAL: 0.25° × 0.25°</div>
                <div className="text-white/50 font-mono text-xs mt-2">TEMPORAL: Daily</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-3 relative"
          >
            {/* Soft background glow behind variables */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-2 pl-2">INPUT VARIABLES</div>
            {variables.map((v) => (
              <div key={v.name} className="relative flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all backdrop-blur-md cursor-default group">
                <div className="w-20 text-white font-mono text-sm tracking-widest group-hover:text-cyan-300 transition-colors">{v.name}</div>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="text-white/50 text-sm font-light group-hover:text-white/80 transition-colors">{v.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
