import { Waves, GitBranch, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-32 px-8 md:px-16 lg:px-32 pb-24 font-sans relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Ambient glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="flex justify-center mb-10">
          <div className="w-24 h-24 rounded-3xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.15)]">
            <Waves className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
          Ocean<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Embed</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-16 max-w-2xl mx-auto">
          Bridging the gap between satellite oceanography and deep-sea thermodynamics using Artificial Intelligence.
        </p>

        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 md:p-16 text-left mb-16 shadow-2xl backdrop-blur-xl">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">The Mission</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-6 font-light">
            The ocean regulates the global climate, yet the vast majority of its volume remains unobserved in real-time. While satellites can scan the surface instantly, their radar cannot penetrate the depths. Conversely, Argo floats measure the depths perfectly, but they are far too sparse to provide a complete global picture.
          </p>
          <p className="text-white/60 text-lg leading-relaxed font-light">
            OceanEmbed was built to solve this physical limitation by learning the complex physics that govern how surface anomalies reflect deep-water structures. The result is a continuous, high-resolution 3D picture of the global ocean, generated entirely from surface observations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a href="#" className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-full transition-all duration-300">
            <GitBranch className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            <span className="font-semibold text-sm tracking-wide">GitHub Repository</span>
          </a>
          <a href="#" className="group flex items-center justify-center gap-3 px-8 py-4 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-900/50 hover:border-cyan-500/50 rounded-full text-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <Terminal className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide uppercase">API Documentation</span>
          </a>
        </div>
        
      </motion.div>
    </div>
  );
}
