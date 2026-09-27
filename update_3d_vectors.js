const fs = require('fs');

let file3D = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let c3D = fs.readFileSync(file3D, 'utf8');

// Ensure THREE is used
if (!c3D.includes('import * as THREE')) {
  c3D = c3D.replace(/import \{ Html, Line \} from '@react-three\/drei';/, "import { Html, Line } from '@react-three/drei';\nimport * as THREE from 'three';");
}

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
        
        vectors.push({ pos, quaternion: dummy.quaternion.clone() });
      }
    }
    return vectors;
  }, []);
`;

c3D = c3D.replace(
  /const sarCurve = useMemo\(\(\) => new THREE\.CatmullRomCurve3\(sarPoints\), \[sarPoints\]\);/g,
  `const sarCurve = useMemo(() => new THREE.CatmullRomCurve3(sarPoints), [sarPoints]);\n${currentVectorsCode}`
);

// Remove the old showCurrents block from Routing
c3D = c3D.replace(
  /\{showCurrents && \(\s*<group>\s*\{\[0, 1, 2, 3, 4, 5\]\.map\(i => \{\s*const pt = curveOptimized\.getPoint\(i\/5\);\s*\/\/[^\n]+\s*const offset = new THREE\.Vector3\(0\.02, 0\.02, 0\);\s*pt\.add\(offset\);\s*return \(\s*<mesh key=\{i\} position=\{pt\} rotation=\{\[0\.2, 0\.5, Math\.PI\/3\]\}>\s*<coneGeometry args=\{\[0\.008, 0\.03, 8\]\} \/>\s*<meshBasicMaterial color="#3b82f6" transparent opacity=\{0\.8\} \/>\s*<\/mesh>\s*\)\s*\}\)\}\s*<\/group>\s*\)\}/g,
  ''
);

// Remove the old showCurrents block from SAR
c3D = c3D.replace(
  /\{showCurrents && \(\s*<group>\s*\{\[0, 1, 2, 3\]\.map\(i => \{\s*const pt = sarCurve\.getPoint\(\(i\+1\)\/5\);\s*return \(\s*<mesh key=\{i\} position=\{pt\} rotation=\{\[-0\.1, 0\.3, Math\.PI\/4\]\}>\s*<coneGeometry args=\{\[0\.01, 0\.04, 8\]\} \/>\s*<meshBasicMaterial color="#fbbf24" transparent opacity=\{0\.5\} \/>\s*<\/mesh>\s*\)\s*\}\)\}\s*<\/group>\s*\)\}/g,
  ''
);

// Add the new global vector grid BEFORE activeMode checks
const globalVectorsJSX = `
      {showCurrents && (
         <group>
            {currentVectors3D.map((v, i) => (
               <mesh key={i} position={v.pos} quaternion={v.quaternion}>
                  <coneGeometry args={[0.005, 0.02, 8]} />
                  <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
               </mesh>
            ))}
         </group>
      )}
`;

c3D = c3D.replace(
  /<group ref=\{routeGroupRef\} onPointerMissed=\{\(\) => setPopupPos\(null\)\} rotation=\{\[17\.5 \* \(Math\.PI \/ 180\), 195 \* \(Math\.PI \/ 180\), 0\]\}>/g,
  `<group ref={routeGroupRef} onPointerMissed={() => setPopupPos(null)} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>\n${globalVectorsJSX}`
);

fs.writeFileSync(file3D, c3D);
console.log('Replaced 3D vectors with global grid');
