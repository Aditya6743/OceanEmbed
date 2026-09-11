import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Crosshair, Activity, BrainCircuit, Zap, Scan, X, Download, Maximize2, Minimize2, ShieldAlert } from 'lucide-react';
import EarthGlobe from '../components/EarthGlobe';
import TemperatureChart from '../components/TemperatureChart';
import Ocean3D from '../components/Ocean3D';
import HistoryChart from '../components/HistoryChart';
import AnomalyHeatmap from '../components/AnomalyHeatmap';
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
      return (
    ) => clearTimeout(t);
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

  const generateTacticalReport = () => {
    if (!prediction) return [];
    const threats = [];
    
    // 1. Sonar Stealth
    if (prediction.profile.speed_of_sound) {
        const speeds = prediction.profile.speed_of_sound;
        const minSpeed = Math.min(...speeds);
        const minIndex = speeds.indexOf(minSpeed);
        const sofarDepth = prediction.profile.depth[minIndex];
        threats.push({
            type: 'SONAR STEALTH',
            icon: <Crosshair className="w-3 h-3 text-emerald-400" />,
            color: 'text-emerald-400',
            desc: `Optimal SOFAR acoustic channel detected at ${sofarDepth}m. Maximum sonar evasion capability achieved.`
        });
    }

    // 2. Cyclone Potential
    if (prediction.surface_data.sst > 26.5) {
        threats.push({
            type: 'CYCLONE RISK',
            icon: <ShieldAlert className="w-3 h-3 text-red-400" />,
            color: 'text-red-400',
            desc: `High Tropical Cyclone Heat Potential (TCHP). Surface temp of ${prediction.surface_data.sst.toFixed(1)}°C supports rapid storm intensification.`
        });
    } else {
        threats.push({
            type: 'CYCLONE RISK',
            icon: <ShieldAlert className="w-3 h-3 text-slate-400" />,
            color: 'text-slate-400',
            desc: `Low TCHP. Surface conditions (${prediction.surface_data.sst.toFixed(1)}°C) do not support cyclogenesis.`
        });
    }

    // 3. Subsea Cable Stress (Gradient)
    let maxGrad = 0;
    let maxGradDepth = 0;
    for(let i=0; i<prediction.profile.depth.length-1; i++) {
        const dz = prediction.profile.depth[i+1] - prediction.profile.depth[i];
        const dt = Math.abs(prediction.profile.temperature[i] - prediction.profile.temperature[i+1]);
        if(dz > 0 && (dt/dz) > maxGrad) {
            maxGrad = dt/dz;
            maxGradDepth = prediction.profile.depth[i];
        }
    }
    
    if (maxGrad > 0.05) {
        threats.push({
            type: 'CABLE STRESS',
            icon: <Zap className="w-3 h-3 text-amber-400" />,
            color: 'text-amber-400',
            desc: `Elevated benthic shear stress at ${maxGradDepth}m (Gradient: ${maxGrad.toFixed(3)} °C/m). High risk to submarine infrastructure.`
        });
    }

    return threats;
  };

  const { 
    selectedLocation, 
    prediction, 
    isLoading, 
    error, 
    errorPosition, 
    selectedDate, 
    setSelectedDate, 
    setIsLoading, 
    setPrediction, 
    reset, 
    setError, 
    autoPilotMode, 
    activeHighlight, 
    showArgoTubes, 
    setShowArgoTubes,
    showGlobeArgo,
    setShowGlobeArgo,
    selectedArgoMarker
  } = useOceanStore();
  const [loadingStep, setLoadingStep] = useState(0);
  const [historyData, setHistoryData] = React.useState<HistoryDataPoint[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const controlsRef = React.useRef(null);

  // Auto-clear floating cursor errors so they don't get stuck on screen
  React.useEffect(() => {
    if (error && errorPosition) {
      const t = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(t);
    }
  }, [error, errorPosition, setError]);

  // Clear errors when navigating away from this page
  React.useEffect(() => {
    return () => {
      useOceanStore.getState().setError(null);
    };
  }, []);

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
    return (
    ) => window.removeEventListener('scroll', handleScroll);
  }, [error, setError]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    
    const steps = [
      setTimeout(() => setLoadingStep(1), 0),
      setTimeout(() => setLoadingStep(2), 0),
      setTimeout(() => setLoadingStep(3), 0)
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
    }, 0); // Removed artificial cinematic delay

    return (
    ) => {
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
    const rows = [['Depth (m)', 'OceanEmbed Temp (C)', 'Speed of Sound (m/s)', 'Argo Reference (C)']];
    prediction.profile.depth.forEach((d: number, i: number) => {
      rows.push([
        d.toString(),
        prediction.profile.temperature[i].toFixed(4),
        prediction.profile.speed_of_sound?.[i]?.toFixed(2) || 'N/A',
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
    
    <div className="w-full h-screen bg-transparent flex flex-col md:flex-row pt-14 selection:bg-cyan-500/30 font-sans overflow-hidden">
      
      {/* RIGHT PANEL (Now rendered on Right via flex-row-reverse) - INTERACTIVE GLOBE */}
      <div className={`w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-3.5rem)] sticky top-14 relative bg-transparent border-l border-white/[0.05] ${isMaximized ? 'hidden md:hidden' : ' '} transition-all duration-700 ${activeHighlight === 'globe' ? 'ring-4 ring-cyan-400 shadow-[inset_20px_0_50px_rgba(0,0,0,0.8),_0_0_60px_rgba(34,211,238,0.7)] z-50' : 'shadow-[inset_20px_0_50px_rgba(0,0,0,0.8)]'}`} >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#030712_100%)] z-10" />
        
        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
          <Suspense fallback={null}>
            <EarthGlobe alwaysShowGrid={true} showStars={true} />
            <OrbitControls 
              ref={controlsRef}
              enablePan={false} enableDamping dampingFactor={0.03} rotateSpeed={0.4}
              enableZoom={true} minDistance={4.8} maxDistance={5.5}
              autoRotate={!selectedLocation} autoRotateSpeed={0.2}
            />
            <CameraRig controlsRef={controlsRef} />
          </Suspense>
        </Canvas>

        {/* Cinematic HUD Overlay */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono tracking-[0.3em] font-bold">ORBITAL SENSORS</span>
          </div>

                    {/* Live ARGO Fleet Status & Toggle */}
          <div className="pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
            <span className={`text-[9px] font-mono tracking-widest font-bold ${showGlobeArgo ? 'text-lime-400' : 'text-slate-400'}`}>
              LIVE ARGO FLEET
            </span>
            <button
              onClick={() => setShowGlobeArgo(!showGlobeArgo)}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${showGlobeArgo ? 'bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.5)]' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showGlobeArgo ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {selectedArgoMarker && (
            <div className="pointer-events-auto bg-black/90 border border-lime-500/40 rounded-md p-2 px-2.5 backdrop-blur-md font-mono w-max max-w-[240px] shadow-[0_0_15px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between gap-3 text-lime-400 font-bold mb-1">
                <span className="text-[8.5px] tracking-wider font-mono">TARGET: ARGO #{selectedArgoMarker.id}</span>
                <span className="text-cyan-300 text-[8px] bg-cyan-950/50 border border-cyan-500/30 px-1 py-0.2 rounded shrink-0">
                  {selectedArgoMarker.lat.toFixed(2)}°N, {selectedArgoMarker.lon.toFixed(2)}°E
                </span>
              </div>
              <div className="text-white/60 text-[7.5px] truncate">
                TIME: {new Date(selectedArgoMarker.timestamp).toUTCString().replace('GMT', 'UTC')}
              </div>
            </div>
          )}
        </div>
        

      </div>

      {/* RIGHT PANEL - NO SCROLL DASHBOARD */}
      <div className={`w-full ${isMaximized ? 'md:w-full' : 'md:w-1/2'} h-full bg-transparent relative p-4 flex flex-col overflow-hidden`}>
        


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
                      max="2026-12-31"
                      onChange={(e) => { setSelectedDate(e.target.value); if (selectedLocation) setIsLoading(true); }}
                      disabled={isLoading}
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
                  className={`px-3 py-2 rounded transition-all flex items-center justify-center \${
                    !isMaximized 
                      ? 'bg-cyan-950/60 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse hover:bg-cyan-900 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]' 
                      : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
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

            {/* Tactical Threat Report */}
            <div className="mt-4 p-4 bg-black/60 border border-slate-700/50 rounded-lg backdrop-blur-md relative overflow-hidden">
                <h3 className="text-slate-200 text-[11px] font-bold font-mono tracking-widest mb-3 flex items-center gap-2 border-b border-slate-700/50 pb-2">
                    <ShieldAlert size={14} className="text-red-500" /> TACTICAL THREAT REPORT
                </h3>
                <div className="space-y-3">
                    {generateTacticalReport().map((threat: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded p-2 flex items-start gap-3">
                            <div className="mt-1">{threat.icon}</div>
                            <div>
                                <div className={`text-[10px] font-bold font-mono tracking-wider ${threat.color}`}>{threat.type}</div>
                                <div className="text-slate-400 text-[10px] font-mono leading-relaxed mt-0.5">{threat.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            { /* ERROR STATE */ }
            {error && !isLoading && (
              <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500 py-10 min-h-0">
                <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-8 max-w-md backdrop-blur-md shadow-[0_0_50px_rgba(8,145,178,0.1)]">
                  <div className="text-orange-400 font-bold tracking-widest mb-3 flex items-center justify-center gap-3 text-lg">
                    <Crosshair className="w-5 h-5" /> INVALID TARGET
                  </div>
                  <p className="text-white/70 font-mono text-sm mb-6 leading-relaxed">
                    {error.toLowerCase().includes("landmass") 
                      ? "The selected coordinate is on a solid landmass. The AI reconstruction requires open ocean satellite telemetry."
                      : "OceanEmbed inference is strictly bounded to the North Indian Ocean."}
                  </p>
                  
                  {!error.toLowerCase().includes("landmass") && (
                    <div className="bg-transparent/50 border border-cyan-500/20 rounded-lg p-4 font-mono text-xs text-cyan-300">
                      <div className="text-white/40 mb-2 uppercase tracking-widest text-[10px]">What are our bounds?</div>
                      <div className="grid grid-cols-2 gap-2 text-left">
                        <div>Lat: <span className="text-cyan-100">5°N - 30°N</span></div>
                        <div>Lon: <span className="text-cyan-100">45°E - 105°E</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            { /* READY TO RUN STATE */ }
            {selectedLocation && !isLoading && !prediction && !error && (
              <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500 min-h-0">
                <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-8 max-w-md backdrop-blur-md shadow-[0_0_50px_rgba(8,145,178,0.1)] w-full">
                  <div className="text-cyan-400 font-bold tracking-widest mb-6 flex items-center justify-center gap-3 text-lg">
                    <Scan className="w-6 h-6 animate-pulse" /> TARGET SECURED
                  </div>
                  
                  <div className="bg-transparent/50 border border-cyan-500/20 rounded-lg p-5 font-mono text-xs text-cyan-300 mb-8 text-left inline-block w-full">
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
                    className={`w-full py-4 bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/50 rounded-lg text-white text-[12px] font-bold tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:shadow-[0_0_50px_rgba(8,145,178,0.5)] ${activeHighlight === 'button' ? 'ring-4 ring-white shadow-[0_0_80px_rgba(255,255,255,1)] scale-[1.05] brightness-150' : ' '}`}
                  >
                    <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    INITIALIZE MODEL
                  </button>
                </div>
              </div>
            )}

            {/* INFERENCE SEQUENCE OVERLAY */}
            {isLoading && (
              <div className="flex-1 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-transparent/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 font-mono text-xs shadow-[0_0_50px_rgba(8,145,178,0.15)] max-w-md w-full mx-auto">
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
                <div className={`grid grid-cols-1 xl:grid-cols-4 gap-3 shrink-0 transition-all duration-700 ${activeHighlight === 'metrics' ? 'ring-4 ring-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.7)] z-50 scale-[1.02] bg-cyan-950/40 rounded-xl' : ' '}`} >
                  
                  {/* SURFACE OBSERVATIONS */}
                  <div className="xl:col-span-2 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-2">SURFACE OBSERVATIONS</div>
                    <div className="grid grid-cols-7 gap-2">
                      <div className="bg-transparent/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SST</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.sst.toFixed(1)}</div>
                      </div>
                      <div className="bg-transparent/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SSS</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.sss.toFixed(1)}</div>
                      </div>
                      <div className="bg-transparent/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SSH</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.ssh > 0 ? '+' : ''}{prediction.surface_data.ssh.toFixed(2)}</div>
                      </div>
                      <div className="bg-transparent/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">U CUR</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.current_u.toFixed(2)}</div>
                      </div>
                      <div className="bg-transparent/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">V CUR</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.current_v.toFixed(2)}</div>
                      </div>
                      <div className="bg-transparent/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">U WND</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.wind_u.toFixed(1)}</div>
                      </div>
                      <div className="bg-transparent/40 border border-white/5 rounded p-1.5 text-center">
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
                  <div className={`w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl transition-all duration-700 ${activeHighlight === '3d' ? 'ring-4 ring-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.7)] z-50 scale-[1.02] bg-cyan-950/40' : ' '}`} >
                    <div className="text-[9px] text-white/40 font-mono tracking-[0.2em] mb-2 shrink-0 flex justify-between items-center">
                      <span>3D THERMODYNAMIC VOLUME</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowArgoTubes(!showArgoTubes)}
                          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border transition-all text-[8px] tracking-widest font-bold ${
                            showArgoTubes
                              ? 'bg-lime-950/40 border-lime-500/40 text-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                              : 'bg-white/5 border-white/10 text-white/30 hover:text-white/50'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${showArgoTubes ? 'bg-lime-400' : 'bg-white/20'}`} />
                          ARGO
                        </button>
                        <span>0 — 1000m</span>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden bg-transparent shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-row">
                      <div className="flex-1 relative min-w-0 h-full"><Ocean3D prediction={prediction} /></div><AnomalyHeatmap profile={prediction.profile} />
                    </div>
                  </div>

                  <div className={`w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl transition-all duration-700 ${activeHighlight === 'charts' ? 'ring-4 ring-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.7)] z-50 scale-[1.02] bg-cyan-950/40' : ' '}`} >
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
                  <div className="flex items-center gap-2 bg-transparent/40 px-2 py-0.5 rounded border border-white/5 text-emerald-400">
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
          className="fixed pointer-events-none z-[100] bg-red-950/80 px-3 py-2 border border-red-500/30 rounded-md backdrop-blur-md shadow-lg transition-all duration-100 animate-in fade-in zoom-in-50"
          style={{ left: errorPosition.x + 15, top: errorPosition.y - 15 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse"></div>
            <span className="text-red-400/90 font-mono text-[9px] tracking-widest uppercase font-bold whitespace-nowrap">
              {error}
            </span>
          </div>
          <div className="text-white/40 font-mono text-[8px] tracking-wider uppercase mt-1 pl-1 whitespace-nowrap">
            {error.toLowerCase().includes('landmass') ? 'Telemetry rejected.' : 'Restoring domain lock...'}
          </div>
        </div>
      )}
    </div>
  );
}
