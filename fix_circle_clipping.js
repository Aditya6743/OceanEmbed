const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add lookAt logic so the circle lies perfectly flat against the curvature of the Earth
content = content.replace(
  /searchAreaRef\.current\.position\.copy\(currentPos\);/g,
  "searchAreaRef.current.position.copy(currentPos);\n           // Rotate the flat circle so it lies tangent to the Earth's surface\n           searchAreaRef.current.lookAt(currentPos.clone().multiplyScalar(2));"
);

fs.writeFileSync(file, content);
console.log('Fixed circle clipping by applying tangent rotation');
