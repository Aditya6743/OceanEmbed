import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Coordinates = { lat: number; lon: number };

function MapInteraction({
  value,
  onChange,
  icon,
}: {
  value: Coordinates;
  onChange: (value: Coordinates) => void;
  icon: L.DivIcon;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([value.lat, value.lon], map.getZoom(), { duration: 0.7 });
  }, [map, value.lat, value.lon]);

  useMapEvents({
    click: (event) =>
      onChange({
        lat: Number(event.latlng.lat.toFixed(4)),
        lon: Number(event.latlng.lng.toFixed(4)),
      }),
  });

  return <Marker position={[value.lat, value.lon]} icon={icon} />;
}

export default function OceanMap({ value, onChange }: { value: Coordinates; onChange: (value: Coordinates) => void }) {
  const center: LatLngExpression = [value.lat, value.lon];

  // Custom glowing cyan-to-violet location pin with pulsing radar rings
  const customPinIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-ocean-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); pointer-events: none;">
            <!-- Outer pulsing radar ping wave (violet-to-cyan gradient aura) -->
            <div style="position: absolute; width: 48px; height: 48px; border-radius: 9999px; background: radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(34, 211, 238, 0.12) 65%, transparent 100%); animation: ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <!-- Secondary breathing aura (cyan border with violet glow) -->
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; border: 1.5px solid rgba(192, 132, 252, 0.7); background: radial-gradient(circle, rgba(34, 211, 238, 0.28), rgba(168, 85, 247, 0.2)); box-shadow: 0 0 14px rgba(168, 85, 247, 0.4); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
            <!-- Core glowing beacon dot with cyan-to-violet gradient -->
            <div style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background: linear-gradient(135deg, #67e8f9 0%, #c084fc 100%); border: 2px solid #ffffff; box-shadow: 0 0 14px #22d3ee, 0 0 26px #a855f7, 0 0 40px rgba(168, 85, 247, 0.45);"></div>
            <!-- Mini floating target readout tag -->
            <div style="position: absolute; bottom: -28px; display: flex; align-items: center; gap: 5px; border-radius: 4px; border: 1px solid rgba(192, 132, 252, 0.45); background: rgba(5, 5, 20, 0.9); padding: 2px 7px; font-family: monospace; font-size: 8px; color: #a5f3fc; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.7), 0 0 12px rgba(168, 85, 247, 0.22); backdrop-filter: blur(4px);">
              <span style="width: 5px; height: 5px; border-radius: 9999px; background: #22d3ee; box-shadow: 0 0 6px #22d3ee;"></span>
              TARGET NODE
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      }),
    []
  );

  return (
    <MapContainer
      center={center}
      zoom={3}
      minZoom={2}
      maxZoom={8}
      className="h-full w-full"
      worldCopyJump
      zoomControl
    >
      {/* Dark-themed ocean basemap from CartoDB Dark Matter */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      <MapInteraction value={value} onChange={onChange} icon={customPinIcon} />
    </MapContainer>
  );
}