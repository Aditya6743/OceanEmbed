import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section id="about" className="w-full pt-32 pb-40 relative z-10 bg-transparent overflow-hidden border-t border-white/5">
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
           <div className="flex items-center justify-center gap-4 mb-0">
             <div className="w-8 h-px bg-cyan-500/50"></div>
             <div className="text-cyan-400 font-mono text-xs md:text-sm tracking-[0.25em] font-bold uppercase drop-shadow-md">
               About The Project
             </div>
             <div className="w-8 h-px bg-cyan-500/50"></div>
           </div>
        </div>

        {/* Structured Text Content Inside a Minimal Elegant Box */}
        <div className="mb-20 max-w-6xl mx-auto relative z-20">
          <div className="p-10 md:p-14 rounded-[2rem] bg-transparent backdrop-blur-xl transform-gpu will-change-transform border border-white/10 shadow-2xl">
            
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-10 drop-shadow-2xl pb-2 leading-normal">
              Decoding the Deep Ocean.
            </h3>
            
            <div className="flex flex-col gap-8 text-left">
              <p className="text-xl md:text-2xl text-white font-medium leading-relaxed tracking-tight drop-shadow-md">
                Despite covering 71% of our planet, the deep ocean remains our largest data blind spot.
              </p>

              <p className="text-white/70 font-light leading-[1.8] text-base md:text-lg lg:text-xl drop-shadow-md">
                While traditional physical probes like <span className="text-white font-medium drop-shadow-lg">Argo floats</span> provide highly accurate profiles, they are incredibly expensive to deploy and maintain. This makes their global distribution <span className="text-cyan-400 font-medium drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">fundamentally sparse</span>, leaving massive geographical gaps in our understanding of ocean circulation and thermal heat storage. 
              </p>

              <p className="text-white/70 font-light leading-[1.8] text-base md:text-lg lg:text-xl drop-shadow-md border-l-2 border-cyan-500/40 pl-6 mt-2">
                <span className="text-white font-medium drop-shadow-lg">OceanEmbed</span> bypasses these physical limitations by acting as a neural interpolation layer. We engineered an AI-driven framework to reconstruct the deep 3D thermodynamic volume of the ocean entirely from dense, non-invasive satellite surface observations, delivering a scalable and continuous intelligence layer for the North Indian Ocean.
              </p>
            </div>

          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-4">
          <button 
            onClick={() => { window.scrollTo(0, 0); navigate('/how-it-works'); }}
            className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all backdrop-blur-md transform-gpu will-change-transform shadow-lg w-full sm:w-auto justify-center"
          >
            <span>Read Full Project Vision</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => { window.scrollTo(0, 0); navigate('/solutions'); }}
            className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all backdrop-blur-md transform-gpu will-change-transform shadow-lg w-full sm:w-auto justify-center"
          >
            <span>View Our Solutions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
