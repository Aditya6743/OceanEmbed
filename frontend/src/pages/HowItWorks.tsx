import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [sequenceComplete, setSequenceComplete] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Boot up sequence: Light up cards one by one with a 1-second gap
    const t1 = setTimeout(() => setActiveCard(0), 800);
    const t2 = setTimeout(() => setActiveCard(1), 1800);
    const t3 = setTimeout(() => setActiveCard(2), 2800);
    const t4 = setTimeout(() => {
      setActiveCard(null);
      setSequenceComplete(true);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const cards = [
    {
      num: "01",
      label: "The Problem",
      title: "The Hidden Ocean",
      desc: "Satellites provide massive amounts of real-time data about the ocean's surface, but they cannot penetrate the water. The deep ocean, which drives global climate and cyclones, remains entirely hidden from space. Physical sensors like Argo floats leave massive geographical gaps."
    },
    {
      num: "02",
      label: "The Solution",
      title: "AI Reconstruction",
      desc: "OceanEmbed leverages advanced machine learning to bridge the gap. By learning the complex thermodynamic relationships between surface telemetry (SST, SSH, SSS, winds) and deep layers, we can generate continuous 3D ocean models entirely from satellite data."
    },
    {
      num: "03",
      label: "Our Prototype",
      title: "Live Inference",
      desc: "Our interactive dashboard connects to a live backend inference engine. Select any coordinate in the North Indian Ocean to instantly receive a 3D thermodynamic volume, thermal gradients (dT/dz), confidence intervals, and depth-layer climatology anomalies."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-32 relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-black/40 pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-24 anim-fade-scale">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Project Vision.</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From the core problem to our machine learning prototype, here is the complete breakdown of OceanEmbed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-2">
          
          {cards.map((card, i) => {
            const isActive = activeCard === i;

            return (
              <motion.div 
                key={card.num}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2, ease: [0.25, 1, 0.5, 1] }}
                
                className={`group relative flex flex-col rounded-3xl overflow-hidden backdrop-blur-2xl border transition-all duration-500 ${!sequenceComplete ? 'pointer-events-none' : ''}
                  ${isActive 
                    ? 'bg-cyan-950/30 border-cyan-500/40 -translate-y-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_20px_40px_rgba(8,145,178,0.2)]' 
                    : 'bg-slate-900/40 border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.5)]'}
                  hover:bg-cyan-950/30 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_20px_40px_rgba(8,145,178,0.2)]
                `}
              >
                {/* Animated Hover Background */}
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/10 transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                
                {/* Grid Mesh Overlay */}
                <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                
                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transition-transform duration-700 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>

                <div className="p-10 flex flex-col h-full relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`text-4xl font-black transition-colors duration-500 ${isActive ? 'text-cyan-500/20' : 'text-white/10 group-hover:text-cyan-500/20'}`}>
                      {card.num}
                    </div>
                    <div className={`px-3 py-1 rounded-full border transition-colors duration-500 ${isActive ? 'border-cyan-500/30 bg-cyan-500/10' : 'bg-white/5 border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10'}`}>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                        {card.label}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-4 tracking-tight transition-colors duration-500 ${isActive ? 'text-cyan-50' : 'text-white group-hover:text-cyan-50'}`}>
                    {card.title}
                  </h3>
                  <p className={`font-light leading-relaxed text-sm transition-colors duration-500 ${isActive ? 'text-white/70' : 'text-white/50 group-hover:text-white/70'}`}>
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
