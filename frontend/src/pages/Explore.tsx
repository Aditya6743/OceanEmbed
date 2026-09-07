import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Crosshair, Activity, BrainCircuit, Zap, Scan, X, Download, Maximize2, Minimize2 } from 'lucide-react';
import EarthGlobe from '../components/EarthGlobe';
import TemperatureChart from '../components/TemperatureChart';
import Ocean3D from '../components/Ocean3D';
import HistoryChart from '../components/HistoryChart';
import { useOceanStore } from '../store/oceanStore';
import { fetchOceanPrediction, fetchHistory, type HistoryDataPoint } from '../lib/api';
import { startAutoPilot, stopAutoPilot } from '../lib/autopilot';

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


export default function Explore() {

  const { selectedLocation, prediction, isLoading, error, errorPosition, selectedDate, setSelectedDate, setIsLoading, setPrediction, reset, setError, autoPilotMode } = useOceanStore();
  const [loadingStep, setLoadingStep] = useState(0);
  const [historyData, setHistoryData] = React.useState<HistoryDataPoint[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const controlsRef = React.useRef(null);

  useEffect(() => {
    if (autoPilotMode) {
      startAutoPilot();
    }
  }, [autoPilotMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (error) setError(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [error, setError]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    
    const steps = [
      setTimeout(() => setLoadingStep(1), 600),
      setTimeout(() => setLoadingStep(2), 1400),
      setTimeout(() => setLoadingStep(3), 2200)
    ];
    
    const predictionTimeout = setTimeout(async () => {
      if (selectedLocation) {
        try {
          const data = await fetchOceanPrediction(selectedLocation.latitude, selectedLocation.longitude, selectedDate);
          setPrediction(data);
          
          try {
            const hist = await fetchHistory(selectedLocation.latitude, selectedLocation.longitude);
            setHistoryData(hist);
          } catch (e) {
            console.error("Failed to fetch history:", e);
            setHistoryData([]);
          }
          
        } catch (err: any) {
          setError(err.message || "Failed to connect to ML Backend.");
        }
      }
    }, 3000);

    return () => {
      steps.forEach(clearTimeout);
      clearTimeout(predictionTimeout);
    };
  }, [isLoading, selectedLocation, selectedDate, setPrediction, setError]);

  const handleRunInference = () => {
    if (!selectedLocation) return;
    setIsLoading(true);
  };
  const handleExportCSV = () => {
    if (!prediction || !selectedLocation) return;
    const rows = [['Depth (m)', 'OceanEmbed Temp (C)', 'Argo Reference (C)']];
    prediction.profile.depth.forEach((d: number, i: number) => {
      rows.push([
        d.toString(),
        prediction.profile.temperature[i].toFixed(4),
        prediction.profile.reference_temperature?.[i]?.toFixed(4) || 'N/A'
      ]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e: string[]) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `oceanembed_${selectedLocation.latitude.toFixed(2)}_${selectedLocation.longitude.toFixed(2)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="w-full h-screen bg-[#020202] flex flex-col md:flex-row pt-14 selection:bg-cyan-500/30 font-sans overflow-hidden">
      
      {/* LEFT PANEL - INTERACTIVE GLOBE */}
      <div className={`w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-3.5rem)] sticky top-14 relative bg-black shadow-[inset_-20px_0_50px_rgba(0,0,0,0.8)] border-r border-white/[0.05] ${isMaximized ? 'hidden md:hidden' : ''}`}>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#000_100%)] z-10" />
        
        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
          <Suspense fallback={null}>
            <EarthGlobe alwaysShowGrid={true} />
            <OrbitControls 
              ref={controlsRef}
              enablePan={false} enableDamping dampingFactor={0.05} rotateSpeed={0.5}
              enableZoom minDistance={4.5} maxDistance={6}
              autoRotate={!selectedLocation} autoRotateSpeed={0.5}
            />
            <CameraRig controlsRef={controlsRef} />
          </Suspense>
        </Canvas>

        {/* Cinematic HUD Overlay */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono tracking-[0.3em] font-bold">ORBITAL SENSORS</span>
          </div>
        </div>
        

      </div>

      {/* RIGHT PANEL - NO SCROLL DASHBOARD */}
      <div className={`w-full ${isMaximized ? 'md:w-full' : 'md:w-1/2'} h-full bg-[#050505] relative p-4 flex flex-col overflow-hidden`}>
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {!selectedLocation ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 relative z-10">
            <Scan className="w-16 h-16 text-cyan-500 mb-8 animate-pulse" strokeWidth={1} />
            <h3 className="text-2xl font-bold text-white mb-4 tracking-[0.2em] uppercase">No Target Acquired</h3>
            <p className="text-sm text-white/50 font-mono max-w-sm leading-relaxed mb-6">
              Click anywhere on the global map to extract satellite surface telemetry.
            </p>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col gap-3 h-full animate-in fade-in slide-in-from-bottom-8 duration-700 pb-2">
            
            {/* HEADER COMPONENT */}
            <div className="flex justify-between items-end border-b border-white/10 pb-2 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-[9px] font-mono tracking-[0.2em] mb-1">
                  <Activity className="w-3 h-3" /> TARGET LOCKED
                </div>
                <h2 className="text-xl font-black text-white tracking-tighter mb-1 uppercase">{selectedLocation.region}</h2>
                <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
                  <span className="bg-white/5 px-2 py-1.5 rounded border border-white/10">LAT: {selectedLocation.latitude.toFixed(4)}°</span>
                  <span className="bg-white/5 px-2 py-1.5 rounded border border-white/10">LON: {selectedLocation.longitude.toFixed(4)}°</span>
                  <div className="flex items-center gap-2 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-500/30 transition-colors hover:bg-cyan-900/40">
                    <span className="text-cyan-500 font-bold tracking-widest text-[9px] uppercase">Select Date</span>
                    <input 
                      type="date" 
                      value={selectedDate}
                      min="1993-01-01"
                      max="2023-12-31"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={prediction !== null || isLoading}
                      className="bg-transparent text-cyan-50 font-bold focus:outline-none cursor-pointer disabled:opacity-50"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 shrink-0">
                {autoPilotMode && (
                  <button 
                    onClick={stopAutoPilot}
                    className="px-3 py-2 bg-red-950/40 hover:bg-red-900 border border-red-500/30 rounded text-red-400 hover:text-red-300 transition-all flex items-center justify-center font-bold text-[10px] tracking-widest"
                  >
                    STOP DEMO
                  </button>
                )}
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/50 hover:text-white transition-all flex items-center justify-center"
                  title={isMaximized ? "Minimize Dashboard" : "Maximize Dashboard"}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={reset}
                  disabled={isLoading}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 rounded text-white/50 hover:text-white transition-all flex items-center justify-center"
                  title="Clear Selection"
                >
                  <X className="w-4 h-4" />
                </button>
                {prediction && (
                  <button 
                    onClick={handleExportCSV}
                    className="px-3 py-2 bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-500/30 rounded text-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center"
                    title="Export CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                
              </div>
            </div>

            { /* ERROR STATE */ }
            {error && error.toLowerCase().includes("out of bounds") && !isLoading && (
              <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500 py-10 min-h-0">
                <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-8 max-w-md backdrop-blur-md shadow-[0_0_50px_rgba(8,145,178,0.1)]">
                  <div className="text-cyan-400 font-bold tracking-widest mb-3 flex items-center justify-center gap-3 text-lg">
                    <Crosshair className="w-5 h-5" /> RESTRICTED DOMAIN
                  </div>
                  <p className="text-white/70 font-mono text-sm mb-6 leading-relaxed">
                    OceanEmbed inference is strictly bounded to the North Indian Ocean.
                  </p>
                  <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-4 font-mono text-xs text-cyan-300">
                    <div className="text-white/40 mb-2 uppercase tracking-widest text-[10px]">What are our bounds?</div>
                    <div className="mb-1">Latitude: 5°N — 30°N</div>
                    <div>Longitude: 45°E — 105°E</div>
                  </div>
                </div>
              </div>
            )}

            { /* READY TO RUN STATE */ }
            {selectedLocation && !isLoading && !prediction && (!error || !error.toLowerCase().includes("out of bounds")) && (
              <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500 min-h-0">
                <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-8 max-w-md backdrop-blur-md shadow-[0_0_50px_rgba(8,145,178,0.1)] w-full">
                  <div className="text-cyan-400 font-bold tracking-widest mb-6 flex items-center justify-center gap-3 text-lg">
                    <Scan className="w-6 h-6 animate-pulse" /> TARGET SECURED
                  </div>
                  
                  <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-5 font-mono text-xs text-cyan-300 mb-8 text-left inline-block w-full">
                    <div className="flex justify-between mb-3 border-b border-cyan-500/20 pb-3">
                      <span className="text-white/50">Coordinates:</span>
                      <span className="font-bold">{selectedLocation.latitude}°N, {selectedLocation.longitude}°E</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Status:</span>
                      <span className="font-bold animate-pulse text-cyan-400">READY FOR INFERENCE</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleRunInference}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/50 rounded-lg text-white text-[12px] font-bold tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:shadow-[0_0_50px_rgba(8,145,178,0.5)]"
                  >
                    <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    INITIALIZE MODEL
                  </button>
                </div>
              </div>
            )}

            {/* INFERENCE SEQUENCE OVERLAY */}
            {isLoading && (
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 font-mono text-xs shadow-[0_0_50px_rgba(8,145,178,0.15)]">
                  <div className="flex items-center gap-3 text-cyan-400 mb-6 border-b border-cyan-500/20 pb-4">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-bold tracking-[0.2em]">OCEANEMBED NEURAL ENGINE</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-white/80">
                      <span className="opacity-40 w-12 text-right">0.00s</span>
                      <span className="text-cyan-300">INITIALIZING MODEL WEIGHTS...</span>
                    </div>
                    {loadingStep >= 1 && (
                      <div className="flex items-center gap-4 text-white/80 animate-in fade-in">
                        <span className="opacity-40 w-12 text-right">0.60s</span>
                        <span>EXTRACTING TELEMETRY (SST/SSH/SSS) <span className="text-emerald-400 ml-2">✓</span></span>
                      </div>
                    )}
                    {loadingStep >= 2 && (
                      <div className="flex items-center gap-4 text-white/80 animate-in fade-in">
                        <span className="opacity-40 w-12 text-right">1.40s</span>
                        <span>TENSOR NORMALIZATION <span className="text-emerald-400 ml-2">✓</span></span>
                      </div>
                    )}
                    {loadingStep >= 3 && (
                      <div className="flex items-center gap-4 text-cyan-400 animate-in fade-in">
                        <span className="opacity-40 w-12 text-right text-white/40">2.20s</span>
                        <span className="animate-pulse">EXECUTING FORWARD PASS...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

                                    {/* PREDICTION RESULTS */}
            {prediction && !isLoading && !error && (
              <div className="flex-1 flex flex-col justify-center gap-3 min-h-0 animate-in fade-in duration-1000 zoom-in-95">
                
                {/* ROW 1: SURFACE OBSERVATIONS + PERFORMANCE + HISTORY */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 shrink-0">
                  
                  {/* SURFACE OBSERVATIONS */}
                  <div className="xl:col-span-2 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-2">SURFACE OBSERVATIONS</div>
                    <div className="grid grid-cols-7 gap-2">
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SST</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.sst.toFixed(1)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SSS</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.sss.toFixed(1)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SSH</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.ssh > 0 ? '+' : ''}{prediction.surface_data.ssh.toFixed(2)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">U CUR</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.current_u.toFixed(2)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">V CUR</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.current_v.toFixed(2)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">U WND</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.wind_u.toFixed(1)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">V WND</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.wind_v.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>

                  {/* MODEL PERFORMANCE */}
                  <div className="xl:col-span-1 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-2">MODEL PERFORMANCE</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-purple-950/20 border border-purple-500/20 rounded p-1.5 text-center">
                        <div className="text-purple-400 text-[8px] font-mono tracking-widest mb-1 font-bold">RMSE</div>
                        <div className="text-white font-mono text-xs">{prediction.metrics?.rmse.toFixed(3)}</div>
                      </div>
                      <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 rounded p-1.5 text-center">
                        <div className="text-fuchsia-400 text-[8px] font-mono tracking-widest mb-1 font-bold">BIAS</div>
                        <div className="text-white font-mono text-xs">{prediction.metrics?.bias.toFixed(3)}</div>
                      </div>
                      <div className="bg-indigo-950/20 border border-indigo-500/20 rounded p-1.5 text-center">
                        <div className="text-indigo-400 text-[8px] font-mono tracking-widest mb-1 font-bold">CORR</div>
                        <div className="text-white font-mono text-xs">{prediction.metrics?.correlation.toFixed(3)}</div>
                      </div>
                    </div>
                    {/* Model Version Badge — proof of real ML inference */}
                    <div className="mt-2 flex items-center gap-1.5 bg-green-950/30 border border-green-500/30 rounded px-2 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0"></div>
                      <span className="text-green-400 font-mono text-[8px] tracking-widest truncate uppercase">
                        {prediction.model_version}
                      </span>
                    </div>
                  </div>

                  {/* HISTORICAL TREND */}
                  <div className="xl:col-span-1 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden">
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-1">5-MONTH SST TREND</div>
                    <div className="flex-1 min-h-0 -ml-3">
                      <HistoryChart data={historyData} />
                    </div>
                  </div>
                </div>

                {/* ROW 2: VISUALIZATIONS */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0">
                  <div className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl">
                    <div className="text-[9px] text-white/40 font-mono tracking-[0.2em] mb-2 shrink-0 flex justify-between">
                      <span>3D THERMODYNAMIC VOLUME</span>
                      <span>0 — 1000m</span>
                    </div>
                    <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden bg-black shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                      <Ocean3D prediction={prediction} />
                    </div>
                  </div>

                  <div className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl">
                    <div className="flex justify-between items-center mb-2 shrink-0">
                      <div className="text-[9px] text-white/40 font-mono tracking-[0.2em]">TEMPERATURE vs DEPTH</div>
                      <div className="text-[8px] text-lime-400/80 font-mono tracking-widest border border-lime-500/30 px-1.5 py-0.5 rounded-sm bg-lime-950/30">ARGO VALIDATION</div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <TemperatureChart 
                        profile={prediction.profile} 
                        thermoclineDepth={prediction.estimated_thermocline} 
                        rmse={prediction.metrics?.rmse}
                      />
                    </div>
                  </div>
                </div>

                {/* ROW 3: SCIENTIFIC CONTEXT */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center justify-between shrink-0 text-[8px] font-mono">
                  <div className="flex items-center gap-6">
                    <div><span className="text-cyan-400 font-bold mr-2">1. SATELLITE</span><span className="text-white/40">Surface telemetry</span></div>
                    <div><span className="text-cyan-400 font-bold mr-2">2. OCEANEMBED</span><span className="text-white/40">Deep learning inference</span></div>
                    <div><span className="text-cyan-400 font-bold mr-2">3. ARGO</span><span className="text-white/40">Independent validation</span></div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 px-2 py-0.5 rounded border border-white/5 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> PREDICTION READY
                  </div>
                </div>

              </div>
            )}


          </div>
        )}
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
              Out of bounds
            </span>
          </div>
          <div className="text-white/40 font-mono text-[8px] tracking-wider uppercase mt-1 pl-1 whitespace-nowrap">
            Auto-centering to domain...
          </div>
        </div>
      )}
    </div>
  );
}
