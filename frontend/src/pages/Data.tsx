import { Database, Satellite, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';
import Background from '../components/Background';

export default function Data() {
  return (
    <div className="w-full min-h-screen bg-[#020202] text-white pt-32 px-8 md:px-16 lg:px-32 pb-24 font-sans relative overflow-hidden">
      
      {/* Reduced intensity Liquid Ether Background */}
      <Background />

      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none translate-x-1/3"></div>

      <div className="max-w-6xl mx-auto relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/30 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-[0.2em] mb-8 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <Database className="w-3.5 h-3.5" /> DATA PIPELINE
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter mb-6 leading-tight">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Datasets.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 font-light max-w-3xl mx-auto leading-relaxed">
            Fusing high-frequency satellite telemetry with sparse, high-fidelity subsurface ground truth measurements from the international Argo program.
          </p>
        </motion.div>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Satellite Data */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-500 p-10 lg:p-12 min-h-[400px] flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-950/50 border border-blue-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Satellite className="w-8 h-8 text-blue-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Copernicus / NOAA</h3>
              <p className="text-white/60 text-lg leading-relaxed font-light mb-8">
                The primary inference input. We extract gridded global coverage of the ocean surface from active satellite constellations, providing real-time boundaries for our physics models.
              </p>
              
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-xs font-mono text-white/80">SST</span>
                <span className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-xs font-mono text-white/80">SSH</span>
                <span className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-xs font-mono text-white/80">SSS</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Argo Floats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-500 p-10 lg:p-12 min-h-[400px] flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Anchor className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Argo Float Network</h3>
              <p className="text-white/60 text-lg leading-relaxed font-light mb-8">
                A global array of ~4,000 free-drifting profiling floats that dive and measure the water column down to 2,000 meters. This dataset serves as our critical ground-truth training label.
              </p>
              
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-xs font-mono text-white/80">0-2000m Depth</span>
                <span className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-xs font-mono text-white/80">Temperature</span>
                <span className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-xs font-mono text-white/80">Salinity</span>
              </div>
            </div>
          </motion.div>

        </div>
        </div>
      </div>
    </div>
  );
}
