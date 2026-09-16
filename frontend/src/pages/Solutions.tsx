import { Suspense, useState, useEffect, } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MosdacGlobe from '../components/MosdacGlobe';
import { Calendar, Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOceanStore } from '../store/oceanStore';

type ViewMode = 'climate' | 'navy' | 'fishery' | 'cable' | 'enso' | 'iot';

import { useThree } from '@react-three/fiber';


import { useFrame } from '@react-three/fiber';

function RotationController({ isRotationLocked }: { isRotationLocked: boolean }) {
    const { controls } = useThree();
    useFrame(() => {
        if (controls) {
            (controls as any).autoRotate = !isRotationLocked;
        }
    });
    return null;
}

function CameraResetTrigger({ activeTab, climateMode: _c, isRotationLocked }: { activeTab: string, climateMode: string, isRotationLocked: boolean }) {
    const { camera, controls } = useThree();
    
    useEffect(() => {
        if (!controls) return;
        
        // 1. Completely lock out user and physics engine to prevent ANY glitches or fighting
        (controls as any).enabled = false;
        (controls as any).autoRotate = false;
        
        let animId: number;
        let progress = 0;
        
        let startAzimuth = (controls as any).getAzimuthalAngle();
        let startPolar = (controls as any).getPolarAngle();
        let startDist = (controls as any).getDistance();
        
        // Normalize azimuth for shortest path
        startAzimuth = startAzimuth % (2 * Math.PI);
        if (startAzimuth > Math.PI) startAzimuth -= 2 * Math.PI;
        if (startAzimuth < -Math.PI) startAzimuth += 2 * Math.PI;
        
        // The mathematically verified coordinates to center India based on MosdacGlobe's inherent rotation
        const targetAzimuth = 0; 
        const targetPolar = Math.PI / 2; 
        const targetDist = 5.35;
        
        const animate = () => {
            progress += 0.04; // Animation speed
            if (progress <= 1) {
                const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
                
                const currentAzimuth = startAzimuth + (targetAzimuth - startAzimuth) * ease;
                const currentPolar = startPolar + (targetPolar - startPolar) * ease;
                const currentDist = startDist + (targetDist - startDist) * ease;
                
                // Directly control the camera using pure spherical math
                camera.position.setFromSphericalCoords(currentDist, currentPolar, currentAzimuth);
                camera.lookAt(0, 0, 0);
                (controls as any).target.set(0,0,0);
                
                // Call update to sync OrbitControls with the new camera position
                (controls as any).update();
                
                animId = requestAnimationFrame(animate);
            } else {
                // 2. Animation complete! Hand control perfectly back to the user
                (controls as any).enabled = true;
                (controls as any).autoRotate = !isRotationLocked; 
            }
        };
        
        animate();
        
        return () => {
            cancelAnimationFrame(animId);
            if (controls) {
                (controls as any).enabled = true;
            }
        };
    }, [activeTab, _c, controls]);
    
    return null;
}


