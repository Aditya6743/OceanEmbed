const fs = require('fs');

let file3D = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let c3D = fs.readFileSync(file3D, 'utf8');

const currentVectorsCode = `
  // Global 3D Current Vectors Grid
  const currentVectors3D = useMemo(() => {
    const vectors = [];
    const dummy = new THREE.Object3D();
    for(let lat = 8.5; lat <= 17.5; lat += 1) {
      for(let lon = 78; lon <= 94; lon += 1) {
        // Mask out landmasses
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

        const angleDeg = (Math.sin(lat * 0.5) + Math.cos(lon * 0.5)) * 45 + 135; 
        
        const pos = latLonToVector3(lat, lon, 2.015);
        const lat2 = lat + Math.cos(angleDeg * Math.PI / 180) * 0.5;
        const lon2 = lon + Math.sin(angleDeg * Math.PI / 180) * 0.5;
        const target = latLonToVector3(lat2, lon2, 2.015);
        
        dummy.position.copy(pos);
        dummy.up.copy(pos.clone().normalize());
        dummy.lookAt(target);
        dummy.rotateX(Math.PI / 2);
        
        // Add type any to avoid TS errors if needed, but pos and quaternion are typed
        vectors.push({ pos, quaternion: dummy.quaternion.clone() });
      }
    }
    return vectors;
  }, []);
`;

c3D = c3D.replace(
  /const sarPoints = useMemo\(\(\) => sarCurve\.getPoints\(40\), \[sarCurve\]\);/g,
  `const sarPoints = useMemo(() => sarCurve.getPoints(40), [sarCurve]);\n${currentVectorsCode}`
);

// We should also fix the TS issue for the map `(v, i)`
c3D = c3D.replace(
  /\{currentVectors3D\.map\(\(v, i\) => \(/g,
  '{currentVectors3D.map((v: any, i: number) => ('
);

fs.writeFileSync(file3D, c3D);
console.log('Fixed currentVectors3D injection and typings');
