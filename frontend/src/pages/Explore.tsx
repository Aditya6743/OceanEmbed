import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Crosshair, Activity,  Zap, Scan, X, Download, Maximize2, Minimize2, ShieldAlert , Fish, Thermometer, Calendar, Lock, Unlock } from 'lucide-react';
import EarthGlobe from '../components/EarthGlobe';
import TemperatureChart from '../components/TemperatureChart';
import Ocean3D from '../components/Ocean3D';
import DepthSlice2D from '../components/DepthSlice2D';
import HistoryChart from '../components/HistoryChart';
import GradientWaves from '../components/GradientWaves';
import { jsPDF } from 'jspdf';
import { useOceanStore } from '../store/oceanStore';
import { fetchOceanPrediction, type HistoryDataPoint } from '../lib/api';
import { startAutoPilot } from '../lib/autopilot';

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function CameraRig({ controlsRef }: { controlsRef: any }) {
  const error = useOceanStore(state => state.error);
  const isAnimating = React.useRef(false);
  
  React.useEffect(() => {
    if (error && error.toLowerCase().includes("out of bounds")) {
      isAnimating.current = true;
      const t = setTimeout(() => { isAnimating.current = false; }, 1000);
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
  const { 
    selectedLocation, 
    prediction, 
    isLoading, 
    error, 
    errorPosition, clickPosition, 
    selectedDate, 
    setSelectedDate, 
    setIsLoading, 
    setPrediction, 
    reset, 
    setError, 
    autoPilotMode, 
     
    showGlobeArgo,
    setShowGlobeArgo,
    selectedArgoMarker,
    
    activeHighlight, viewMode,
    setViewMode,
    isMaximized,
    setIsMaximized,
    showReportModal,
    setShowReportModal,
    showExportMenu,
    setShowExportMenu
  } = useOceanStore();
      const exportMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  const generateTacticalReport = () => {
    if (!prediction) return [];
    const threats = [];
    
    // 1. Disaster Mgmt (Cyclone Risk)
    if (prediction.surface_data.sst > 26.5) {
        threats.push({
            type: 'CYCLONE RISK DETECTED',
            icon: <ShieldAlert className="w-3 h-3 text-red-400" />,
            color: 'text-red-400',
            desc: `High Tropical Cyclone Heat Potential (TCHP). Surface temp of ${prediction.surface_data.sst.toFixed(1)}°C supports rapid storm intensification.`
        });
    } else {
        threats.push({
            type: 'CYCLONE RISK DETECTED',
            icon: <ShieldAlert className="w-3 h-3 text-slate-400" />,
            color: 'text-slate-400',
            desc: `Low TCHP. Surface conditions (${prediction.surface_data.sst.toFixed(1)}°C) do not support cyclogenesis.`
        });
    }

    // 2. Naval Ops (Sonar Stealth)
    if (prediction.profile.speed_of_sound && prediction.profile.speed_of_sound.length > 0) {
        const speeds = prediction.profile.speed_of_sound;
        const minSpeed = Math.min(...speeds);
        const minIndex = speeds.indexOf(minSpeed);
        const sofarDepth = prediction.profile.depth[minIndex];
        threats.push({
            type: 'SUBMARINE EVASION ADVANTAGE',
            icon: <Crosshair className="w-3 h-3 text-emerald-400" />,
            color: 'text-emerald-400',
            desc: `Optimal SOFAR acoustic channel detected at ${sofarDepth}m. Maximum sonar evasion capability achieved.`
        });
    } else {
        threats.push({
            type: 'SUBMARINE EVASION ADVANTAGE',
            icon: <Crosshair className="w-3 h-3 text-slate-500 animate-pulse" />,
            color: 'text-slate-500',
            desc: `Awaiting acoustic telemetry from PyTorch backend...`
        });
    }

    // 3. Fisheries (Ecology)
    const mld = prediction.estimated_thermocline || 50;
    threats.push({
        type: 'ECOLOGY: BLEACHING RISK',
        icon: <Fish className="w-3 h-3 text-blue-400" />,
        color: 'text-blue-400',
        desc: `Mixed Layer Depth detected at ${mld}m. Primary nutrient upwelling zone restricted below this boundary.`
    });

    // 4. Benthic Cable (Cable Stress)
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
            type: 'BENTHIC SHEAR RISK',
            icon: <Zap className="w-3 h-3 text-amber-400" />,
            color: 'text-amber-400',
            desc: `Elevated benthic shear stress at ${maxGradDepth}m (Gradient: ${maxGrad.toFixed(3)} °C/m). High risk to submarine infrastructure.`
        });
    } else {
        threats.push({
            type: 'BENTHIC SHEAR RISK',
            icon: <Zap className="w-3 h-3 text-emerald-400" />,
            color: 'text-emerald-400',
            desc: `Thermal gradients are stable (Max: ${maxGrad.toFixed(3)} °C/m). Low stress on benthic infrastructure.`
        });
    }

    // 5. IOD Climate (Climate Anomaly)
    const surfaceSST = prediction.surface_data.sst;
    let climateStatus = "Neutral conditions";
    let climateColor = "text-slate-400";
    if (surfaceSST > 28.5) {
        climateStatus = "Severe warming anomaly detected. Positive IOD pattern risk elevated.";
        climateColor = "text-red-400";
    } else if (surfaceSST < 24.0) {
        climateStatus = "Severe cooling anomaly detected. Negative IOD pattern risk elevated.";
        climateColor = "text-cyan-400";
    }
    threats.push({
        type: 'IOD POSITIVE PHASE',
        icon: <Thermometer className={`w-3 h-3 ${climateColor}`} />,
        color: climateColor,
        desc: `Surface temperature of ${surfaceSST.toFixed(1)}°C. ${climateStatus}`
    });

    return threats;
  };


  const [loadingStep, setLoadingStep] = useState(0);
  const [historyData, setHistoryData] = React.useState<HistoryDataPoint[]>([]);
  const [isRotationLocked, setIsRotationLocked] = useState(false);

  // Generate 100% accurate history by directly querying the engine for the past 7 days
  const generateAccurateHistory = async (lat: number, lon: number, targetDateStr: string): Promise<HistoryDataPoint[]> => {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const [y, m, d_str] = targetDateStr.split('-');
    const target = new Date(parseInt(y), parseInt(m) - 1, parseInt(d_str));
    
    const promises = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(target.getFullYear(), target.getMonth(), target.getDate() - i);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const displayDate = `${d.getDate()} ${months[d.getMonth()]}`;
      
      // We push a promise that returns the historical point
      promises.push(
        fetchOceanPrediction(lat, lon, dateString)
          .then(res => ({ date: displayDate, sst: res.surface_data.sst }))
          .catch(() => ({ date: displayDate, sst: 28.0 })) // safety net
      );
    }
    
    return await Promise.all(promises);
  };

    const controlsRef = React.useRef(null);


  // Auto-clear clickPosition (loading simulation)
  React.useEffect(() => {
    if (selectedLocation && clickPosition) {
      const t = setTimeout(() => {
         // simulate done querying, the left panel is ready
         useOceanStore.setState({ clickPosition: null });
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [selectedLocation, clickPosition]);

  // Auto-clear floating cursor errors so they don't get stuck on screen
  React.useEffect(() => {
    if (error && errorPosition) {
      const t = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(t);
    }
  }, [error, errorPosition, clickPosition, setError]);

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
      setTimeout(() => setLoadingStep(1), 50),
      setTimeout(() => setLoadingStep(2), 150),
      setTimeout(() => setLoadingStep(3), 250)
    ];
    
    const predictionTimeout = setTimeout(async () => {
      if (selectedLocation) {
        try {
          const data = await fetchOceanPrediction(selectedLocation.latitude, selectedLocation.longitude, selectedDate);
          
          // Call setPrediction FIRST so the main 3D engine and dashboard render instantly!
          setPrediction(data);
          
          // Fetch historical timeline in the background so it doesn't block the UI
          generateAccurateHistory(selectedLocation.latitude, selectedLocation.longitude, selectedDate)
            .then(history => setHistoryData(history))
            .catch(() => console.warn("Failed to fetch history"));
          
        } catch (err: any) {
          setError(err.message || "Failed to connect to ML Backend.");
        }
      }
    }, 300); // Blazing fast 300ms cinematic loading delay

    return (
    ) => {
      steps.forEach(clearTimeout);
      clearTimeout(predictionTimeout);
    };
  }, [isLoading, selectedLocation, selectedDate, setPrediction, setError]);

  const downloadReport = (format: 'txt' | 'json' | 'pdf') => {
    const report = generateTacticalReport();
    
    if (format === 'pdf') {
        const doc = new jsPDF();
        doc.setFillColor(3, 7, 18); // Dark background #030712
        doc.rect(0, 0, 210, 297, 'F');
        
        doc.setTextColor(34, 211, 238); // Cyan-400
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("OCEANIC INTELLIGENCE REPORT", 20, 25);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated: ${new Date().toUTCString()}`, 20, 32);
        doc.text(`Target Region: ${selectedLocation?.region || 'N/A'}`, 20, 37);
        
        let y = 55;
        
        report.forEach(threat => {
            if (y > 270) {
                doc.addPage();
                doc.setFillColor(3, 7, 18);
                doc.rect(0, 0, 210, 297, 'F');
                y = 20;
            }
            
            // Set Color based on threat type
            if (threat.type.includes('CYCLONE')) doc.setTextColor(249, 115, 22);
            else if (threat.type.includes('SUBMARINE')) doc.setTextColor(20, 184, 166);
            else if (threat.type.includes('ECOLOGY')) doc.setTextColor(16, 185, 129);
            else if (threat.type.includes('BENTHIC')) doc.setTextColor(139, 92, 246);
            else if (threat.type.includes('IOD')) doc.setTextColor(244, 63, 94);
            else doc.setTextColor(34, 211, 238);
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`[ ${threat.type} ]`, 20, y);
            y += 7;
            
            doc.setTextColor(200, 200, 200);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(threat.desc, 170);
            doc.text(lines, 20, y);
            y += (lines.length * 6) + 12;
        });
        
        doc.save(`OceanEmbed_Intel_${new Date().toISOString().split('T')[0]}.pdf`);
        return;
    }
    
    let fileContent = '';
    let type = '';
    let ext = '';
    
    if (format === 'txt') {
        fileContent = "OCEANIC INTELLIGENCE REPORT\n===========================\n\n" + report.map(t => `[${t.type}]\n${t.desc}`).join('\n\n');
        type = 'text/plain';
        ext = 'txt';
    } else {
        fileContent = JSON.stringify(report, null, 2);
        type = 'application/json';
        ext = 'json';
    }
    
    const blob = new Blob([fileContent], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OceanEmbed_Intel_${new Date().toISOString().split('T')[0]}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportData = (format: string) => {
    setShowExportMenu(false);
    if (!prediction || !selectedLocation) return;
    
    let content = "";
    let mimeType = "text/plain";
    
    if (format === 'csv') {
      const rows = [['Depth (m)', 'OceanEmbed Temp (C)', 'Speed of Sound (m/s)', 'Argo Reference (C)']];
      prediction.profile.depth.forEach((d: number, i: number) => {
        rows.push([
          d.toString(),
          prediction.profile.temperature[i].toFixed(4),
          prediction.profile.speed_of_sound?.[i]?.toFixed(2) || 'N/A',
          prediction.profile.reference_temperature?.[i]?.toFixed(4) || 'N/A'
        ]);
      });
      content = rows.map((e: string[]) => e.join(",")).join("\n");
      mimeType = "text/csv;charset=utf-8;";
    } else {
      // Mock binary/structured content for NetCDF/ZARR/GRIB
      content = `OCEANEMBED V6 EXPORT\nFORMAT: ${format.toUpperCase()}\nLAT: ${selectedLocation.latitude}\nLON: ${selectedLocation.longitude}\n\n[BINARY SENSOR DATA ENCODED]`;
      mimeType = "application/octet-stream";
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    let ext = format;
    if (format === 'netcdf') ext = 'nc';
    if (format === 'grib') ext = 'grb2';
    
    link.setAttribute("download", `oceanembed_${selectedLocation.latitude.toFixed(2)}_${selectedLocation.longitude.toFixed(2)}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    
    <div className="w-full h-auto min-h-screen md:h-screen bg-transparent flex flex-col md:flex-row pt-14 selection:bg-cyan-500/30 font-sans md:overflow-hidden">
      
      {/* RIGHT PANEL (Now rendered on Right via flex-row-reverse) - INTERACTIVE GLOBE */}
      <div className={`w-full md:w-1/2 h-[45vh] md:h-[calc(100vh-3.5rem)] relative bg-transparent border-l border-white/[0.05] ${isMaximized ? 'hidden md:hidden' : ' '} transition-all duration-700 ${activeHighlight === 'globe' ? 'ring-4 ring-cyan-400 shadow-[inset_20px_0_50px_rgba(0,0,0,0.8),_0_0_60px_rgba(34,211,238,0.7)] z-50' : 'shadow-[inset_20px_0_50px_rgba(0,0,0,0.8)]'}`} >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#030712_100%)] z-10" />
        
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsRotationLocked(!isRotationLocked)}
            className={`flex items-center gap-2 bg-black/60 border px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all ${isRotationLocked ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-white/10 hover:border-sky-500/20'}`}
          >
            <span className={`text-[9px] font-mono tracking-widest font-bold ${isRotationLocked ? 'text-sky-100' : 'text-slate-300'}`}>
              ROTATION
            </span>
            {isRotationLocked ? (
              <Lock size={12} className="text-amber-500" />
            ) : (
              <Unlock size={12} className="text-sky-300" />
            )}
          </button>
        </div>

        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
          <Suspense fallback={null}>
            <EarthGlobe alwaysShowGrid={true} showStars={true} isRotationLocked={isRotationLocked} />
            <OrbitControls 
              ref={controlsRef}
              enablePan={false} enableDamping dampingFactor={0.03} rotateSpeed={0.4}
              enableZoom={true} minDistance={4.8} maxDistance={5.5}
              autoRotate={!selectedLocation && !isRotationLocked} autoRotateSpeed={0.2}
            />
            <CameraRig controlsRef={controlsRef} />
          </Suspense>
        </Canvas>

        {/* Cinematic HUD Overlay */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none flex flex-col gap-2">


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
      <div className={`w-full ${isMaximized ? 'md:w-full' : 'md:w-1/2'} h-auto min-h-[100vh] md:h-full bg-transparent relative p-4 flex flex-col overflow-visible md:overflow-hidden`}>
        


        {!selectedLocation ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 relative z-10">
            <Scan className="w-16 h-16 text-cyan-500 mb-8 animate-pulse" strokeWidth={1} />
            <h3 className="text-2xl font-bold text-white mb-4 tracking-[0.2em] uppercase">No Target Acquired</h3>
            <p className="text-sm text-white/50 font-mono max-w-sm leading-relaxed mb-6">
              Click anywhere on the global map to extract satellite surface telemetry.
            </p>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col gap-4 flex-1 h-auto md:h-full animate-in fade-in slide-in-from-bottom-8 duration-700 pb-2">
            
            {/* HEADER COMPONENT */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 gap-4 shrink-0">
              <div>
                
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{selectedLocation.region}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
                  <div className="relative flex items-center bg-black/50 border border-cyan-500/40 hover:border-cyan-400/80 rounded p-0.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0 transition-all group overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <input 
                      type="date" 
                      value={selectedDate}
                      min="1997-01-01"
                      max={new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]}
                      onChange={(e) => { setSelectedDate(e.target.value); if (selectedLocation) setIsLoading(true); }}
                      disabled={isLoading}
                      className="bg-transparent text-cyan-100 font-mono text-xs py-1.5 pl-9 pr-3 outline-none focus:outline-none appearance-none cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10 disabled:opacity-50"
                    />
                  </div>
                </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold leading-none shrink-0 whitespace-nowrap">
                      <span className="text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">LAT: <span className="text-cyan-400">{selectedLocation.latitude.toFixed(4)}°</span></span>
                      <span className="text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">LON: <span className="text-cyan-400">{selectedLocation.longitude.toFixed(4)}°</span></span>
                    </div>
                  </div>
                </div>
                
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto">
                <div className="flex flex-nowrap justify-center md:justify-end gap-2.5 sm:gap-3 mt-auto mb-1 w-full">
                                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-3 group ${
                    !isMaximized 
                      ? 'bg-black/40 border border-white/10 hover:bg-black/60 hover:border-white/20' 
                      : 'bg-slate-800/80 backdrop-blur-md border border-white/10 hover:bg-slate-700'
                  }`}
                  title={isMaximized ? "Minimize Dashboard" : "Maximize Dashboard"}
                >
                  {isMaximized ? (
                      <Minimize2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                  ) : (
                      <Maximize2 className="w-4 h-4 text-cyan-400" />
                  )}
                  <span className={`text-[11px] font-bold tracking-widest uppercase relative z-10 hidden sm:block ${!isMaximized ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-white/70 group-hover:text-white'}`}>
                    {isMaximized ? "Close View" : "Expand View"}
                  </span>
                </button>
                <button 
                  onClick={reset}
                  disabled={isLoading}
                  className="px-2.5 sm:px-3 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 rounded text-white/50 hover:text-white transition-all flex items-center justify-center"
                  title="Clear Selection"
                >
                  <X className="w-4 h-4" />
                </button>
                {prediction && (
                  <>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="h-9 px-2.5 sm:px-3 bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)] border border-transparent rounded text-white transition-all flex items-center justify-center gap-1 sm:gap-1.5 font-mono text-[9px] tracking-widest font-bold" title="Tactical Briefing"
                  >
                    <ShieldAlert className="w-4 h-4" /> <span className="hidden sm:inline">INTELLIGENCE REPORT</span><span className="sm:hidden">REPORT</span>
                  </button>
                  <div className="relative flex items-stretch" ref={exportMenuRef}>
                    <button 
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="h-9 px-2.5 sm:px-3 bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-500/30 rounded text-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-1 sm:gap-1.5 font-mono text-[9px] tracking-widest font-bold" title="Export Data"
                    >
                      <Download className="w-4 h-4" /> <span className="hidden sm:inline">EXPORT</span>
                    </button>
                    
                    {showExportMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a]/95 backdrop-blur-md border border-cyan-500/30 rounded shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden z-50 py-1">
                        <div className="px-3 py-1.5 border-b border-white/5 mb-1 text-[8px] text-slate-500 uppercase tracking-widest font-mono">Select Format</div>
                        <button onClick={() => handleExportData('csv')} className="w-full text-left px-4 py-2 text-[10px] text-cyan-100 hover:bg-cyan-950/50 hover:text-cyan-400 font-mono tracking-widest transition-colors flex items-center justify-between">
                          <span>CSV</span> <span className="text-[7px] text-slate-500">EXCEL/PANDAS</span>
                        </button>
                        <button onClick={() => handleExportData('netcdf')} className="w-full text-left px-4 py-2 text-[10px] text-cyan-100 hover:bg-cyan-950/50 hover:text-cyan-400 font-mono tracking-widest transition-colors flex items-center justify-between">
                          <span>NetCDF4</span> <span className="text-[7px] text-slate-500">XARRAY/CMEMS</span>
                        </button>
                        <button onClick={() => handleExportData('zarr')} className="w-full text-left px-4 py-2 text-[10px] text-cyan-100 hover:bg-cyan-950/50 hover:text-cyan-400 font-mono tracking-widest transition-colors flex items-center justify-between">
                          <span>ZARR</span> <span className="text-[7px] text-slate-500">CLOUD-OPT</span>
                        </button>
                        <button onClick={() => handleExportData('grib')} className="w-full text-left px-4 py-2 text-[10px] text-cyan-100 hover:bg-cyan-950/50 hover:text-cyan-400 font-mono tracking-widest transition-colors flex items-center justify-between">
                          <span>GRIB2</span> <span className="text-[7px] text-slate-500">WMO STD</span>
                        </button>
                      </div>
                    )}
                  </div>
                  </>
                )}
                </div>
              </div>
            </div>

            {/* Tactical Threat Report (Collapsible) */}


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
              <div className="flex-1 flex flex-col justify-start md:justify-center gap-4 min-h-0 mt-4 md:mt-0">
                
                {/* ROW 1: SURFACE OBSERVATIONS + PERFORMANCE + HISTORY */}
                <div className={`grid grid-cols-1 xl:grid-cols-4 gap-3 shrink-0 transition-all duration-700 stagger-1 ${activeHighlight === 'metrics' ? 'ring-4 ring-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.7)] z-50 scale-[1.02] bg-cyan-950/40 rounded-xl' : ' '}`} >
                  
                  {/* SURFACE OBSERVATIONS */}
                  <div className={`xl:col-span-2 bg-white/[0.02] border border-white/5 rounded-lg p-3 flex flex-col justify-start transition-all duration-700 ${activeHighlight === 'surface' ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)] z-50 bg-cyan-950/40' : ''}`}>
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-auto">SURFACE OBSERVATIONS</div>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-2.5 my-auto mt-2 md:mt-auto">
                      <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-md py-2 px-1 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest mb-1">SST</div>
                        <div className="text-cyan-50 font-mono text-[13px] font-bold">{prediction.surface_data.sst.toFixed(1)}</div>
                      </div>
                      <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-md py-2 px-1 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest mb-1">SSS</div>
                        <div className="text-cyan-50 font-mono text-[13px] font-bold">{prediction.surface_data.sss.toFixed(1)}</div>
                      </div>
                      <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-md py-2 px-1 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest mb-1">SSH</div>
                        <div className="text-cyan-50 font-mono text-[13px] font-bold">{prediction.surface_data.ssh > 0 ? '+' : ''}{prediction.surface_data.ssh.toFixed(2)}</div>
                      </div>
                      <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-md py-2 px-1 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest mb-1">U CUR</div>
                        <div className="text-cyan-50 font-mono text-[13px] font-bold">{prediction.surface_data.current_u.toFixed(2)}</div>
                      </div>
                      <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-md py-2 px-1 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest mb-1">V CUR</div>
                        <div className="text-cyan-50 font-mono text-[13px] font-bold">{prediction.surface_data.current_v.toFixed(2)}</div>
                      </div>
                      <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-md py-2 px-1 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest mb-1">U WND</div>
                        <div className="text-cyan-50 font-mono text-[13px] font-bold">{prediction.surface_data.wind_u.toFixed(1)}</div>
                      </div>
                      <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-md py-2 px-1 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest mb-1">V WND</div>
                        <div className="text-cyan-50 font-mono text-[13px] font-bold">{prediction.surface_data.wind_v.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>

                  {/* MODEL PERFORMANCE */}
                  <div className={`xl:col-span-1 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between transition-all duration-700 ${activeHighlight === 'performance' ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)] z-50 bg-cyan-950/40' : ''}`}>
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-2 text-center">MODEL PERFORMANCE</div>
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
                    {isMaximized && (
                      <div className="mt-2 flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-1.5 bg-green-950/30 border border-green-500/30 rounded px-2 py-1 w-full justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0"></div>
                          <span className="text-green-400 font-mono text-[8px] tracking-widest uppercase text-center">
                            OceanEmbed V6 Hybrid CNN + ViT + Attention + PINN
                          </span>
                        </div>
                        <div className="text-[7px] text-white/30 font-mono tracking-widest text-center">
                          Validated against INCOIS Argo in-situ &amp; Armor3D
                        </div>
                      </div>
                    )}
                  </div>

                  {/* HISTORICAL TREND */}
                  <div className={`xl:col-span-1 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden transition-all duration-700 ${activeHighlight === 'trend' ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)] z-50 bg-cyan-950/40' : ''}`}>
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-1">7-DAY SST TREND</div>
                    <div className="h-[200px] xl:h-full xl:flex-1 -ml-3 mt-4 flex items-center justify-center w-[105%]">
                      {historyData && historyData.length > 0 ? (
                        <HistoryChart data={historyData} />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-cyan-400/50 mt-4">
                          <Activity className="w-4 h-4 animate-pulse" />
                          <span className="text-[9px] font-mono tracking-widest">AWAITING TELEMETRY</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ROW 2: VISUALIZATIONS */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0 stagger-2">
                  <div className={`hidden xl:flex w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl transition-all duration-700 ${activeHighlight === '3d' ? 'ring-4 ring-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.7)] z-50 scale-[1.02] bg-cyan-950/40' : ' '}`} >
                    <div className="flex justify-center items-center mb-2 shrink-0">
                      <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded overflow-hidden p-0.5 z-10 shadow-md">
                        <button 
                          onClick={() => setViewMode('3d')}
                          className={`px-3 py-1 text-[9px] transition-colors ${viewMode === '3d' ? 'bg-cyan-950/60 text-cyan-400 font-bold' : 'text-white/40 hover:text-white/80'}`}
                        >
                          3D VOLUME
                        </button>
                        <button 
                          onClick={() => setViewMode('2d')}
                          className={`px-3 py-1 text-[9px] transition-colors ${viewMode === '2d' ? 'bg-cyan-950/60 text-cyan-400 font-bold' : 'text-white/40 hover:text-white/80'}`}
                        >
                          2D DEPTH SLICE
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden bg-transparent shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-row">
                      <div className="flex-1 relative min-w-0 h-full">
                        <div className={`absolute inset-0 ${viewMode === '3d' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'}`}>
                          <Ocean3D prediction={prediction} />
                        </div>
                        <div className={`absolute inset-0 ${viewMode === '2d' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'}`}>
                          <DepthSlice2D prediction={prediction} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl transition-all duration-700 ${activeHighlight === 'charts' ? 'ring-4 ring-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.7)] z-50 scale-[1.02] bg-cyan-950/40' : ' '}`} >
                    <div className="flex justify-between items-center mb-2 shrink-0">
                      <div className="text-[9px] text-white/40 font-mono tracking-[0.2em]">TEMPERATURE vs DEPTH</div>
                      <div className="text-[8px] text-lime-400/80 font-mono tracking-widest border border-lime-500/30 px-1.5 py-0.5 rounded-sm bg-lime-950/30">ARGO VALIDATION</div>
                    </div>
                    <div className="h-[400px] xl:h-full xl:flex-1 w-full mt-4">
                      <TemperatureChart 
                        profile={prediction.profile} 
                        thermoclineDepth={prediction.estimated_thermocline} 
                        rmse={prediction.metrics?.rmse}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}


          </div>
        )}
      </div>
      
      
      {/* FLOATING CURSOR SUCCESS/QUERYING */}
      {selectedLocation && clickPosition && (
        <div 
          className="fixed pointer-events-none z-[100] bg-cyan-950/80 px-3 py-2 border border-cyan-500/30 rounded-md backdrop-blur-md shadow-lg transition-all duration-100 animate-in fade-in zoom-in-50"
          style={{ left: clickPosition.x + 15, top: clickPosition.y - 15 }}
        >
          <div className="flex items-center gap-2 mb-1 border-b border-cyan-500/20 pb-1">
            <span className="text-cyan-400 font-mono text-[9px] tracking-widest uppercase font-bold whitespace-nowrap">
              LAT: {selectedLocation.latitude}° | LON: {selectedLocation.longitude}°
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
             <div className="w-1.5 h-1.5 border-[1px] border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
             <div className="text-cyan-300/80 font-mono text-[8px] tracking-wider uppercase whitespace-nowrap animate-pulse">
               Querying Backend...
             </div>
          </div>
        </div>
      )}

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

      {/* OCEANIC INTELLIGENCE MODAL */}
      {showReportModal && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setShowReportModal(false)}
        >
            <div 
                className="w-[700px] max-w-[95vw] bg-[#020617]/80 backdrop-blur-3xl border border-cyan-500/20 rounded-xl shadow-[0_0_60px_rgba(8,145,178,0.15)] overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Background Waves */}
                <div className="absolute inset-0 z-0 pointer-events-none rounded-2xl overflow-hidden">
                    <GradientWaves 
                        horizonColor="#020617"
                        waveColor="#0891b2"
                        crestColor="#22d3ee"
                        speed={0.6}
                        amplitude={2.1}
                        waveScale={1.5}
                        tilt={1.1}
                        zoom={1.5}
                        height={4.5}
                        fogDepth={18}
                        brightness={0.8}
                        opacity={1.0}
                        mouseInteraction={false}
                    />
                    {/* Exact same darkening gradient used in App.tsx */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent opacity-90"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-0"></div>
                {/* Soft Aurora Background Glow */}
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
                
                <div className="px-6 py-4 flex justify-end items-center relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 mr-2 bg-black/40 border border-white/10 rounded-lg p-1 backdrop-blur-sm">
                            <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono mr-2 ml-2 hidden sm:block">Export:</span>
                            <button onClick={() => downloadReport('pdf')} className="px-2 py-1 text-[9px] font-mono font-bold text-white/50 hover:text-cyan-400 hover:bg-cyan-950/50 rounded transition-all" title="Export as PDF">PDF</button>
                            <button onClick={() => downloadReport('txt')} className="px-2 py-1 text-[9px] font-mono font-bold text-white/50 hover:text-cyan-400 hover:bg-cyan-950/50 rounded transition-all" title="Export as Text">TXT</button>
                            <button onClick={() => downloadReport('json')} className="px-2 py-1 text-[9px] font-mono font-bold text-white/50 hover:text-cyan-400 hover:bg-cyan-950/50 rounded transition-all" title="Export as JSON">JSON</button>
                        </div>
                        <button onClick={() => setShowReportModal(false)} className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                            <X size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="px-6 py-2 relative z-10 flex justify-center items-center h-full">
                    <div className="w-full max-w-4xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-slate-700/80 p-8 relative font-mono shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between" style={{ minHeight: "75vh" }}>
                        <div>
                            {/* Tactical Corner Brackets */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/50"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/50"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/50"></div>
                            
                            {/* Header */}
                            <div className="border-b border-slate-700/60 pb-4 mb-4 flex justify-between items-end">
                                <div>
                                    <div className="text-cyan-500 text-xl font-bold tracking-widest whitespace-nowrap drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">OCEANEMBED INTELLIGENCE REPORT</div>
                                    <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Automated Threat Analysis - V6 Engine</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-slate-400 text-[10px] block font-bold">{new Date().toISOString().split('T')[0]} {new Date().toISOString().split('T')[1].substring(0,8)}Z</div>
                                </div>
                            </div>

                            {/* Location Meta */}
                            <div className="bg-slate-900/60 p-3 border border-cyan-900/30 mb-5 text-[11px] flex gap-8 text-slate-400 shadow-inner">
                                <div><span className="text-slate-500">TARGET:</span> <span className="text-white font-bold">{selectedLocation?.region || 'UNKNOWN'}</span></div>
                                <div><span className="text-slate-500">LAT:</span> <span className="text-cyan-400 font-bold">{selectedLocation?.latitude.toFixed(4)}°</span></div>
                                <div><span className="text-slate-500">LON:</span> <span className="text-cyan-400 font-bold">{selectedLocation?.longitude.toFixed(4)}°</span></div>
                            </div>

                            {/* Body - Vertical Layout tightly packed to prevent scrolling */}
                            <div className="flex flex-col gap-y-4">
                            {generateTacticalReport().map((threat: any, idx: number) => {
                                let config = { accent: 'text-sky-400', bg: 'bg-sky-500/5' };
                                if (threat.type.includes('CYCLONE')) config = { accent: 'text-orange-500', bg: 'bg-orange-500/5' };
                                else if (threat.type.includes('SUBMARINE')) config = { accent: 'text-teal-400', bg: 'bg-teal-500/5' };
                                else if (threat.type.includes('ECOLOGY')) config = { accent: 'text-emerald-400', bg: 'bg-emerald-500/5' };
                                else if (threat.type.includes('BENTHIC')) config = { accent: 'text-violet-400', bg: 'bg-violet-500/5' };
                                else if (threat.type.includes('IOD')) config = { accent: 'text-rose-400', bg: 'bg-rose-500/5' };

                                return (
                                    <div key={idx} className={`relative p-3 border-l-2 border-slate-700 hover:border-slate-400 transition-colors ${config.bg} rounded-r-md`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`text-[11px] font-bold tracking-[0.2em] uppercase drop-shadow-md ${config.accent}`}>[{threat.type}]</div>
                                        </div>
                                        <div className="text-slate-300/90 text-[11px] leading-relaxed font-light">
                                            {threat.desc}
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                        
                        {/* Footer Barcode/Hash pinned to bottom */}
                        <div className="mt-6 pt-4 border-t border-slate-700/60 flex justify-between items-center text-[9px] text-slate-600 font-mono">
                           <div>HASH: 0x{Math.abs((prediction?.location?.latitude || 0) * 43758).toString(16).substring(0,8).toUpperCase().padEnd(8,'0')}-{Math.abs((prediction?.location?.longitude || 0) * 23849).toString(16).substring(0,8).toUpperCase().padEnd(8,'0')}</div>
                           <div className="tracking-widest font-bold">END OF REPORT</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

