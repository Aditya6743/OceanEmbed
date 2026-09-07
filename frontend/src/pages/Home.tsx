import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EarthGlobe from '../components/EarthGlobe';
import { useOceanStore } from '../store/oceanStore';
import React from 'react';


import DataSection from '../components/landing/DataSection';
import ModelSection from '../components/landing/ModelSection';
import ResultsSection from '../components/landing/ResultsSection';
import AboutSection from '../components/landing/AboutSection';
import Footer from '../components/landing/Footer';

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
  const { error, errorPosition, setError } = useOceanStore();
  const selectedLocation = useOceanStore(state => state.selectedLocation);

  const handleExplore = () => {
    useOceanStore.getState().setAutoPilotMode(false);
    navigate('/explore');
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (error) setError(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [error, setError]);

  return (
    <div id="top" className="w-full bg-transparent overflow-x-hidden pt-14 font-sans select-none">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[calc(100vh-3.5rem)] flex items-center z-10">
        
        {/* MASSIVE EARTH LAYER BEHIND TEXT */}
        {/* By pinning to the left and extending width to 125vw, the center of the Canvas (Earth) shifts right to 62.5%, while the Canvas itself covers the entire left side so stars are everywhere! */}
        <div className="absolute top-0 bottom-0 left-0 w-[100vw] md:w-[125vw] z-0 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
            <Suspense fallback={null}>
              <EarthGlobe />
              <OrbitControls ref={controlsRef} 
                enablePan={false} 
                enableDamping={true} 
                dampingFactor={0.075} 
                rotateSpeed={0.8}
                enableZoom={false} 
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
                OceanEmbed uses Deep Learning to reconstruct the 3D thermodynamic volume of the North Indian Ocean directly from <span className="text-white font-medium">surface satellite telemetry.</span>
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
                onClick={() => navigate('/how-it-works')}
                className="px-8 py-4 text-white/70 hover:text-white text-[11px] tracking-[0.2em] font-semibold transition-colors"
              >
                PROJECT VISION
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

      {/* MODULAR LANDING PAGE SECTIONS */}
      <div className="relative w-full bg-[#050505]">

        
        <DataSection />
        <ModelSection />
        <ResultsSection />
        <AboutSection />
        <Footer />
      </div>
      
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
