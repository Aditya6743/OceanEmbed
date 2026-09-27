import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft } from 'lucide-react';

interface RoutingSar2DMapProps {
  activeMode: 'routing' | 'sar';
  simState: 'idle' | 'running' | 'complete';
  sarTimeHour: number;
  showThermalRisk: boolean;
  showCurrents: boolean;
  onClose: () => void;
}

// Math helper for 2D Bezier curves in Lat/Lon
function getBezierPoints(p0: [number, number], p1: [number, number], p2: [number, number], steps = 40) {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = Math.pow(1 - t, 2) * p0[0] + 2 * (1 - t) * t * p1[0] + Math.pow(t, 2) * p2[0];
    const lon = Math.pow(1 - t, 2) * p0[1] + 2 * (1 - t) * t * p1[1] + Math.pow(t, 2) * p2[1];
    points.push([lat, lon]);
  }
  return points;
}

// Map Auto-Fitter
function MapFitter({ activeMode }: { activeMode: 'routing' | 'sar' }) {
  const map = useMap();
  useEffect(() => {
    // Keep a consistent wide tactical view for both modes so SAR doesn't awkwardly zoom in too much
    map.fitBounds([[10.0, 78.0], [17.0, 94.0]], { padding: [50, 50], animate: true });
  }, [activeMode, map]);
  return null;
}

