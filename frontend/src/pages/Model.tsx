import { BrainCircuit, Layers, Network, Zap, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Background from '../components/Background';

export default function Model() {
  return (
    <div className="w-full min-h-screen bg-[#020202] text-white pt-32 px-8 md:px-16 lg:px-32 pb-24 font-sans relative overflow-hidden">
      
      {/* Reduced intensity Liquid Ether Background */}
      <Background />

      {/* Ambient glowing orbs - kept for extra depth */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-[0.2em] mb-8 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <Network className="w-3.5 h-3.5" /> NEURAL ARCHITECTURE
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter mb-6 leading-tight">
            Deep Ocean <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Intelligence.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 font-light max-w-3xl mx-auto leading-relaxed">
            A state-of-the-art Multi-Layer Perceptron (MLP) trained to reconstruct 3D subsurface thermodynamics from 2D satellite surface observations.
          </p>
        </motion.div>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Large Span */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500 p-10 flex flex-col justify-between min-h-[300px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div>
              <Layers className="w-10 h-10 text-cyan-400 mb-6" strokeWidth={1.5} />
              <h3 className="text-3xl font-bold mb-4 tracking-tight">The Input Layer</h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl font-light">
                The network accepts extremely high-resolution, multi-modal satellite telemetry. We fuse Sea Surface Temperature (SST), Sea Surface Height anomalies (SSH), and Sea Surface Salinity (SSS) alongside geospatial encodings.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Small Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl bg-cyan-950/20 border border-cyan-900/30 hover:border-cyan-500/40 transition-all duration-500 p-10 flex flex-col justify-between min-h-[300px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-400/20 transition-colors duration-500"></div>
            <div>
              <BrainCircuit className="w-10 h-10 text-cyan-300 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4 tracking-tight">MLP Core</h3>
              <p className="text-cyan-100/60 leading-relaxed font-light">
                Residual connections and self-attention mechanisms prevent vanishing gradients across deep thermodynamic layers.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Small Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 p-10 flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <Zap className="w-10 h-10 text-white/80 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4 tracking-tight">A100 Training</h3>
              <p className="text-white/60 leading-relaxed font-light">
                Trained on clustered A100 GPUs using PyTorch, processing over 2 million historical Argo profiles for convergence.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Large Span (Physics Informed) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 p-10 flex flex-col justify-between min-h-[300px]"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Activity className="w-48 h-48" strokeWidth={0.5} />
            </div>
            <div className="relative z-10">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" strokeWidth={1.5} />
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Physics-Informed Loss</h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl font-light mb-8">
                A pure neural network cannot learn physics by itself. We constrain the network using a custom thermodynamic loss function that heavily penalizes temperature inversions, ensuring the predicted thermocline is physically stable.
              </p>
              
              {/* Premium Code Snippet Box */}
              <div className="bg-black/80 border border-white/10 rounded-xl p-6 font-mono text-sm overflow-x-auto shadow-2xl">
                <span className="text-emerald-400">def</span> <span className="text-blue-400">thermodynamic_loss</span>(y_pred, y_true, gradient):
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;mse = MSE(y_pred, y_true)
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;penalty = λ * <span className="text-amber-300">PhysicsPenalty</span>(∇y_pred)
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">return</span> mse + penalty
              </div>
            </div>
          </motion.div>

        </div>
        </div>
      </div>
    </div>
  );
}
