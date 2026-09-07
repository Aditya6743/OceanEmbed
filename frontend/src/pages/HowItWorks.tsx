import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Cpu } from 'lucide-react';

export default function HowItWorks() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] pt-24 pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Project Vision.</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From the core problem to our machine learning prototype, here is the complete breakdown of OceanEmbed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: The Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl flex flex-col hover:border-rose-500/30 transition-colors"
          >
            <div className="w-12 h-12 bg-rose-950/40 rounded-xl flex items-center justify-center border border-rose-500/20 mb-6">
              <ShieldAlert className="text-rose-400 w-6 h-6" />
            </div>
            <div className="text-[11px] font-mono text-rose-400 uppercase tracking-[0.2em] mb-2">01. The Problem</div>
            <h3 className="text-2xl font-bold text-white mb-4">The Hidden Ocean</h3>
            <p className="text-white/60 font-light leading-relaxed mb-6">
              Satellites provide massive amounts of real-time data about the ocean's surface, but they cannot penetrate the water. The deep ocean, which drives global climate and cyclones, remains entirely hidden from space. Physical sensors like Argo floats leave massive geographical gaps.
            </p>
          </motion.div>

          {/* Card 2: The Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl flex flex-col hover:border-emerald-500/30 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-950/40 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-6">
              <Zap className="text-emerald-400 w-6 h-6" />
            </div>
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-[0.2em] mb-2">02. The Solution</div>
            <h3 className="text-2xl font-bold text-white mb-4">AI Depth Reconstruction</h3>
            <p className="text-white/60 font-light leading-relaxed mb-6">
              OceanEmbed leverages advanced machine learning to bridge the gap. By learning the complex thermodynamic relationships between surface telemetry (SST, SSH, SSS, winds) and deep layers, we can generate continuous 3D ocean models entirely from satellite data without physical probes.
            </p>
          </motion.div>

          {/* Card 3: The Prototype */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 bg-cyan-950/60 rounded-xl flex items-center justify-center border border-cyan-500/40 mb-6 relative z-10">
              <Cpu className="text-cyan-400 w-6 h-6" />
            </div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-2 relative z-10">03. Our Prototype</div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Real-Time Inference</h3>
            <p className="text-white/70 font-light leading-relaxed mb-6 relative z-10">
              Our interactive dashboard connects to a live backend inference engine. Select any coordinate in the North Indian Ocean to instantly receive a 3D thermodynamic volume, a thermal gradient (dT/dz), confidence intervals, and depth-layer climatology anomalies.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