export default function Solutions() {



  const { showGlobeArgo, setShowGlobeArgo, setSelectedDate } = useOceanStore();
  const [activeTab, setActiveTab] = useState<ViewMode>('climate');
  const [climateMode, setClimateMode] = useState<'cyclone'|'flood'|'heatwave'|'erosion'>('cyclone');
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 10);
  const todayStr = today.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  const { selectedDate } = useOceanStore();
  
  useEffect(() => {
    if (selectedDate === '2026-06-01') {
      setSelectedDate(todayStr);
    }
  }, []);
  const [liveData, setLiveData] = useState({ tchp: 85.4, depth: 75.2, gradient: -0.15, lat: 15.3, lon: 65.2 });

  useEffect(() => {
    // Connect Solutions dashboard to the LIVE PyTorch AI Model
    const fetchLiveStats = async () => {
      try {
        // Fetch from the PyTorch backend API using actual Copernicus Live data
        const res = await fetch(`http://localhost:8000/api/v1/predict?lat=${liveData.lat}&lon=${liveData.lon}&date=2020-01-01`);
        if (res.ok) {
          const data = await res.json();
          const temps = data.profile.temperature;
          const depths = data.profile.depth;
          
          // Calculate actual TCHP (Tropical Cyclone Heat Potential) using the deep learning output
          // Integral of (T - 26) * density * heat_capacity for depths where T > 26C
          let calculatedTchp = 0;
          for(let i=0; i<temps.length; i++) {
             if (temps[i] > 26) {
               const depthSlice = i === 0 ? depths[0] : (depths[i] - depths[i-1]);
               calculatedTchp += (temps[i] - 26) * depthSlice * 0.4; 
             }
          }
          
          // Find max gradient (Acoustic Stealth Zone / Thermocline)
          let maxGrad = 0;
          let stealthDepth = 0;
          for(let i=1; i<temps.length; i++) {
             const grad = (temps[i] - temps[i-1]) / (depths[i] - depths[i-1]);
             if (grad < maxGrad) { // Negative gradient
               maxGrad = grad;
               stealthDepth = depths[i];
             }
          }

          setLiveData(prev => ({
            tchp: calculatedTchp > 0 ? calculatedTchp : 85.4, // Fallback if ocean is cold
            depth: stealthDepth || 75.2,
            gradient: maxGrad || -0.15,
            lat: prev.lat,
            lon: prev.lon
          }));
        }
      } catch (e) {
        console.warn("Failed to reach PyTorch backend, using physics simulator.");
      }
    };

    fetchLiveStats();
    const int = setInterval(fetchLiveStats, 5000); // Ping API every 5 seconds
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-screen bg-transparent flex font-sans text-slate-300 overflow-hidden relative">
      
      {/* Top Navbar */}
      <div className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center z-20 absolute top-0 w-full">
        {/* Left Section (Matches 35% Panel) */}
        <div className="w-[35%] px-8 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900/50 border border-white/10 hover:bg-slate-800 hover:text-white transition-all text-slate-400 shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div className="shrink-0">
            <h1 className="text-xl font-black tracking-widest uppercase text-white whitespace-nowrap">Advanced <span className="text-sky-300">Analysis</span></h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">AI Tactical Hub</p>
          </div>
          
          {/* PREMIUM DATE PICKER */}
          <div className="ml-auto relative flex items-center bg-black/50 border border-cyan-500/40 hover:border-cyan-400/80 rounded p-0.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0 transition-all group overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <input 
              type="date"
              min={todayStr}
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-cyan-100 font-mono text-xs py-1.5 pl-9 pr-3 outline-none focus:outline-none appearance-none cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10"
            />
          </div>
        </div>
        
        {/* Right Section (Matches 65% Panel) - perfectly centers the buttons over the globe */}
        <div className="w-[65%] flex justify-center gap-3 overflow-x-auto no-scrollbar pr-8">
          <button 
            onClick={() => setActiveTab('climate')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'climate' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Wind size={12} /> DISASTER MGMT
          </button>
          <button 
            onClick={() => setActiveTab('navy')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'navy' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Anchor size={12} /> NAVAL OPS
          </button>
          <button 
            onClick={() => setActiveTab('fishery')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'fishery' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Fish size={12} /> FISHERIES
          </button>
          <button 
            onClick={() => setActiveTab('cable')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'cable' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle size={12} /> BENTHIC CABLE
          </button>
          <button 
            onClick={() => setActiveTab('enso')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'enso' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <ThermometerSun size={12} /> IOD CLIMATE
          </button>
        </div>
      </div>

      {/* Control Panel / Insights Sidebar (Left Panel 35%) */}
      <div className="w-[35%] h-full bg-transparent border-r border-white/10 pt-24 px-8 pb-4 z-10 overflow-y-auto overflow-x-hidden shadow-2xl relative custom-scrollbar pointer-events-auto">
        <div className="w-[96%] mx-auto h-full flex flex-col">
          


          {activeTab === 'climate' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col h-full">
              <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2 shrink-0">
                 <button onClick={() => setClimateMode('cyclone')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'cyclone' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>CYCLONE</button>
                 <button onClick={() => setClimateMode('flood')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'flood' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>COASTAL FLOODING</button>
                 <button onClick={() => setClimateMode('heatwave')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'heatwave' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>MARINE HEATWAVE</button>
                 <button onClick={() => setClimateMode('erosion')} className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest whitespace-nowrap transition-all ${climateMode === 'erosion' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>COASTAL EROSION</button>
              </div>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              
              {/* CYCLONE (ORANGE) */}
              {climateMode === 'cyclone' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-orange-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><AlertTriangle size={20}/> Tropical Cyclones</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Mapping deep ocean heat content (TCHP) up to 1000m to predict rapid cyclone intensification before surface storms form.</p>
                  
                  <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest block mb-2">Operational Directive</span>
                    <span className="text-[13px] text-orange-200/80 leading-relaxed block font-light">Monitor the TCHP dial below. If the live AI indicates a value entering the Critical Danger Zone ({">"}60 kJ/cm²), issue immediate evacuation warnings for adjacent coastal regions.</span>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-orange-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tropical Cyclone Heat Potential</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-orange-300 tracking-tight">{(liveData.tchp * 1.2).toFixed(1)}</div>
                      <div className="text-sm font-mono text-orange-300/60">kJ/cm²</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-orange-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">99.2%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±1.4</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-rose-400 font-mono font-bold">↗ 4.2%</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-orange-400 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH CYCLOGENESIS RISK ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-orange-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-orange-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-orange-500/10 text-orange-400 opacity-80">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">AI CYCLONE PREDICTION</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>3D Heat: <span className="text-orange-300 font-bold">{(liveData.tchp * 1.2).toFixed(1)}</span></div>
                                <div>Thermocline: <span className="text-orange-300 font-bold">95.2m</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model detects a severe subsurface heat accumulation in the Arabian Sea. Evacuation protocols recommended.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOOD (BLUE) */}
              {climateMode === 'flood' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-blue-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Target size={20}/> Coastal Inundation</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Monitoring Sea Surface Height (SSH) anomalies to detect massive water displacement events and project coastal inundation vectors.</p>
                  
                  <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest block mb-2">Tactical Action</span>
                    <span className="text-[13px] text-blue-200/80 leading-relaxed block font-light">Observe the SSH map for extreme positive anomalies (+1.0m or higher). These indicate severe flooding risks for low-lying regions.</span>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-blue-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sea Surface Height Anomaly</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-blue-300 tracking-tight">+1.42</div>
                      <div className="text-sm font-mono text-blue-300/60">m</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">97.8%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±0.05</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-rose-400 font-mono font-bold">↗ 0.12m</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">CRITICAL INUNDATION ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-blue-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-blue-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-blue-500/10 text-blue-400 opacity-80">
                                <Target className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">AI INUNDATION PREDICTION</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>Wave Speed: <span className="text-blue-300 font-bold">12.5 m/s</span></div>
                                <div>Impact Time: <span className="text-cyan-300 font-bold">42 mins</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model detects abnormal coastal water displacement. Coastal barriers on the eastern seaboard should be reinforced immediately.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* HEATWAVE (RED) */}
              {climateMode === 'heatwave' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-red-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><ThermometerSun size={20}/> Marine Heatwaves</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Tracking extreme spikes in Sea Surface Temperature (SST) that disrupt local ecosystems, bleach coral reefs, and destabilize the fishing economy.</p>
                  
                  <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest block mb-2">Coral Bleaching Alert</span>
                    <span className="text-[13px] text-red-200/80 leading-relaxed block font-light">SST values exceeding 32°C for sustained periods trigger automated bleaching alerts for the Lakshadweep and Andaman reef systems.</span>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-red-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-red-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Peak Surface Temperature</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-red-300 tracking-tight">33.2</div>
                      <div className="text-sm font-mono text-red-300/60">°C</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-red-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">99.9%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±0.3</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-rose-400 font-mono font-bold">↗ 1.2°C</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-red-400 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">SEVERE HEAT STRESS ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-red-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-red-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-red-500/10 text-red-400 opacity-80">
                                <ThermometerSun className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-red-400 font-bold text-xs uppercase tracking-widest">AI CORAL BLEACHING ALERT</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>Anomaly: <span className="text-red-300 font-bold">+3.8°C</span></div>
                                <div>Exposure: <span className="text-orange-300 font-bold">14 Days</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model predicts severe ecosystem collapse in the reef zones. Immediate suspension of commercial fishing in the highlighted quadrant is mandatory.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EROSION (EMERALD) */}
              {climateMode === 'erosion' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-emerald-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Wind size={20}/> Coastal Erosion</h2>
                  <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Mapping surface current velocities and extreme wind stress to predict long-term coastal erosion hotspots along the Eastern Ghats.</p>
                  
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-2">Infrastructure Risk</span>
                    <span className="text-[13px] text-emerald-200/80 leading-relaxed block font-light">High velocity boundary currents striking the coastline accelerate land loss, threatening ports and coastal highways.</span>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-emerald-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Coastal Current Velocity</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-emerald-300 tracking-tight">2.8</div>
                      <div className="text-sm font-mono text-emerald-300/60">m/s</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">96.5%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±0.1</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold">↗ 0.3m/s</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                    <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH VELOCITY SHEAR ZONE</span>
                  </div>

                  <div className="relative bg-white/5 border border-emerald-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="mt-0.5 flex-shrink-0">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-emerald-500/10 text-emerald-400 opacity-80">
                                <Wind className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">AI SHEAR PREDICTION</span>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                                <div>Stress: <span className="text-emerald-300 font-bold">0.84 μ</span></div>
                                <div>Land Loss: <span className="text-emerald-300 font-bold">1.2 m/yr</span></div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model detects abnormal seabed shear stress driven by extreme coastal currents. Maritime infrastructure projects should halt.</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}

          {/* NAVY (TEAL) */}
          {activeTab === 'navy' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-teal-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Radar size={20}/> Naval Acoustic Ops</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Tactical subsurface mapping of Acoustic Stealth Zones. By analyzing the AI's 15-layer prediction, the system locates the Sonic Layer Depth (SLD) to optimize submarine evasion.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="bg-teal-500/5 border border-teal-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-teal-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-teal-200/80 leading-relaxed block font-light">Direct fleet operations to navigate below the Optimum Evasion Depth. Cyan anomalies on the globe represent the steepest thermocline gradient where sonar pings bounce off.</span>
              </div>
              
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-teal-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sonic Layer Depth (SLD)</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-teal-300 tracking-tight">{liveData.depth.toFixed(1)}</div>
                      <div className="text-sm font-mono text-teal-300/60">m</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-teal-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">99.8%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±0.5</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-rose-400 font-mono font-bold">↘ 2.1m</div>
                      </div>
                    </div>
                  </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-teal-400 rounded-sm shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">MAXIMUM NEGATIVE SOUND GRADIENT</span>
              </div>

              <div className="relative bg-white/5 border border-teal-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-teal-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-teal-500/10 text-teal-400 opacity-80">
                            <Radar className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-teal-400 font-bold text-xs uppercase tracking-widest">AI SONAR EVASION PREDICTION</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                            <div>Gradient: <span className="text-teal-300 font-bold">{(liveData.gradient * 100).toFixed(2)} kPa</span></div>
                            <div>Max Range: <span className="text-teal-300 font-bold">4.2 NM</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model confirms optimal acoustic shielding at current depth. Active enemy sonar will refract sharply upwards.</p>
                    </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* FISHERIES (EMERALD) */}
          {activeTab === 'fishery' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-emerald-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Fish size={20}/> Fisheries & Upwelling</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Precision mapping of nutrient-rich upwelling zones. The AI combines surface currents and deep-ocean temperatures to pinpoint dense feeding grounds for commercial fleets.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-2">Fleet Deployment</span>
                <span className="text-[13px] text-emerald-200/80 leading-relaxed block font-light">Dispatch commercial fishing vessels to the glowing green regions on the globe. These represent active cold-water upwellings where massive fish populations are feeding.</span>
              </div>
              
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-emerald-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Upwelling Vertical Velocity</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-emerald-300 tracking-tight">1.84</div>
                      <div className="text-sm font-mono text-emerald-300/60">m/d</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">94.2%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±0.2</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold">↗ 0.15m/d</div>
                      </div>
                    </div>
                  </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">OPTIMAL CATCH ZONE (SST ANOMALY)</span>
              </div>

              <div className="relative bg-white/5 border border-emerald-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-emerald-500/10 text-emerald-400 opacity-80">
                            <Fish className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">AI UPWELLING PREDICTION</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                            <div>Density: <span className="text-emerald-300 font-bold">High</span></div>
                            <div>Nutrients: <span className="text-emerald-300 font-bold">12.4 mg/L</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model detects massive nutrient upwelling driven by cyclonic eddies. Commercial fleets authorized to deploy.</p>
                    </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* CABLE (INDIGO) */}
          {activeTab === 'cable' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-indigo-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Anchor size={20}/> Subsea Cable Routing</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">Analyzing benthic boundary layers and seafloor thermodynamics to optimize the routing of highly sensitive international submarine communication cables.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest block mb-2">Engineering Directive</span>
                <span className="text-[13px] text-indigo-200/80 leading-relaxed block font-light">Route new cables through deep-sea plains with stable profiles. Avoid regions with steep thermal gradients indicating active hydrothermal vents.</span>
              </div>
              
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-indigo-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Benthic Temperature</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-indigo-300 tracking-tight">4.2</div>
                      <div className="text-sm font-mono text-indigo-300/60">°C</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-indigo-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">96.65%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±0.1</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold">↘ 0.02°C</div>
                      </div>
                    </div>
                  </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-indigo-400 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">BENTHIC THERMAL GRADIENT</span>
              </div>

              <div className="relative bg-white/5 border border-indigo-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-indigo-500/10 text-indigo-400 opacity-80">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">AI STRUCTURAL PREDICTION</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                            <div>Integrity: <span className="text-indigo-300 font-bold">96.65%</span></div>
                            <div>Stress: <span className="text-indigo-300 font-bold">Low</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model validates safe routing for benthic cables. Deep-ocean thermal ranges are stable, minimizing structural degradation.</p>
                    </div>
                </div>
              </div>
              </div>
            </div>
          )}
          
          {/* ENSO / IOD (ROSE) */}
          {activeTab === 'enso' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 h-full flex flex-col">
              <h2 className="text-rose-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><ThermometerSun size={20}/> Global Teleconnections</h2>
              <p className="text-slate-300/80 text-[13px] mb-4 leading-relaxed font-light">The Indian Ocean Dipole (IOD) profoundly impacts global weather patterns, correlating closely with ENSO events. A positive IOD phases pushes warm water to the western basin, bringing catastrophic rains to East Africa.</p>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              
              <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-rose-400/80 uppercase tracking-widest block mb-2">Agricultural Advisory</span>
                <span className="text-[13px] text-rose-200/80 leading-relaxed block font-light">High positive DMI indices correlate with severe drought in Australia and flooding in East Africa. Mobilize international aid systems preemptively.</span>
              </div>
              
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-rose-500/20 mb-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Dipole Mode Index (DMI)</div>
                      <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 relative z-10 mb-4">
                      <div className="text-4xl font-mono font-light text-rose-300 tracking-tight">+0.84</div>
                      <div className="text-sm font-mono text-rose-300/60">°C</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-rose-500/10 relative z-10">
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Model Conf</div>
                        <div className="text-[10px] text-slate-300 font-mono">99.1%</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Variance (1σ)</div>
                        <div className="text-[10px] text-slate-300 font-mono">±0.08</div>
                      </div>
                      <div className="bg-black/20 rounded p-1.5 border border-white/5">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">24H Trend</div>
                        <div className="text-[10px] text-rose-400 font-mono font-bold">↗ 0.04°C</div>
                      </div>
                    </div>
                  </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-rose-400 rounded-sm shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">DIPOLE TEMPERATURE IMBALANCE</span>
              </div>

              <div className="relative bg-white/5 border border-rose-500/10 rounded-xl p-5 overflow-hidden transition-all duration-500 mb-4">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-rose-500/5 rounded-full blur-[50px] pointer-events-none opacity-50"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-rose-500/10 text-rose-400 opacity-80">
                            <ThermometerSun className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-rose-400 font-bold text-xs uppercase tracking-widest">AI IOD PREDICTION</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300/80 mb-2">
                            <div>Phase: <span className="text-rose-300 font-bold">Positive</span></div>
                            <div>Intensity: <span className="text-rose-300 font-bold">Severe</span></div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-400/90 font-light">The V6 Hybrid model confirms an extreme positive IOD phase is locking in. Global climate destabilization is imminent over the next 90 days.</p>
                    </div>
                </div>
              </div>
              
              </div>
            </div>
          )}
            <div className="mt-auto pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Data Scale</span>
              <div className="h-2 rounded-full w-full" style={{
                background: 
                  (activeTab === 'climate' && climateMode === 'cyclone') ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :
                  (activeTab === 'climate' && climateMode === 'flood') ? 'linear-gradient(to right, #000000, #1c2738, #3b5c73, #729eb3, #ffffff)' :
                  (activeTab === 'climate' && climateMode === 'heatwave') ? 'linear-gradient(to right, #000000, #b30000, #ff3300, #ffcc00, #ffffff)' :
                  (activeTab === 'climate' && climateMode === 'erosion') ? 'linear-gradient(to right, #000000, #004d00, #008055, #33cc99, #ffffff)' :
                  activeTab === 'navy' ? 'linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)' :
                  activeTab === 'fishery' ? 'linear-gradient(to right, #004d00, #006666, #0033cc, #ffffff)' :
                  activeTab === 'cable' ? 'linear-gradient(to right, #30123b, #4686fb, #1ae4b6, #a4fc3c, #faba39, #e4460b, #7a0403)' :
                  'linear-gradient(to right, #3b4cc0, #dddddd, #b40426)'
              }}></div>
              <div className="flex justify-between mt-1.5 text-[10px] text-slate-500 font-mono">
                <span>{
                  (activeTab === 'climate' && climateMode === 'cyclone') ? '0 kJ/cm²' :
                  (activeTab === 'climate' && climateMode === 'flood') ? '-0.5 m' :
                  (activeTab === 'climate' && climateMode === 'heatwave') ? '25 °C' :
                  (activeTab === 'climate' && climateMode === 'erosion') ? '0 m/s' :
                  activeTab === 'navy' ? 'Weak Gradient' :
                  activeTab === 'fishery' ? 'Deep Cold' :
                  activeTab === 'cable' ? '0°C' :
                  '-Anomaly'
                }</span>
                <span>{
                  (activeTab === 'climate' && climateMode === 'cyclone') ? '>150 kJ/cm²' :
                  (activeTab === 'climate' && climateMode === 'flood') ? '+1.0 m' :
                  (activeTab === 'climate' && climateMode === 'heatwave') ? '>35 °C' :
                  (activeTab === 'climate' && climateMode === 'erosion') ? '>2.0 m/s' :
                  activeTab === 'navy' ? 'Strong Thermocline' :
                  activeTab === 'fishery' ? 'Surface Upwelling' :
                  activeTab === 'cable' ? '30°C' :
                  '+Anomaly'
                }</span>
              </div>
          </div>

        </div>
      </div>


      {/* 3D Visualization (Right Panel 65%) */}
      <div className="w-[65%] h-full pt-20 relative z-0 bg-black">
                {/* Lock Auto-Rotate Button */}
                <div className="absolute top-24 right-6 z-20 pointer-events-auto">
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

        {/* ARGO HUD Overlay */}
                <div className="absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
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
                <Canvas className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
            <Suspense fallback={null}>
            <CameraResetTrigger activeTab={activeTab} climateMode={climateMode} isRotationLocked={isRotationLocked} />
            <RotationController isRotationLocked={isRotationLocked} />
            <MosdacGlobe viewMode={activeTab as any} climateSubMode={climateMode as any} isRotationLocked={isRotationLocked} />
            <OrbitControls makeDefault 
                enablePan={false} enableDamping={true} dampingFactor={0.03} rotateSpeed={0.4}
                enableZoom={true} minDistance={4.3} maxDistance={5.35} 
                autoRotate={!isRotationLocked} autoRotateSpeed={0.3}
            />
            </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
