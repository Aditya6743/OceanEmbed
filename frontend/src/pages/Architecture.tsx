import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { ChevronLeft, Box, Layers, Play, Pause, RotateCcw } from 'lucide-react';

const GlobalState = { 
  explodedProgress: 0,
  activeModule: null as number | null
};

// --------------------------------------------------------
// PREMIUM MATERIALS
// --------------------------------------------------------

// --------------------------------------------------------
// PRE-COMPUTED GEOMETRIES & MATERIALS (ULTRA PERFORMANCE)
// --------------------------------------------------------
const GEO = {
  surface: new THREE.BoxGeometry(0.08, 5.0, 5.0),
  harmonize: new THREE.BoxGeometry(0.15, 5.0, 5.0),
  core: new THREE.BoxGeometry(0.5, 5.0, 5.0),
  decoder: new THREE.BoxGeometry(0.1, 5.0, 5.0),
  volumetric: new THREE.BoxGeometry(0.04, 5.0, 5.0),
  particle: new THREE.BoxGeometry(0.06, 0.06, 0.06) // Tiny boxes instead of heavy spheres
};

const MAT = {
  graphite: new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.8, metalness: 0.2 }),
  graphiteLight: new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6, metalness: 0.3 }),
  glassDark: new THREE.MeshStandardMaterial({ color: '#020617', transparent: true, opacity: 0.7, roughness: 0.2, depthWrite: false }),
  layerCyan: new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.25, depthWrite: false }),
  glowCyan: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#06b6d4', emissiveIntensity: 0.8 }),
  connector: new THREE.MeshBasicMaterial({ color: '#475569' })
};

// --------------------------------------------------------
// SPRING LERP HELPER
// --------------------------------------------------------
function AnimGroup({ aPos, ePos, progress, children, position, ...props }: any) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (ref.current) {
      // Progress is already globally smoothed, so we perfectly sync to it without double-lag
      ref.current.position.x = aPos[0] + (ePos[0] - aPos[0]) * progress;
      ref.current.position.y = aPos[1] + (ePos[1] - aPos[1]) * progress;
      ref.current.position.z = aPos[2] + (ePos[2] - aPos[2]) * progress;
    }
  });
  
  // Mount exactly at the initial assembled position (or override) to prevent frame-0 glitch flashes
  return <group ref={ref} position={position || aPos} {...props}>{children}</group>;
}

// --------------------------------------------------------
// MODULE COMPONENTS (FLAWLESS MATHEMATICAL FUSION)
// --------------------------------------------------------

function ModuleSurfaceInput({ p }: { p: number }) {
  // 5 observation layers (Thickness 0.08)
  const aX = [-0.16, -0.08, 0, 0.08, 0.16];
  const eX = [-0.8, -0.4, 0, 0.4, 0.8];
  return (
    <group>
      {aX.map((x, i) => (
        <AnimGroup key={i} aPos={[x, 0, 0]} ePos={[eX[i], 0, 0]} progress={p}>
          <mesh geometry={GEO.surface} material={MAT.graphiteLight}>
            <Edges color="#334155" opacity={0.6} transparent />
          </mesh>
        </AnimGroup>
      ))}
    </group>
  );
}

function ModuleHarmonization({ p }: { p: number }) {
  // 3 thicker converging layers (Thickness 0.15)
  const aX = [-0.15, 0, 0.15];
  const eX = [-0.6, 0, 0.6];
  return (
    <group>
      {aX.map((x, i) => (
        <AnimGroup key={i} aPos={[x, 0, 0]} ePos={[eX[i], 0, 0]} progress={p}>
          <mesh geometry={GEO.harmonize} material={MAT.graphite}>
            <Edges color="#475569" />
          </mesh>
        </AnimGroup>
      ))}
    </group>
  );
}

