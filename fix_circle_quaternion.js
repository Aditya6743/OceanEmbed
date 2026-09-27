const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace lookAt with local quaternion rotation for the Search Area circle
content = content.replace(
  /searchAreaRef\.current\.lookAt\(currentPos\.clone\(\)\.multiplyScalar\(2\)\);/g,
  "searchAreaRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), currentPos.clone().normalize());"
);

// Fix the routing vessel lookAt which was also using local coords for a world method
content = content.replace(
  /routeVesselRef\.current\.lookAt\(nextPos\);/g,
  `const targetWorld = nextPos.clone();
      if (routeVesselRef.current.parent) {
         routeVesselRef.current.parent.localToWorld(targetWorld);
         routeVesselRef.current.up.copy(currentPos.clone().normalize());
         routeVesselRef.current.lookAt(targetWorld);
         routeVesselRef.current.rotateX(Math.PI / 2); // Lay the cone flat on the surface
      }`
);

fs.writeFileSync(file, content);
console.log('Fixed local/world rotation bugs');
