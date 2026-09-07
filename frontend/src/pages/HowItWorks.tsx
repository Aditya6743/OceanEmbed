import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-32 relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-black/40 pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Project Vision.</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From the core problem to our machine learning prototype, here is the complete breakdown of OceanEmbed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          
          {/* Card 1: The Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group bg-black/60 border border-white/5 rounded-2xl p-10 flex flex-col hover:bg-black/80 hover:border-cyan-500/20 transition-all duration-500 relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-full blur-2xl transition-all duration-700"></div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              01. The Problem
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">The Hidden Ocean</h3>
            <p className="text-white/50 font-light leading-relaxed text-sm md:text-base">
              Satellites provide massive amounts of real-time data about the ocean's surface, but they cannot penetrate the water. The deep ocean, which drives global climate and cyclones, remains entirely hidden from space. Physical sensors like Argo floats leave massive geographical gaps.
            </p>
          </motion.div>

          {/* Card 2: The Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group bg-black/60 border border-white/5 rounded-2xl p-10 flex flex-col hover:bg-black/80 hover:border-cyan-500/20 transition-all duration-500 relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-full blur-2xl transition-all duration-700"></div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              02. The Solution
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">AI Reconstruction</h3>
            <p className="text-white/50 font-light leading-relaxed text-sm md:text-base">
              OceanEmbed leverages advanced machine learning to bridge the gap. By learning the complex thermodynamic relationships between surface telemetry (SST, SSH, SSS, winds) and deep layers, we can generate continuous 3D ocean models entirely from satellite data.
            </p>
          </motion.div>

          {/* Card 3: The Prototype */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group bg-black/60 border border-white/5 rounded-2xl p-10 flex flex-col hover:bg-black/80 hover:border-cyan-500/20 transition-all duration-500 relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-full blur-2xl transition-all duration-700"></div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              03. Our Prototype
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Live Inference</h3>
            <p className="text-white/50 font-light leading-relaxed text-sm md:text-base">
              Our interactive dashboard connects to a live backend inference engine. Select any coordinate in the North Indian Ocean to instantly receive a 3D thermodynamic volume, thermal gradients (dT/dz), confidence intervals, and depth-layer climatology anomalies.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