function ModuleEmbeddingCore({ p }: { p: number }) {
  // Centerpiece. 4 thick core layers (Thickness 0.15)
  const aX = [-0.225, -0.075, 0.075, 0.225];
  const eX = [-0.9, -0.3, 0.3, 0.9];
  return (
    <group>
      <AnimGroup aPos={[aX[0], 0, 0]} ePos={[eX[0], 0, 0]} progress={p}>
        <mesh geometry={GEO.harmonize} material={MAT.graphite}><Edges color="#1e293b" /></mesh>
      </AnimGroup>
      <AnimGroup aPos={[aX[1], 0, 0]} ePos={[eX[1], 0, 0]} progress={p}>
        <mesh material={MAT.graphiteLight}><boxGeometry args={[0.15, 5.0, 5.0]} /><Edges color="#334155" /></mesh>
      </AnimGroup>
      <AnimGroup aPos={[aX[2], 0, 0]} ePos={[eX[2], 0, 0]} progress={p}>
        <mesh material={MAT.glowCyan}><boxGeometry args={[0.15, 5.0, 5.0]} /></mesh>
      </AnimGroup>
      <AnimGroup aPos={[aX[3], 0, 0]} ePos={[eX[3], 0, 0]} progress={p}>
        <mesh material={MAT.glassDark}><boxGeometry args={[0.15, 5.0, 5.0]} /><Edges color="#06b6d4" opacity={0.5} transparent /></mesh>
      </AnimGroup>
    </group>
  );
}

function ModuleReconstruction({ p }: { p: number }) {
  // Expanding outward on Z (depth) while sitting side-by-side on X
  const aX = [-0.1, 0, 0.1];
  const eX = [-0.6, 0, 0.6];
  return (
    <group>
      {aX.map((x, i) => (
        <AnimGroup key={i} aPos={[x, 0, 0]} ePos={[eX[i], 0, 0]} progress={p}>
          <mesh material={MAT.graphiteLight}>
            <boxGeometry args={[0.1, 5.0, 5.0]} />
            <Edges color="#475569" />
          </mesh>
        </AnimGroup>
      ))}
    </group>
  );
}

function ModuleVolumetricOutput({ p }: { p: number }) {
  // 15 layers of ocean volume, side-by-side on X
  return (
    <group>
      {Array.from({ length: 15 }).map((_, i) => {
        const aX = -0.7 + (i * 0.1);
        const eX = -1.75 + (i * 0.25);
        return (
          <AnimGroup key={i} aPos={[aX, 0, 0]} ePos={[eX, 0, 0]} progress={p}>
            <mesh material={MAT.glassDark}>
              <boxGeometry args={[0.03, 5.0, 5.0]} />
              <Edges color="#22d3ee" opacity={0.6} transparent />
            </mesh>
          </AnimGroup>
        );
      })}
    </group>
  );
}

