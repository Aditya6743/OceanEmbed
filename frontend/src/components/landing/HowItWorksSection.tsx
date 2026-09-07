import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const steps = [
    { num: "01", title: "COLLECT", desc: "Daily satellite and ocean observations are collected across the North Indian Ocean." },
    { num: "02", title: "HARMONIZE", desc: "Different datasets are standardized to a common spatial and temporal framework." },
    { num: "03", title: "EMBED", desc: "Deep learning transforms multidimensional surface observations into compact representations of ocean dynamics." },
    { num: "04", title: "RECONSTRUCT", desc: "The model estimates the temperature profile across standard ocean depths." }
  ];

  return (
    <section id="how-it-works" className="w-full py-32 relative z-10 bg-transparent border-t border-white/5 overflow-hidden">
      {/* Wave-like glowing background */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(34,211,238,0.05)_0,rgba(0,0,0,0)_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">METHODOLOGY</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          
          {steps.map((step, i) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative flex flex-col items-center md:items-start text-center md:text-left z-10 group"
            >
              <div className="w-24 h-24 rounded-full bg-transparent border border-white/10 flex items-center justify-center text-2xl font-light text-white font-mono mb-8 relative transition-transform duration-500 group-hover:scale-105 shadow-2xl backdrop-blur-sm">
                {step.num}
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/0 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-500"></div>
              </div>
              <h3 className="text-cyan-50 font-mono tracking-widest text-sm mb-4 group-hover:text-cyan-300 transition-colors">{step.title}</h3>
              <p className="text-white/50 font-light text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
