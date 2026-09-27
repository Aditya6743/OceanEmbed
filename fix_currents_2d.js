const fs = require('fs');

// 1. Add showCurrents to RoutingSar2DMap.tsx
let fileMap = 'frontend/src/components/RoutingSar2DMap.tsx';
let cMap = fs.readFileSync(fileMap, 'utf8');

cMap = cMap.replace(
  /showThermalRisk: boolean;\n\s*onClose: \(\) => void;/g,
  'showThermalRisk: boolean;\n  showCurrents: boolean;\n  onClose: () => void;'
);

cMap = cMap.replace(
  /export default function RoutingSar2DMap\(\{ activeMode, simState, sarTimeHour, showThermalRisk, onClose \}: RoutingSar2DMapProps\) \{/g,
  'export default function RoutingSar2DMap({ activeMode, simState, sarTimeHour, showThermalRisk, showCurrents, onClose }: RoutingSar2DMapProps) {'
);

// Add current vectors rendering logic inside RoutingSar2DMap
const currentVectorsCode = `
  // Generate Current Vectors Grid
  const currentVectors = useMemo(() => {
    const vectors = [];
    for(let lat = 10; lat <= 18; lat += 1) {
      for(let lon = 78; lon <= 94; lon += 1) {
        // Procedural flow direction matching 3D (roughly South-West curl)
        const angle = (Math.sin(lat * 0.5) + Math.cos(lon * 0.5)) * 45 + 135; 
        vectors.push({ lat, lon, angle });
      }
    }
    return vectors;
  }, []);
`;

cMap = cMap.replace(
  /const sarPoints = useMemo\(\(\) => getBezierPoints\(sStart, sMid, sEnd\), \[\]\);/g,
  `const sarPoints = useMemo(() => getBezierPoints(sStart, sMid, sEnd), []);\n${currentVectorsCode}`
);

// Add the vectors into the MapContainer JSX
const currentsJSX = `
        {showCurrents && currentVectors.map((v, i) => (
          <Marker 
            key={\`vec-\${i}\`} 
            position={[v.lat, v.lon]} 
            icon={L.divIcon({
              className: 'bg-transparent',
              html: \`<div style="transform: rotate(\${v.angle}deg); color: #38bdf8; font-size: 16px; opacity: 0.6;">↑</div>\`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })} 
          />
        ))}
`;

cMap = cMap.replace(
  /<MapFitter activeMode=\{activeMode\} \/>\n\s*<TileLayer /g,
  `<MapFitter activeMode={activeMode} />\n        <TileLayer `
);

// Put it right after TileLayer
cMap = cMap.replace(
  /<TileLayer url="https:\/\/mt1.google.com\/vt\/lyrs=p&x=\{x\}&y=\{y\}&z=\{z\}" className="google-dark-terrain" attribution="&copy; Google Maps" \/>/g,
  `<TileLayer url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" className="google-dark-terrain" attribution="&copy; Google Maps" />\n${currentsJSX}`
);

fs.writeFileSync(fileMap, cMap);


// 2. Update Solutions.tsx to pass showCurrents
let fileSolutions = 'frontend/src/pages/Solutions.tsx';
let cSolutions = fs.readFileSync(fileSolutions, 'utf8');

cSolutions = cSolutions.replace(
  /showThermalRisk=\{showThermalRisk\}\n\s*onClose=\{/g,
  'showThermalRisk={showThermalRisk}\n               showCurrents={showCurrents}\n               onClose={'
);

fs.writeFileSync(fileSolutions, cSolutions);

console.log('Fixed 2D Current Vectors');
