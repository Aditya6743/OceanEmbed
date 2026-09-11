import { motion } from 'framer-motion';

export default function DataSection() {
  const variables = [
    { name: "SST", desc: "Sea Surface Temperature" },
    { name: "SSS", desc: "Sea Surface Salinity" },
    { name: "SSH / SLA", desc: "Sea Surface Height / Sea Level Anomaly" },
    { name: "CURRENT", desc: "Surface Ocean Currents (U & V)" },
    { name: "WIND", desc: "Surface Winds (U & V)" }
  ];

  return (
    <section id="data" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">THE DATA</div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Satellite Telemetry.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Argo Ground Truth.</span>
            </h2>
            <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
              OceanEmbed learns the complex thermodynamics of the North Indian Ocean by processing high-resolution telemetry from the <strong>Copernicus Marine Environment Monitoring Service (CMEMS)</strong>, and validating the results against independent deep-water <strong>Argo Float</strong> sensor data.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-[0.2em] mb-2">STUDY REGION</div>
                <div className="text-white font-medium text-sm mb-1">NORTH INDIAN OCEAN</div>
                <div className="text-white/50 font-mono text-xs mt-2">LAT: 5°N — 30°N</div>
                <div className="text-white/50 font-mono text-xs">LON: 45°E — 105°E</div>
              </div>
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-[0.2em] mb-2">DATASET SPECS</div>
                <div className="text-white font-medium text-sm mb-1">SPATIAL: 0.25° × 0.25°</div>
                <div className="text-white/50 font-mono text-xs mt-2">DEPTH: 0m to 1000m</div>
                <div className="text-white/50 font-mono text-xs">TEMPORAL: Daily</div>
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-2 pl-2">CMEMS SATELLITE FEATURES</div>
            {variables.map((v) => (
              <div key={v.name} className="relative flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all backdrop-blur-md cursor-default group">
                <div className="w-24 text-cyan-300 font-mono text-sm tracking-widest">{v.name}</div>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="text-white/70 text-sm font-light group-hover:text-white transition-colors">{v.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
