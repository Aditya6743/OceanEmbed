import { motion } from 'framer-motion';

export default function ProjectVisionSection() {
  const cards = [
    {
      num: "01",
      label: "The Problem",
      title: "The Hidden Ocean",
      desc: "Satellites provide massive amounts of real-time surface data, but the deep ocean—which drives global climate and cyclones—remains entirely hidden from space. Physical sensors like Argo floats are incredibly expensive, geographically sparse, and fundamentally unscalable for real-time global monitoring."
    },
    {
      num: "02",
      label: "The Solution",
      title: "V6 Hybrid AI Architecture",
      desc: "OceanEmbed fundamentally bypasses physical sensors. By feeding satellite surface telemetry (SST, SSS, SSH, Currents, Winds) into our proprietary V6 Hybrid CNN + Vision Transformer Engine, mathematically constrained by Physics-Informed Neural Networks (PINN), we instantly reconstruct a high-fidelity 3D thermodynamic volume down to 1000m."
    },
    {
      num: "03",
      label: "Real-Time Application",
      title: "Tactical Live Inference",
      desc: "Our WebGL-powered 3D Digital Twin serves as a live command center. Click anywhere to resolve 3D thermal gradients and instantly power 7 tactical modules: Disaster Mgmt, Naval Ops, Fisheries, Benthic Cable, IOD Climate, IoT Beacons, and Routing & SAR."
    }
  ];

  return (
    <section id="project-vision" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      {/* Wave-like glowing background */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(34,211,238,0.05)_0,rgba(0,0,0,0)_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[1500px] relative z-10">
        <div className="text-center mb-20">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">PROJECT VISION</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">From Surface to Abyss</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <motion.div 
              key={card.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.2, ease: [0.25, 1, 0.5, 1] }}
              
              className="group relative flex flex-col rounded-3xl overflow-hidden backdrop-blur-2xl border transition-all duration-500 bg-slate-900/40 border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.5)] hover:bg-cyan-950/30 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_20px_40px_rgba(8,145,178,0.2)]"
            >
              {/* Animated Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/10 transition-opacity duration-700 pointer-events-none opacity-0 group-hover:opacity-100"></div>
              
              {/* Grid Mesh Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] transition-opacity duration-700 pointer-events-none opacity-0 group-hover:opacity-100" />
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transition-transform duration-700 scale-x-0 group-hover:scale-x-100"></div>

              <div className="p-10 flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-4xl font-black transition-colors duration-500 text-white/10 group-hover:text-cyan-500/20">
                    {card.num}
                  </div>
                  <div className="px-3 py-1 rounded-full border transition-colors duration-500 bg-white/5 border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                      {card.label}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 tracking-tight transition-colors duration-500 text-white group-hover:text-cyan-50">
                  {card.title}
                </h3>
                <p className="font-light leading-relaxed text-sm transition-colors duration-500 text-white/50 group-hover:text-white/70">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
