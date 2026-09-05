import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useOceanStore } from '../store/oceanStore';
import { useEffect } from 'react';
import { Crosshair } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapRecenter({ lat, lon }: { lat: number, lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

export default function OceanMap() {
  const selectedLocation = useOceanStore(state => state.selectedLocation);

  const defaultCenter: [number, number] = [0, 0];
  const center: [number, number] = selectedLocation 
    ? [selectedLocation.latitude, selectedLocation.longitude] 
    : defaultCenter;

  return (
    <div className="w-full h-full bg-card rounded-xl border border-white/5 relative overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/5 bg-white/[0.01]">
        <h2 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Crosshair className="w-3 h-3" />
          Surface Map
        </h2>
      </div>
      
      <div className="flex-1 w-full relative">
        <MapContainer 
          center={center} 
          zoom={3} 
          style={{ height: '100%', width: '100%', background: '#020617' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />
          {selectedLocation && (
            <>
              <Marker position={center} />
              <MapRecenter lat={selectedLocation.latitude} lon={selectedLocation.longitude} />
            </>
          )}
        </MapContainer>
        
        {/* Overlay grid for scientific feel */}
        <div className="absolute inset-0 pointer-events-none border-[0.5px] border-white/5 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-[400]"></div>
      </div>
    </div>
  );
}
