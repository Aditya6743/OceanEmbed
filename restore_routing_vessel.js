const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add vesselRef
content = content.replace(
  /const driftVesselRef = useRef<THREE\.Mesh>\(null\);/,
  `const driftVesselRef = useRef<THREE.Mesh>(null);\n  const routeVesselRef = useRef<THREE.Mesh>(null);`
);

// Animate route vessel in useFrame
const frameInjection = `if (routeVesselRef.current && activeMode === 'routing' && simState === 'complete') {
      const animT = (t * 0.15) % 1.0; // Slowly sail along the route
      const currentPos = curveOptimized.getPoint(animT);
      routeVesselRef.current.position.copy(currentPos);
      
      // Face forward along the path
      const nextPos = curveOptimized.getPoint(Math.min(animT + 0.01, 1.0));
      routeVesselRef.current.lookAt(nextPos);
    }

    // Pulse LKP marker`;

content = content.replace(/\/\/ Pulse LKP marker/, frameInjection);

// Render route vessel
const renderInjection = `{simState === 'complete' && (
            <>
              <Line points={routePointsOpt} color="#22d3ee" lineWidth={4} transparent opacity={0.9} />
              <mesh ref={routeVesselRef}>
                 <coneGeometry args={[0.015, 0.04, 16]} />
                 <meshBasicMaterial color="#ffffff" />
              </mesh>
            </>
          )}`;

content = content.replace(/\{simState === 'complete' && \(\n\s*<Line points=\{routePointsOpt\} color="#22d3ee" lineWidth=\{4\} transparent opacity=\{0\.9\} \/>\n\s*\)\}/s, renderInjection);

fs.writeFileSync(file, content);
console.log('Restored Routing Vessel Animation');
