const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Pull the Optimized Route control point further North for a wider arc
content = content.replace(
  /const pMid = useMemo\(\(\) => latLonToVector3\(14\.5, 86\.5, 2\.08\), \[\]\);/g,
  "const pMid = useMemo(() => latLonToVector3(17.5, 85.5, 2.05), []); // Pulled way North to completely clear hazard"
);

// Reduce the Hazard Zone radius slightly to be more realistic (approx 120km radius)
content = content.replace(
  /<sphereGeometry args=\{\[0\.08, 32, 32\]\} \/>/g,
  "<sphereGeometry args={[0.045, 32, 32]} />"
);

fs.writeFileSync(file, content);
console.log('Fixed Route Arc');
