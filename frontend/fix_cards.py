with open("src/pages/HowItWorks.tsx", "r") as f:
    content = f.read()

import re
# Use split on a distinct marker instead of regex
parts = content.split('<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">')
top = parts[0]

premium_cards = """<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: The Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
            className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(8,145,178,0.15)]"
          >
            {/* Animated Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            {/* Grid Mesh Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="text-4xl font-black text-white/10 group-hover:text-cyan-500/20 transition-colors duration-500">01</div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors duration-500">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">The Problem</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-cyan-50 transition-colors">The Hidden Ocean</h3>
              <p className="text-white/50 font-light leading-relaxed text-sm group-hover:text-white/70 transition-colors duration-500">
                Satellites provide massive amounts of real-time data about the ocean's surface, but they cannot penetrate the water. The deep ocean, which drives global climate and cyclones, remains entirely hidden from space. Physical sensors like Argo floats leave massive geographical gaps.
              </p>
            </div>
          </motion.div>

          {/* Card 2: The Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(8,145,178,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="text-4xl font-black text-white/10 group-hover:text-cyan-500/20 transition-colors duration-500">02</div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors duration-500">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">The Solution</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-cyan-50 transition-colors">AI Reconstruction</h3>
              <p className="text-white/50 font-light leading-relaxed text-sm group-hover:text-white/70 transition-colors duration-500">
                OceanEmbed leverages advanced machine learning to bridge the gap. By learning the complex thermodynamic relationships between surface telemetry (SST, SSH, SSS, winds) and deep layers, we can generate continuous 3D ocean models entirely from satellite data.
              </p>
            </div>
          </motion.div>

          {/* Card 3: The Prototype */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(8,145,178,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="text-4xl font-black text-white/10 group-hover:text-cyan-500/20 transition-colors duration-500">03</div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors duration-500">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">Our Prototype</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-cyan-50 transition-colors">Live Inference</h3>
              <p className="text-white/50 font-light leading-relaxed text-sm group-hover:text-white/70 transition-colors duration-500">
                Our interactive dashboard connects to a live backend inference engine. Select any coordinate in the North Indian Ocean to instantly receive a 3D thermodynamic volume, thermal gradients (dT/dz), confidence intervals, and depth-layer climatology anomalies.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}"""

with open("src/pages/HowItWorks.tsx", "w") as f:
    f.write(top + premium_cards)