// --------------------------------------------------------
// CONNECTORS & DATA FLOW
// --------------------------------------------------------
function DataFlow() {
  const groupRef = useRef<THREE.Group>(null);
  
  const tracks = useRef(Array.from({ length: 40 }).map(() => ({
    y: (Math.random() - 0.5) * 2.2,
    z: (Math.random() - 0.5) * 2.2,
    speed: 3.0 + Math.random() * 3.0,
    offset: Math.random() * 19.32
  })));

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const p = GlobalState.explodedProgress;
    
    groupRef.current.children.forEach((mesh: any, i) => {
      const t = tracks.current[i];
      const x = -9.16 + ((time * t.speed + t.offset) % 19.32);
      mesh.position.set(x, t.y, t.z);
      
      mesh.scale.setScalar(Math.max(0.001, p));
      if (mesh.material) {
        mesh.material.opacity = p * 0.9;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {tracks.current.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
// --------------------------------------------------------
// LABELS
// --------------------------------------------------------

function StageLabel({ title, sub, pos, align = 'bottom', p }: any) {
  const isTop = align === 'top';
  const aYEnd = isTop ? 3.2 : -3.2;
  const eYEnd = isTop ? 3.8 : -3.8;

  const htmlRef = useRef<HTMLDivElement>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    const currentP = GlobalState.explodedProgress;
    
    if (htmlRef.current) {
      htmlRef.current.style.opacity = Math.max(0, currentP - 0.1).toString();
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = currentP * 0.6;
    }
  });

  return (
    <AnimGroup aPos={[0,0,0]} ePos={[0,0,0]} progress={p} position={pos}>
      <AnimGroup aPos={[0, aYEnd, 0]} ePos={[0, eYEnd, 0]} progress={p}>
        <Html position={[0, 0.2 * (isTop ? 1 : -1), 0]} center zIndexRange={[100, 0]}>
          <div ref={htmlRef} className="w-56 text-center pointer-events-none drop-shadow-lg" style={{ opacity: 0 }}>
            <div className="text-white text-[11px] font-sans font-bold border-b border-cyan-500/40 pb-1 mb-1 tracking-wider uppercase drop-shadow-md">
              {title}
            </div>
            <div className="text-cyan-400/90 text-[9px] uppercase font-mono tracking-widest">{sub}</div>
          </div>
        </Html>
      </AnimGroup>
      
      <AnimGroup aPos={[0,0,0]} ePos={[0,0,0]} progress={p} position={[0,0,0]}>
        <mesh>
          <line>
            <bufferGeometry attach="geometry" setFromPoints={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, eYEnd, 0)]} />
            <lineBasicMaterial ref={lineMatRef} color="#475569" transparent opacity={0} />
          </line>
        </mesh>
      </AnimGroup>
    </AnimGroup>
  );
}
// --------------------------------------------------------
// TOUR DATA & CAMERA RIG
// --------------------------------------------------------
const TOUR_DATA = [
  { title: "01 SURFACE INPUT", desc: "Aggregates multi-modal satellite altimetry, sea surface temperature, and surface wind data." },
  { title: "02 HARMONIZATION", desc: "Spatially and temporally aligns the diverse surface sensor inputs into a unified grid." },
  { title: "03 EMBEDDING CORE", desc: "Deep attention networks map surface observations into a high-dimensional subsurface latent space." },
  { title: "04 RECONSTRUCTION", desc: "Translates the latent embeddings back into precise volumetric thermal and current gradients." },
  { title: "05 VOLUMETRIC OUTPUT", desc: "Delivers 15 discrete, high-resolution depth layers spanning from the surface down to 1000m." }
];

function CameraRig({ tourStep, controlsRef }: { tourStep: number | null, controlsRef: any }) {
  const E_X = [-9.0, -4.5, 0, 4.5, 10.0];
  const rigState = useRef({ isReturning: false });
  
  useFrame((state) => {
    if (controlsRef.current) {
      if (tourStep !== null && tourStep <= 4) {
        rigState.current.isReturning = true;
        const targetX = E_X[tourStep];
        controlsRef.current.target.lerp(new THREE.Vector3(targetX, 0, 0), 0.04);
        const targetCam = new THREE.Vector3(targetX, 5, 14);
        state.camera.position.lerp(targetCam, 0.03);
      } else if (rigState.current.isReturning) {
        controlsRef.current.target.lerp(new THREE.Vector3(0.45, 0, 0), 0.04);
        const targetCam = new THREE.Vector3(0.45, 7.5, 20);
        state.camera.position.lerp(targetCam, 0.04);
        
        if (state.camera.position.distanceTo(targetCam) < 0.5) {
           rigState.current.isReturning = false;
        }
      }
    }
  });
  return null;
}

// --------------------------------------------------------
// ARCHITECTURE SYSTEM PIPELINE
// --------------------------------------------------------
function OceanEmbedSystem({ isExploded, onModuleClick }: { isExploded: boolean, onModuleClick: (idx: number) => void }) {
  const refs = Array.from({ length: 5 }).map(() => useRef<THREE.Group>(null));
  
  const A_X = [-0.95, -0.525, 0, 0.45, 1.315];
  const E_X = [-9.0, -4.5, 0, 4.5, 10.0];

  useFrame(() => {
    const target = isExploded ? 1 : 0;
    GlobalState.explodedProgress += (target - GlobalState.explodedProgress) * 0.08;
    const p = GlobalState.explodedProgress;

    refs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.position.x = A_X[i] + (E_X[i] - A_X[i]) * p;
      }
    });
  });

  const handlePointerOver = () => { if (isExploded) document.body.style.cursor = 'pointer'; };
  const handlePointerOut = () => document.body.style.cursor = 'auto';

  return (
    <group>
      <DataFlow />

      <group position={[-0.95, 0, 0]} ref={refs[0]} onClick={(e) => { if (e.delta <= 5) { e.stopPropagation(); onModuleClick(0); } }} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <ModuleSurfaceInput p={GlobalState.explodedProgress} />
        <StageLabel title="01 SURFACE INPUT" sub="SST · SSS · SSH · Currents · Winds" pos={[0, 0, 0]} align="bottom" p={GlobalState.explodedProgress} />
      </group>

      <group position={[-0.525, 0, 0]} ref={refs[1]} onClick={(e) => { if (e.delta <= 5) { e.stopPropagation(); onModuleClick(1); } }} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <ModuleHarmonization p={GlobalState.explodedProgress} />
        <StageLabel title="02 HARMONIZATION" sub="Spatial + Temporal Alignment" pos={[0, 0, 0]} align="top" p={GlobalState.explodedProgress} />
      </group>

      <group position={[0, 0, 0]} ref={refs[2]} onClick={(e) => { if (e.delta <= 5) { e.stopPropagation(); onModuleClick(2); } }} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <ModuleEmbeddingCore p={GlobalState.explodedProgress} />
        <StageLabel title="03 EMBEDDING CORE" sub="CNN · ViT · Attention · PINN" pos={[0, 0, 0]} align="bottom" p={GlobalState.explodedProgress} />
      </group>

      <group position={[0.45, 0, 0]} ref={refs[3]} onClick={(e) => { if (e.delta <= 5) { e.stopPropagation(); onModuleClick(3); } }} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <ModuleReconstruction p={GlobalState.explodedProgress} />
        <StageLabel title="04 RECONSTRUCTION DECODER" sub="Nonlinear Deep-Ocean Mapping" pos={[0, 0, 0]} align="top" p={GlobalState.explodedProgress} />
      </group>

      <group position={[1.315, 0, 0]} ref={refs[4]} onClick={(e) => { if (e.delta <= 5) { e.stopPropagation(); onModuleClick(4); } }} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <ModuleVolumetricOutput p={GlobalState.explodedProgress} />
        <StageLabel title="05 VOLUMETRIC OUTPUT" sub="15 Depth Levels · 0–1000 m" pos={[0, 0, 0]} align="bottom" p={GlobalState.explodedProgress} />
      </group>
    </group>
  );
}

