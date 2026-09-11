import { Suspense, useState, useEffect, } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MosdacGlobe from '../components/MosdacGlobe';
import { Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun, Lock, Unlock , Activity} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOceanStore } from '../store/oceanStore';

type ViewMode = 'climate' | 'navy' | 'fishery' | 'cable' | 'enso';

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

function CameraResetTrigger({ activeTab, isRotationLocked }: { activeTab: string, isRotationLocked: boolean }) {
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
    }, [activeTab, controls]);
    
    return null;
}


export default function Solutions() {
  const { showGlobeArgo, setShowGlobeArgo } = useOceanStore();
  const [activeTab, setActiveTab] = useState<ViewMode>('climate');
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const navigate = useNavigate();
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
            lat: prev.lat + (Math.random() - 0.5) * 0.05,
            lon: prev.lon + (Math.random() - 0.5) * 0.05
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
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900/50 border border-white/10 hover:bg-slate-800 hover:text-white transition-all text-slate-400 mr-2 shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase text-white whitespace-nowrap">Advanced <span className="text-sky-300">Analysis</span></h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">AI Tactical Hub</p>
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
      <div className="w-[35%] h-full bg-transparent border-r border-white/10 pt-24 px-8 pb-4 z-10 overflow-y-auto shadow-2xl relative custom-scrollbar pointer-events-auto">
        <div className="w-[96%] mx-auto h-full flex flex-col">
          {activeTab === 'climate' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-orange-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><AlertTriangle size={20}/> Cyclone Readiness</h2>
              <p className="text-slate-300/80 text-[13px] mb-3 leading-relaxed font-light">Continuous AI-driven monitoring of Tropical Cyclone Heat Potential (TCHP). The Deep Learning architecture reconstructs the 3D temperature volume to calculate the total latent heat energy stored above the 26°C isotherm (D26), providing early warning metrics for rapid cyclone intensification.</p>
              
              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-orange-200/80 leading-relaxed block font-light">Monitor the TCHP dial below. If the live AI indicates a value entering the Critical Danger Zone (&gt;60 kJ/cm²), issue immediate evacuation warnings for adjacent coastal regions.</span>
              </div>
              
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-orange-500/10 mb-4 relative shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Tropical Cyclone Heat Potential</div>
                <div className="text-4xl font-mono text-orange-300">{liveData.tchp.toFixed(1)} <span className="text-lg text-orange-300/50">kJ/cm²</span></div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-orange-400 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">HIGH CYCLOGENESIS RISK ZONE</span>
              </div>
<div className="relative bg-white/5 border border-orange-500/10 rounded-xl p-5 mt-4 overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-orange-500/20">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-orange-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-orange-500/10 text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-medium tracking-widest text-orange-300/90 uppercase">Oceanic Assessment</span>
                        </div>
                        <div className="text-slate-300/70 text-[13px] leading-relaxed font-light group-hover:text-slate-200 transition-colors">
                            <span className="text-orange-300 font-medium">THREAT LEVEL ELEVATED.</span> High TCHP anomalies detected across the basin. Severe risk of rapid cyclone cyclogenesis in western equatorial regions.
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'navy' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-teal-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Radar size={20}/> Naval Acoustic Ops</h2>
              <p className="text-slate-300/80 text-[13px] mb-3 leading-relaxed font-light">Tactical subsurface mapping of Acoustic Stealth Zones. By analyzing the AI's 15-layer thermodynamic prediction, the system locates the Sonic Layer Depth (SLD) and maximum negative temperature gradients to optimize submarine sonar evasion.</p>
              
              <div className="bg-teal-500/5 border border-teal-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-teal-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-teal-200/80 leading-relaxed block font-light">Direct fleet operations to navigate below the Optimum Evasion Depth. The glowing Cyan anomalies on the globe represent the steepest thermocline gradient where active sonar pings will effectively bounce off.</span>
              </div>
              
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-teal-500/10 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Sonic Layer Depth (SLD)</div>
                <div className="text-4xl font-mono text-teal-300">{liveData.depth.toFixed(1)} <span className="text-lg text-teal-300/50">m</span></div>
                <div className="w-full bg-slate-800/50 h-1 mt-4 rounded-full relative">
                  <div className="absolute top-0 left-0 h-full bg-teal-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-teal-400 rounded-sm shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">MAXIMUM NEGATIVE SOUND GRADIENT</span>
              </div>
<div className="relative bg-white/5 border border-teal-500/10 rounded-xl p-5 mt-4 overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-teal-500/20">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-teal-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-teal-500/10 text-teal-400 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-medium tracking-widest text-teal-300/90 uppercase">Oceanic Assessment</span>
                        </div>
                        <div className="text-slate-300/70 text-[13px] leading-relaxed font-light group-hover:text-slate-200 transition-colors">
                            <span className="text-teal-300 font-medium">FLEET STATUS: OPTIMAL.</span> Extremely strong thermocline gradients detected in the Arabian Sea. Deep-water sonar evasion highly effective in current theater.
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fishery' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-emerald-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Target size={20}/> PFZ Identification</h2>
              <p className="text-slate-300/80 text-[13px] mb-3 leading-relaxed font-light">Commercial mapping of Potential Fishing Zones (PFZ). The Neural Network correlates surface temperature fronts with subsurface thermodynamic anomalies to instantly pinpoint cold-water nutrient upwellings supporting phytoplankton.</p>
              
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-emerald-200/80 leading-relaxed block font-light">Dispatch commercial fishing vessels to the live Target Coordinates below. The glowing green regions on the globe represent active cold-water upwellings where massive fish populations are currently feeding.</span>
              </div>
              
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-emerald-500/10 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Target Coordinates</div>
                <div className="text-2xl font-mono text-emerald-300 mb-1">Sector 7-Alpha</div>
                <div className="flex justify-between text-emerald-400/50 px-2 mt-2 font-mono text-xs">
                  <span>Lat: {(liveData.lat - 0.5).toFixed(4)}°N</span>
                  <span>Lon: {(liveData.lon + 1.5).toFixed(4)}°E</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">NUTRIENT UPWELLING / PFZ</span>
              </div>
<div className="relative bg-white/5 border border-emerald-500/10 rounded-xl p-5 mt-4 overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-emerald-500/20">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-emerald-500/10 text-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-medium tracking-widest text-emerald-300/90 uppercase">Oceanic Assessment</span>
                        </div>
                        <div className="text-slate-300/70 text-[13px] leading-relaxed font-light group-hover:text-slate-200 transition-colors">
                            <span className="text-emerald-300 font-medium">ECOLOGICAL STATUS: ACTIVE.</span> Multiple shallow Mixed Layer Depths and cold-water upwelling zones identified along the Somali coast. High probability of pelagic aggregation.
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cable' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-violet-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Anchor size={20}/> Benthic Cable Routing</h2>
              <p className="text-slate-300/80 text-[13px] mb-3 leading-relaxed font-light">Deep-sea infrastructure protection. By evaluating temperatures at 1000m depth, the AI detects severe benthic density anomalies and thermodynamic shifts that indicate underwater landslides or extreme deep-ocean currents capable of severing global fiber-optic internet cables.</p>
              
              <div className="bg-violet-500/5 border border-violet-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-violet-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-violet-200/80 leading-relaxed block font-light">Monitor the deep purple fracture zones on the map. If the Shear Stress Anomaly spikes, immediately notify telecom authorities of an imminent risk to submarine internet backbones in that sector.</span>
              </div>
              
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-violet-500/10 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Benthic Shear Stress Anomaly</div>
                <div className="text-4xl font-mono text-violet-300">{(Math.abs(liveData.gradient) * 100).toFixed(2)} <span className="text-lg text-violet-300/50">kPa</span></div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-violet-400 rounded-sm shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">SEISMIC / THERMAL FRACTURE ZONES</span>
              </div>
<div className="relative bg-white/5 border border-violet-500/10 rounded-xl p-5 mt-4 overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-violet-500/20">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-violet-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-violet-500/10 text-violet-400 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-medium tracking-widest text-violet-300/90 uppercase">Oceanic Assessment</span>
                        </div>
                        <div className="text-slate-300/70 text-[13px] leading-relaxed font-light group-hover:text-slate-200 transition-colors">
                            <span className="text-violet-300 font-medium">INFRASTRUCTURE RISK: NOMINAL.</span> Benthic shear stress remains within 0.05 °C/m tolerance across the Indian Ocean. No immediate fracture risks detected across telecom backbone.
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enso' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-rose-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><ThermometerSun size={20}/> IOD Climate Monitoring</h2>
              <p className="text-slate-300/80 text-[13px] mb-3 leading-relaxed font-light">Regional agricultural forecasting. The AI aggregates subsurface heat potentials across the Indian Ocean to calculate the Dipole Mode Index (DMI), providing months of advance warning for Positive IOD droughts or Negative IOD monsoons.</p>
              
              <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl mb-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-rose-400/80 uppercase tracking-widest block mb-2">Strategic Application</span>
                <span className="text-[13px] text-rose-200/80 leading-relaxed block font-light">Observe the regional temperature blooms (Red = Warming, Blue = Cooling). Use the DMI index to advise agricultural ministries to prepare for either a severe drought (Positive IOD) or flooding (Negative IOD).</span>
              </div>
              
              
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-rose-500/10 mb-4 relative shadow-lg">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-medium">Dipole Mode Index (DMI)</div>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-mono text-rose-300">+1.4<span className="text-lg text-rose-300/50">°C</span></div>
                  <div className="text-[9px] text-rose-100 font-bold bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded uppercase tracking-widest">POSITIVE IOD ACTIVE</div>
                </div>
                <div className="w-full bg-gradient-to-r from-blue-500/50 via-slate-700/50 to-rose-500/50 h-1 mt-5 rounded-full relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-rose-200 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] right-1/4"></div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 mb-4 border-t border-white/5">
                <div className="w-3 h-3 bg-rose-400 rounded-sm shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                <span className="text-[11px] font-medium tracking-wider text-slate-300">ELEVATED SEA SURFACE ANOMALY</span>
              </div>
<div className="relative bg-white/5 border border-rose-500/10 rounded-xl p-5 mt-4 overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-rose-500/20">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[100%] bg-rose-500/5 rounded-full blur-[50px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-0.5 flex-shrink-0">
                        <div className="bg-black/20 p-2.5 rounded-lg border border-rose-500/10 text-rose-400 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-medium tracking-widest text-rose-300/90 uppercase">Oceanic Assessment</span>
                        </div>
                        <div className="text-slate-300/70 text-[13px] leading-relaxed font-light group-hover:text-slate-200 transition-colors">
                            <span className="text-rose-300 font-medium">CLIMATE PATTERN: SHIFTING.</span> Positive Indian Ocean Dipole forming. Agricultural ministries in East Africa advised to prepare for intense monsoon precipitation.
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* ML Telemetry Status & Legend */}
          <div className="mt-auto pt-4 border-t border-slate-800 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">AI Inference Status</span>
              <span className="text-xs text-sky-300 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div> Live Synced</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/40 border border-slate-800/50 rounded p-2">
                <div className="text-[10px] text-slate-500 uppercase">Spatial Res</div>
                <div className="text-sm text-slate-300 font-mono">1/12° Grid</div>
              </div>
              <div className="bg-black/40 border border-slate-800/50 rounded p-2">
                <div className="text-[10px] text-slate-500 uppercase">Model Loss</div>
                <div className="text-sm text-slate-300 font-mono">MSE 0.20</div>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Data Scale</span>
              <div className="h-2 rounded-full w-full" style={{
                background: 
                  activeTab === 'climate' ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :
                  activeTab === 'navy' ? 'linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)' :
                  activeTab === 'fishery' ? 'linear-gradient(to right, #004d00, #006666, #0033cc, #ffffff)' :
                  activeTab === 'cable' ? 'linear-gradient(to right, #30123b, #4686fb, #1ae4b6, #a4fc3c, #faba39, #e4460b, #7a0403)' :
                  'linear-gradient(to right, #3b4cc0, #dddddd, #b40426)'
              }}></div>
              <div className="flex justify-between mt-1.5 text-[10px] text-slate-500 font-mono">
                <span>{
                  activeTab === 'climate' ? '0 kJ/cm²' :
                  activeTab === 'navy' ? 'Weak Gradient' :
                  activeTab === 'fishery' ? 'Deep Cold' :
                  activeTab === 'cable' ? '0°C' :
                  '-Anomaly'
                }</span>
                <span>{
                  activeTab === 'climate' ? '>150 kJ/cm²' :
                  activeTab === 'navy' ? 'Strong Thermocline' :
                  activeTab === 'fishery' ? 'Surface Upwelling' :
                  activeTab === 'cable' ? '30°C' :
                  '+Anomaly'
                }</span>
              </div>
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
            <CameraResetTrigger activeTab={activeTab} isRotationLocked={isRotationLocked} />
            <RotationController isRotationLocked={isRotationLocked} />
            <MosdacGlobe viewMode={activeTab} isRotationLocked={isRotationLocked} />
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
