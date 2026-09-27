const fs = require('fs');
let fileMap = 'frontend/src/components/RoutingSar2DMap.tsx';
let cMap = fs.readFileSync(fileMap, 'utf8');

const oldLoop = `        // Procedural flow direction matching 3D (roughly South-West curl)
        const angle = (Math.sin(lat * 0.5) + Math.cos(lon * 0.5)) * 45 + 135; 
        vectors.push({ lat, lon, angle });`;

const newLoop = `        // Mask out landmasses (India, Sri Lanka, Myanmar, Andaman)
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
        vectors.push({ lat, lon, angle });`;

cMap = cMap.replace(oldLoop, newLoop);
fs.writeFileSync(fileMap, cMap);
console.log('Masked out landmasses from vectors');
