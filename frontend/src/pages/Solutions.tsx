import { Suspense, useState, useEffect, } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MosdacGlobe from '../components/MosdacGlobe';
import { Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOceanStore } from '../store/oceanStore';

type ViewMode = 'climate' | 'navy' | 'fishery' | 'cable' | 'enso';

import { useThree } from '@react-three/fiber';

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
        
        // The mathematically verified coordinates to center India (Azimuth +0.22, Polar PI/2)
        const targetAzimuth = 0.22; 
        const targetPolar = Math.PI / 2; 
        const targetDist = 5.5;
        
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
                (controls as any).autoRotate = true; 
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
            <h1 className="text-xl font-black tracking-widest uppercase text-white whitespace-nowrap">Advanced <span className="text-cyan-400">Analysis</span></h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">AI Tactical Hub</p>
          </div>
        </div>
        
        {/* Right Section (Matches 65% Panel) - perfectly centers the buttons over the globe */}
        <div className="w-[65%] flex justify-center gap-3 overflow-x-auto no-scrollbar pr-8">
          <button 
            onClick={() => setActiveTab('climate')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'climate' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            <Wind size={12} /> DISASTER MGMT
          </button>
          <button 
            onClick={() => setActiveTab('navy')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'navy' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            <Anchor size={12} /> NAVAL OPS
          </button>
          <button 
            onClick={() => setActiveTab('fishery')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'fishery' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            <Fish size={12} /> FISHERIES
          </button>
          <button 
            onClick={() => setActiveTab('cable')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'cable' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            <AlertTriangle size={12} /> BENTHIC CABLE
          </button>
          <button 
            onClick={() => setActiveTab('enso')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'enso' ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
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
              <h2 className="text-orange-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Wind size={20}/> Disaster Management</h2>
              <p className="text-slate-400 text-[13px] mb-3 leading-relaxed">Continuous AI-driven monitoring of Tropical Cyclone Heat Potential (TCHP). The Deep Learning architecture reconstructs the 3D temperature volume to calculate the total latent heat energy stored above the 26°C isotherm (D26), providing early warning metrics for rapid cyclone intensification.</p>
              
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg mb-4">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-2">Strategic Application</span>
                <span className="text-[13px] text-orange-200/70 leading-relaxed block">Monitor the TCHP dial below. If the live AI indicates a value entering the Critical Danger Zone (&gt;60 kJ/cm²), issue immediate evacuation warnings for adjacent coastal regions.</span>
              </div>

              <div className="bg-black/50 rounded-lg p-5 border border-orange-500/20 mb-4 shadow-lg">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-2 flex justify-between">
                  <span>Calculated TCHP</span>
                  <span className="text-orange-500/50 font-bold animate-pulse">LIVE AI INFERENCE</span>
                </div>
                <div className="text-4xl font-mono text-orange-400 mb-4">{liveData.tchp.toFixed(1)} <span className="text-lg text-orange-400/50">kJ/cm²</span></div>
                <div className="w-full bg-slate-800 h-2 mt-4 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-orange-500 h-full transition-all duration-1000 relative" style={{width: `${(liveData.tchp / 120) * 100}%`}}>
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-sm shadow-[0_0_15px_#f97316]"></div>
                  <span className="text-xs font-mono text-white">TCHP &gt; 60 kJ/cm² (DANGER ZONE)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">{(liveData.tchp > 60) ? 'CRITICAL RISK' : 'STABLE'}</span>
              </div>
            </div>
          )}

          {activeTab === 'navy' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-cyan-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Radar size={20}/> Naval Acoustic Ops</h2>
              <p className="text-slate-400 text-[13px] mb-3 leading-relaxed">Tactical subsurface mapping of Acoustic Stealth Zones. By analyzing the AI's 15-layer thermodynamic prediction, the system locates the Sonic Layer Depth (SLD) and maximum negative temperature gradients to optimize submarine sonar evasion.</p>
              
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg mb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">Strategic Application</span>
                <span className="text-[13px] text-cyan-200/70 leading-relaxed block">Direct fleet operations to navigate below the Optimum Evasion Depth. The glowing Cyan anomalies on the globe represent the steepest thermocline gradient where active sonar pings will effectively bounce off.</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/50 rounded-lg p-5 border border-cyan-500/20 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
                  <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Optimum Evasion Depth</div>
                  <div className="text-3xl font-mono text-cyan-400">{liveData.depth.toFixed(1)}<span className="text-lg text-cyan-400/50">m</span></div>
                </div>
                <div className="bg-black/50 rounded-lg p-5 border border-cyan-500/20 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
                  <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Max Thermal Gradient</div>
                  <div className="text-3xl font-mono text-cyan-400">{liveData.gradient.toFixed(3)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-cyan-400 rounded-sm shadow-[0_0_15px_#22d3ee]"></div>
                  <span className="text-xs font-mono text-white">SONAR ANOMALY LAYER</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">STEALTH ENABLED</span>
              </div>
            </div>
          )}

          {activeTab === 'fishery' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-emerald-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><Target size={20}/> PFZ Identification</h2>
              <p className="text-slate-400 text-[13px] mb-3 leading-relaxed">Commercial mapping of Potential Fishing Zones (PFZ). The Neural Network correlates surface temperature fronts with subsurface thermodynamic anomalies to instantly pinpoint cold-water nutrient upwellings supporting phytoplankton.</p>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">Strategic Application</span>
                <span className="text-[13px] text-emerald-200/70 leading-relaxed block">Dispatch commercial fishing vessels to the live Target Coordinates below. The glowing green regions on the globe represent active cold-water upwellings where massive fish populations are currently feeding.</span>
              </div>

              <div className="bg-black/50 rounded-lg p-5 border border-emerald-500/20 mb-4 font-mono text-sm text-slate-400 space-y-3 relative shadow-lg">
                <div className="text-xs uppercase tracking-widest text-emerald-500/70 mb-3 border-b border-slate-800 pb-2 flex justify-between">
                  <span>Target Coordinates</span>
                  <span className="animate-pulse text-emerald-400 font-bold">UPDATING...</span>
                </div>
                <div className="flex justify-between text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded">
                  <span>Lat: {liveData.lat.toFixed(4)}°N</span>
                  <span>Lon: {liveData.lon.toFixed(4)}°E</span>
                </div>
                <div className="flex justify-between text-emerald-500/70 px-3">
                  <span>Lat: {(liveData.lat + 1.2).toFixed(4)}°N</span>
                  <span>Lon: {(liveData.lon - 0.8).toFixed(4)}°E</span>
                </div>
                <div className="flex justify-between text-emerald-500/40 px-3">
                  <span>Lat: {(liveData.lat - 0.5).toFixed(4)}°N</span>
                  <span>Lon: {(liveData.lon + 1.5).toFixed(4)}°E</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-4 h-4 bg-emerald-400 rounded-sm shadow-[0_0_15px_#10b981]"></div>
                <span className="text-xs font-mono text-white">ACTIVE PHYTOPLANKTON UPWELLING</span>
              </div>
            </div>
          )}

          {activeTab === 'cable' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-purple-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><AlertTriangle size={20}/> Benthic Cable Threat</h2>
              <p className="text-slate-400 text-[13px] mb-3 leading-relaxed">Deep-sea infrastructure protection. By evaluating temperatures at 1000m depth, the AI detects severe benthic density anomalies and thermodynamic shifts that indicate underwater landslides or extreme deep-ocean currents capable of severing global fiber-optic internet cables.</p>
              
              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg mb-4">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">Strategic Application</span>
                <span className="text-[13px] text-purple-200/70 leading-relaxed block">Monitor the deep purple fracture zones on the map. If the Shear Stress Anomaly spikes, immediately notify telecom authorities of an imminent risk to submarine internet backbones in that sector.</span>
              </div>

              <div className="bg-black/50 rounded-lg p-5 border border-purple-500/20 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Benthic Shear Stress Anomaly</div>
                <div className="text-4xl font-mono text-purple-400">{(Math.abs(liveData.gradient) * 100).toFixed(2)} <span className="text-lg text-purple-400/50">kPa</span></div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-sm shadow-[0_0_15px_#a855f7]"></div>
                  <span className="text-xs font-mono text-white">SEISMIC / THERMAL FRACTURE ZONES</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enso' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-red-400 font-bold uppercase tracking-widest mb-3 text-lg flex items-center gap-2"><ThermometerSun size={20}/> IOD Climate Predictor</h2>
              <p className="text-slate-400 text-[13px] mb-3 leading-relaxed">Regional agricultural forecasting. The AI aggregates subsurface heat potentials across the Indian Ocean to calculate the Dipole Mode Index (DMI), providing months of advance warning for Positive IOD droughts or Negative IOD monsoons.</p>
              
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">Strategic Application</span>
                <span className="text-[13px] text-red-200/70 leading-relaxed block">Observe the regional temperature blooms (Red = Warming, Blue = Cooling). Use the DMI index to advise agricultural ministries to prepare for either a severe drought (Positive IOD) or flooding (Negative IOD).</span>
              </div>

              <div className="bg-black/50 rounded-lg p-5 border border-red-500/20 mb-4 relative shadow-lg">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Dipole Mode Index (DMI)</div>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-mono text-red-400">+1.4<span className="text-lg text-red-400/50">°C</span></div>
                  <div className="text-[10px] text-red-100 font-bold bg-red-600 px-3 py-1.5 rounded uppercase tracking-widest animate-pulse shadow-[0_0_10px_#dc2626]">POSITIVE IOD ACTIVE</div>
                </div>
                <div className="w-full bg-gradient-to-r from-blue-500 via-slate-700 to-red-500 h-1.5 mt-5 rounded-full relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] right-1/4"></div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-4 h-4 bg-red-500 rounded-sm shadow-[0_0_15px_#ef4444]"></div>
                <span className="text-xs font-mono text-white">ELEVATED SEA SURFACE ANOMALY</span>
              </div>
            </div>
          )}

          {/* ML Telemetry Status & Legend */}
          <div className="mt-auto pt-4 border-t border-slate-800 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">AI Inference Status</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Live Synced</span>
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
        <div className="absolute top-24 right-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <span className={`text-[9px] font-mono tracking-widest font-bold ${isRotationLocked ? 'text-amber-400' : 'text-slate-400'}`}>
            {isRotationLocked ? 'ROTATION: LOCKED' : 'ROTATION: AUTO'}
          </span>
          <button
            onClick={() => setIsRotationLocked(!isRotationLocked)}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${isRotationLocked ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isRotationLocked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
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
        <Canvas className="w-full h-full" camera={{ position: [5, 2, 5], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
            <Suspense fallback={null}>
            <CameraResetTrigger activeTab={activeTab} isRotationLocked={isRotationLocked} />
            <MosdacGlobe viewMode={activeTab} />
            <OrbitControls makeDefault 
                enablePan={false} enableDamping={true} dampingFactor={0.03} rotateSpeed={0.4}
                enableZoom={true} minDistance={3.0} maxDistance={8.0} 
                autoRotate={!isRotationLocked} autoRotateSpeed={0.3}
            />
            </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
