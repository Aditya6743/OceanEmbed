import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EarthGlobe from '../components/EarthGlobe';
import { useOceanStore } from '../store/oceanStore';
import React from 'react';

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function CameraRig({ controlsRef }: { controlsRef: any }) {
  const error = useOceanStore(state => state.error);
  const isAnimating = React.useRef(false);
  
  React.useEffect(() => {
    if (error && error.toLowerCase().includes("out of bounds")) {
      isAnimating.current = true;
      const t = setTimeout(() => { isAnimating.current = false; }, 1500);
      return () => clearTimeout(t);
    }
  }, [error]);

  useFrame((state) => {
    if (isAnimating.current && controlsRef.current) {
      state.camera.position.lerp(new THREE.Vector3(0, 0, 5.5), 0.1);
      state.camera.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  });
  return null;
}


export default function Home() {

  const navigate = useNavigate();
  const controlsRef = React.useRef(null);
  const { error, errorPosition } = useOceanStore();
  const selectedLocation = useOceanStore(state => state.selectedLocation);

  const handleExplore = () => {
    navigate('/explore');
  };

  return (
    <div className="w-full bg-[#050505] overflow-x-hidden pt-14 font-sans select-none">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[calc(100vh-3.5rem)] flex items-center z-10">
        
        {/* MASSIVE EARTH LAYER BEHIND TEXT */}
        {/* By pinning to the left and extending width to 125vw, the center of the Canvas (Earth) shifts right to 62.5%, while the Canvas itself covers the entire left side so stars are everywhere! */}
        <div className="absolute top-0 bottom-0 left-0 w-[100vw] md:w-[125vw] z-0 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
            <Suspense fallback={null}>
              <EarthGlobe />
              <OrbitControls ref={controlsRef} 
                enablePan={false} 
                enableDamping={true} 
                dampingFactor={0.075} 
                rotateSpeed={0.8}
                enableZoom={true} 
                minDistance={4.8} 
                maxDistance={5.5}
                autoRotate={!selectedLocation}
                autoRotateSpeed={0.3}
              />
              <CameraRig controlsRef={controlsRef} />
            </Suspense>
          </Canvas>
          
        </div>

        {/* FOREGROUND CONTENT */}
        <div className="relative z-10 w-full pl-12 md:pl-24 xl:pl-32 pr-8 pointer-events-none flex flex-col justify-center h-full">
          
          {/* STRICTLY LEFT ALIGNED, CONTROLLED WIDTH BLOCK */}
          <div className="w-full max-w-[520px] flex flex-col pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Heading with extreme tightness and OCEAN. as cyan accent */}
              <h1 className="text-6xl md:text-7xl lg:text-[80px] font-black tracking-tighter text-white mb-7 leading-[0.85] drop-shadow-2xl flex flex-col">
                <span>RECONSTRUCTING</span>
                <span>THE HIDDEN</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">OCEAN.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 font-light mb-10 leading-relaxed drop-shadow-lg">
                OceanEmbed uses satellite observations and Argo measurements to estimate how ocean temperature changes <span className="text-white font-medium">deep below the surface.</span>
              </p>
            </motion.div>

            {/* CTAs strictly aligned left */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex items-center gap-4 mb-14 pointer-events-auto"
            >
              <button 
                onClick={handleExplore}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] tracking-[0.2em] font-bold rounded-sm transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]"
              >
                <span>EXPLORE OCEAN</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button 
                onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-white/70 hover:text-white text-[11px] tracking-[0.2em] font-semibold transition-colors"
              >
                HOW IT WORKS
              </button>
            </motion.div>

            {/* Refined, compact Location HUD strictly aligned left */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="w-full bg-black/40 border border-white/10 rounded-sm p-6 backdrop-blur-md shadow-2xl relative overflow-hidden pointer-events-auto"
            >
              {/* Subtle edge highlight */}
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
              
              <div className="flex items-center gap-3 text-[10px] text-cyan-400 font-mono tracking-[0.2em] uppercase mb-5 pl-3">
                <Crosshair className={`w-4 h-4 ${selectedLocation ? 'animate-none' : 'animate-pulse'}`} />
                {selectedLocation ? 'TARGET ACQUIRED' : 'SELECT AN OCEAN LOCATION'}
              </div>
              
              <div className="grid grid-cols-2 gap-y-5 gap-x-5 pl-3">
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em] mb-1.5">LATITUDE</div>
                  <div className="text-white font-mono text-base tracking-wider">
                    {selectedLocation ? `${selectedLocation.latitude}° N` : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em] mb-1.5">LONGITUDE</div>
                  <div className="text-white font-mono text-base tracking-wider">
                    {selectedLocation ? `${selectedLocation.longitude}° E` : '—'}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em] mb-1.5">REGION</div>
                  <div className="text-cyan-50 text-sm font-semibold tracking-widest uppercase">
                    {selectedLocation ? selectedLocation.region : 'AWAITING SELECTION...'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Earth Annotations Anchored to the Globe */}
          <div className="hidden md:flex absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 flex-col gap-16 pointer-events-none">
            <div className="flex items-center gap-4 justify-end group opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-32 lg:w-48 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-500/80 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              </div>
              <div className="text-right w-32">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em]">SURFACE DATA</div>
                <div className="text-[11px] text-white/60 font-mono mt-1 tracking-widest">SST / SSH / SSS</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 justify-end group opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-40 lg:w-64 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-500/80 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              </div>
              <div className="text-right w-32">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em]">PREDICTION</div>
                <div className="text-[11px] text-white/60 font-mono mt-1 tracking-widest">0m — 2000m</div>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-end group opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-24 lg:w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-500/80 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              </div>
              <div className="text-right w-32">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em]">STATUS</div>
                <div className="text-[11px] text-cyan-500 font-mono mt-1 tracking-widest flex items-center gap-1.5 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE OCEAN WE CAN'T SEE SECTION */}
      <section id="problem-section" className="w-full py-32 relative z-10 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-8 lg:px-16 max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-24 tracking-tight">
            The ocean we can't see.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">The Problem</div>
              <p className="text-white/80 leading-relaxed mb-6 font-light text-lg">
                Satellites continuously observe the ocean surface, but they <span className="text-white font-medium">cannot directly observe the temperature structure</span> deep below it.
              </p>
              <p className="text-white/50 leading-relaxed font-light">
                Argo floats provide valuable subsurface measurements, but their observations are spatially and temporally sparse across the vast global ocean.
              </p>
            </div>
            
            <div className="p-8 md:p-12 rounded-3xl bg-cyan-950/20 border border-cyan-900/30">
              <div className="text-xs font-medium text-cyan-400 uppercase tracking-widest mb-6">The Solution</div>
              <p className="text-white/90 leading-relaxed mb-10 font-light text-lg">
                OceanEmbed learns the complex relationship between surface observations and subsurface temperature profiles.
              </p>
              
              <div className="flex flex-col gap-3 text-sm font-mono text-white/70">
                <div className="bg-black/40 px-4 py-3 rounded-xl border border-white/5">1. SATELLITE INPUT (SST, SSH, SSS)</div>
                <div className="pl-6 text-cyan-500/50">↓</div>
                <div className="bg-cyan-950/40 px-4 py-3 rounded-xl border border-cyan-900/50 text-cyan-300">2. OCEANEMBED INFERENCE</div>
                <div className="pl-6 text-cyan-500/50">↓</div>
                <div className="bg-black/40 px-4 py-3 rounded-xl border border-white/5">3. FULL DEPTH PROFILE (0-2000m)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSURFACE PREVIEW SECTION */}
      <section className="w-full py-32 md:py-48 relative z-10 bg-[#050505] text-center flex flex-col items-center border-t border-white/5">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
          Visualizing the depths.
        </h2>
        <p className="text-white/50 font-light max-w-2xl mx-auto mb-12 px-6 text-lg leading-relaxed">
          The deep learning framework predicts a 1D temperature profile representing depths from 0m to 2000m, transformed into an interactive 3D water column for scientific analysis.
        </p>
        <button 
          onClick={handleExplore}
          className="px-8 py-4 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
        >
          Start Exploration
        </button>
      </section>
      
      {/* FLOATING CURSOR ERROR */}
      {error && errorPosition && (
        <div 
          className="fixed z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ 
            left: errorPosition.x + 20, 
            top: errorPosition.y - 20 
          }}
        >
          <div className="bg-black/80 backdrop-blur-md border border-red-500/40 rounded-sm py-1.5 px-3 shadow-[0_0_20px_rgba(220,38,38,0.2)] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 font-mono text-[9px] tracking-widest uppercase font-bold whitespace-nowrap">
              {error}
            </span>
          </div>
          <div className="text-white/40 font-mono text-[8px] tracking-wider uppercase mt-1 pl-1 whitespace-nowrap">
            Telemetry rejected.
          </div>
        </div>
      )}
    </div>
  );
}