// --------------------------------------------------------
// MAIN PAGE VIEW
// --------------------------------------------------------
export default function Architecture() {
  const [isExploded, setIsExploded] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [isTouring, setIsTouring] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsExploded(true), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isTouring || activeModule === null) return;
    
    if (activeModule > 4) {
      const timer = setTimeout(() => {
        setIsTouring(false);
        setActiveModule(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
    
    const timer = setTimeout(() => {
      setActiveModule(activeModule + 1);
    }, 5500);
    
    return () => clearTimeout(timer);
  }, [activeModule, isTouring]);

  const handlePlayTour = () => {
    if (isTouring) {
       setIsTouring(false);
       setActiveModule(null);
    } else {
       setIsExploded(true);
       setIsTouring(true);
       // Wait 1.2s for the mechanical explosion to finish before the camera swoops in
       setTimeout(() => {
           setActiveModule(0);
       }, 1200);
    }
  };

  const handleModuleClick = (idx: number) => {
    if (!isExploded) return;
    setIsTouring(false);
    setActiveModule(idx);
  };

  const handlePointerMissed = () => {
    // If they click the background, exit active focus but stay exploded
    setIsTouring(false);
    setActiveModule(null);
  };

  return (
    <main className="relative w-full h-screen bg-transparent overflow-hidden font-sans pt-14 selection:bg-cyan-500/30">
      
      <div className="absolute inset-0 z-0 bg-[#020617]/30 backdrop-blur-[8px] pointer-events-none" />

      <div className="absolute top-24 left-8 md:left-12 z-20 pointer-events-none max-w-sm animate-in fade-in slide-in-from-left-8 duration-1000 ease-out fill-mode-both delay-300">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] font-mono font-bold tracking-[0.2em] mb-6 pointer-events-auto transition-colors">
          <ChevronLeft className="w-3 h-3" /> RETURN
        </Link>
        <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight mb-2">
          EXPLORE THE <span className="font-semibold text-cyan-400">ARCHITECTURE</span>
        </h1>
        <p className="text-white/60 text-xs font-mono tracking-wide">
          From surface observations to subsurface ocean reconstruction.
        </p>
      </div>

      <div className="absolute inset-0 z-10 translate-y-12">
        <Canvas camera={{ position: [0.45, 7.5, 20], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} dpr={[1, 1.5]} performance={{ min: 0.5 }} onPointerMissed={handlePointerMissed}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
          
          <OceanEmbedSystem isExploded={isExploded} onModuleClick={handleModuleClick} />
          <CameraRig tourStep={activeModule} controlsRef={controlsRef} />

          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            enablePan={true}
            enableZoom={false}
            minDistance={4} 
            maxDistance={35} 
            maxPolarAngle={Math.PI / 1.5} 
            autoRotate={false} 
            target={[0.45, 0, 0]}
          />
        </Canvas>
      </div>
      {/* Fixed 2D Assembled Label */}
      <div className={`absolute top-44 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-700 ease-out ${(!isExploded && activeModule === null && !isTouring) ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-4'}`}>
        <div className="w-72 text-center drop-shadow-2xl">
          <div className="text-white text-[13px] font-sans font-bold border-b border-cyan-500/80 pb-1.5 mb-1.5 tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
            OCEANEMBED CORE
          </div>
          <div className="text-cyan-300/90 text-[10px] uppercase font-mono tracking-[0.2em]">Unified Deep-Ocean Processor</div>
        </div>
      </div>


      {activeModule !== null && activeModule <= 4 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 w-80 bg-[#0f172a]/90 backdrop-blur-md border border-cyan-500/30 p-5 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.2)] text-center transition-all animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-700 ease-out">
          <div className="text-cyan-400 text-[10px] font-mono font-bold tracking-[0.2em] mb-2">{TOUR_DATA[activeModule].title}</div>
          <div className="text-white/80 text-xs leading-relaxed">{TOUR_DATA[activeModule].desc}</div>
        </div>
      )}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#0f172a]/90 backdrop-blur-md rounded-full p-1.5 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => { setIsExploded(false); setActiveModule(null); setIsTouring(false); }} 
          className={`px-6 py-2 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 ${!isExploded && activeModule === null && !isTouring ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:text-white border border-transparent'}`}
        >
          <Box className="w-3.5 h-3.5" /> Assembled
        </button>
        <button 
          onClick={() => { setIsExploded(true); setActiveModule(null); setIsTouring(false); }} 
          className={`px-6 py-2 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 ${isExploded && activeModule === null && !isTouring ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:text-white border border-transparent'}`}
        >
          <Layers className="w-3.5 h-3.5" /> Exploded
        </button>
        
        <div className="w-px h-5 bg-white/10 mx-2"></div>
        
        <button onClick={handlePlayTour} className={`p-2 rounded-full transition-colors ${isTouring ? 'text-cyan-400 bg-white/5' : 'text-white/40 hover:text-white'}`} title="Tour Architecture">
          {isTouring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => { setIsTouring(false); setActiveModule(null); if(controlsRef.current) controlsRef.current.reset(); }} className="p-2 rounded-full text-white/40 hover:text-white transition-colors" title="Reset View">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

    </main>
  );
}