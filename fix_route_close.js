const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Adjust the control point so the curve tightly hugs the hazard zone without touching it
content = content.replace(
  /const pMid = useMemo\(\(\) => latLonToVector3\(17\.5, 85\.5, 2\.05\), \[\]\); \/\/ Pulled way North to completely clear hazard/g,
  "const pMid = useMemo(() => latLonToVector3(15.25, 86.5, 2.05), []); // Hugs the hazard boundary closely"
);

fs.writeFileSync(file, content);
console.log('Fixed route to skim the hazard');