export default function RoutingSar2DMap({ activeMode, simState, sarTimeHour, showThermalRisk, showCurrents, onClose }: RoutingSar2DMapProps) {
  
  // Routing Points
  const rStart: [number, number] = [13.08, 80.27];
  const rEnd: [number, number] = [11.62, 92.72];
  const rMidOpt: [number, number] = [15.25, 86.5];
  const rMidStd: [number, number] = [12.35, 86.5];
  
  const routePointsOpt = useMemo(() => getBezierPoints(rStart, rMidOpt, rEnd), []);
  const routePointsStd = useMemo(() => getBezierPoints(rStart, rMidStd, rEnd), []);
  
  // SAR Points
  const sStart: [number, number] = [11.5, 85.2];
  const sEnd: [number, number] = [14.5, 87.8];
  const sMid: [number, number] = [13.0, 86.5];
  
  const sarPoints = useMemo(() => getBezierPoints(sStart, sMid, sEnd), []);

  // Generate Current Vectors Grid
  const currentVectors = useMemo(() => {
    const vectors = [];
    for(let lat = 8.5; lat <= 17.5; lat += 1) {
      for(let lon = 78; lon <= 94; lon += 1) {
        // Mask out landmasses (India, Sri Lanka, Myanmar, Andaman)
        const isLand = 
          (lat < 10.0 && lon > 79.5 && lon < 82.0) || 
          (lat <= 15.0 && lon < 80.2) ||
          (lat > 15.0 && lat <= 16.0 && lon < 81.0) ||
          (lat > 16.0 && lat <= 17.0 && lon < 82.5) ||
          (lat > 17.0 && lon < 84.0) ||
          (lat > 14.5 && lon > 93.5) ||
          (lat > 16.0 && lon > 93.0) ||
          (lat > 10.5 && lat < 13.5 && lon > 92.5 && lon < 93.2);
          
        if (isLand) continue;

        // Procedural flow direction matching 3D (roughly South-West curl)
        const angle = (Math.sin(lat * 0.5) + Math.cos(lon * 0.5)) * 45 + 135; 
        vectors.push({ lat, lon, angle });
      }
    }
    return vectors;
  }, []);

  
  // SAR active position based on time
  const progress = sarTimeHour / 24;
  const currentSarPos = sarPoints[Math.floor(progress * (sarPoints.length - 1))];
  // Calculate radius (in meters) - max at 24H is roughly 150km
  const sarRadius = 15000 + (progress * 135000);

  // Custom CSS Icons
  
  const vesselAlphaLabel = useMemo(() => L.divIcon({
    className: '',
    iconSize: null as any,
    html: '<div class="text-cyan-400 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: -30px;">VESSEL ALPHA</div>'
  }), []);

  const thermalHazardLabel = useMemo(() => L.divIcon({
    className: '',
    iconSize: null as any,
    html: '<div class="text-amber-500 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: -12px;">THERMAL HAZARD</div>'
  }), []);

  const lkpLabel = useMemo(() => L.divIcon({
    className: '',
    iconSize: null as any,
    html: '<div class="text-rose-400 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: 15px;">LKP (INCIDENT)</div>'
  }), []);

  const searchAreaLabel = useMemo(() => L.divIcon({
    className: '',
    iconSize: null as any,
    html: `<div class="text-rose-400 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: -35px;">SEARCH AREA (+${sarTimeHour}H)</div>`
  }), [sarTimeHour]);

  const vesselIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;background:white;border:2px solid #333;transform:rotate(45deg);box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  
  const lkpIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;background:#f43f5e;border-radius:50%;box-shadow:0 0 15px #f43f5e;animation:pulse 2s infinite;"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  return (
    <div className="absolute inset-0 z-20 bg-slate-900 rounded-l-3xl overflow-hidden border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-500">
      
      {/* Top Bar overlay */}
      <div className="absolute top-6 right-6 z-[1000] flex gap-3 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 pointer-events-auto">
           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
           <span className="text-emerald-400 font-mono text-xs font-bold tracking-widest">TACTICAL 2D LINK ACTIVE</span>
        </div>
        <button 
          onClick={onClose}
          className="bg-black/60 hover:bg-black/80 border border-white/10 hover:border-indigo-500/50 text-indigo-300 px-4 py-2 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg pointer-events-auto"
        >
          <ArrowLeft size={14} /> BACK TO 3D GLOBE
        </button>
      </div>

      <MapContainer 
        center={[13.5, 85.0]} 
        zoom={6} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}
        zoomControl={false}
      >
        <MapFitter activeMode={activeMode} />
        <TileLayer url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" className="google-dark-terrain" attribution="&copy; Google Maps" />

        {showCurrents && currentVectors.map((v, i) => (
          <Marker 
            key={`vec-${i}`} 
            position={[v.lat, v.lon]} 
            icon={L.divIcon({
              className: '',
              html: `<div style="transform: rotate(${v.angle}deg); color: #38bdf8; font-size: 16px; opacity: 0.6;">↑</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })} 
          />
        ))}


        {activeMode === 'routing' && (
          <>
            <Polyline positions={routePointsStd} color="#ef4444" weight={2} dashArray="10, 10" opacity={0.5} />
            
            {simState === 'complete' && (
               <>
                 <Polyline positions={routePointsOpt} color="#22d3ee" weight={5} opacity={0.9} />
                 {/* Vessel marker at roughly 50% along the path for tactical view */}
                 <Marker position={routePointsOpt[Math.floor(routePointsOpt.length * 0.5)]} icon={vesselIcon} />
                 <Marker position={routePointsOpt[Math.floor(routePointsOpt.length * 0.5)]} icon={vesselAlphaLabel} />
               </>
            )}

            {showThermalRisk && (
              <>
                <Circle center={[12.35, 86.5]} radius={130000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.3, weight: 2 }} />
                <Marker position={[12.35, 86.5]} icon={thermalHazardLabel} />
              </>
            )}
            
            <Circle center={rStart} radius={10000} pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 1 }} />
            <Circle center={rEnd} radius={10000} pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 1 }} />
          </>
        )}

        {activeMode === 'sar' && (
          <>
            <Marker position={sStart} icon={lkpIcon} />
            <Marker position={sStart} icon={lkpLabel} />
            
            {simState === 'complete' && (
              <>
                <Polyline positions={sarPoints} color="#fbbf24" weight={3} dashArray="10, 10" opacity={0.4} />
                
                <Marker position={currentSarPos} icon={vesselIcon} />
                
                <Circle center={currentSarPos} radius={sarRadius} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.3, weight: 2 }} />
                <Marker position={currentSarPos} icon={searchAreaLabel} />
              </>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
}
