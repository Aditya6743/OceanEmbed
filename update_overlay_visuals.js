const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Props interface
content = content.replace(
  /interface RoutingSar3DOverlayProps \{[\s\S]*?activeMode: 'routing' \| 'sar';\n\}/s,
  `interface RoutingSar3DOverlayProps {
  simState: 'idle' | 'running' | 'complete';
  activeMode: 'routing' | 'sar';
  sarTimeHour: number;
  showCurrents: boolean;
  showThermalRisk: boolean;
}`
);

// Update function signature
content = content.replace(
  /export default function RoutingSar3DOverlay\(\{ simState, activeMode \}: RoutingSar3DOverlayProps\) \{/g,
  `export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk }: RoutingSar3DOverlayProps) {`
);

// Update UseFrame for SAR scale based on sarTimeHour
content = content.replace(
  /if \(simState === 'running'\) \{[\s\S]*?\} else if \(simState === 'complete'\) \{[\s\S]*?ringRef\.current\.scale\.lerp\(new THREE\.Vector3\(3\.5, 3\.5, 3\.5\), 0\.05\);[\s\S]*?\} else \{/s,
  `if (simState === 'running') {
        const t = state.clock.elapsedTime * 2;
        const targetScale = 1.0 + (t % 2) * 0.8;
        ringRef.current.scale.set(targetScale, targetScale, targetScale);
        (ringRef.current.material as THREE.Material).opacity = Math.max(0, 1.0 - (targetScale - 1.0));
      } else if (simState === 'complete') {
        // Scale based on time selected (1h to 24h)
        const targetRadius = 1.0 + (sarTimeHour / 24) * 3.0;
        ringRef.current.scale.lerp(new THREE.Vector3(targetRadius, targetRadius, targetRadius), 0.1);
        (ringRef.current.material as THREE.Material).opacity = 0.4;
      } else {`
);

// Add vessel animation logic on the optimized route in useFrame
content = content.replace(
  /const lineRef = useRef<any>\(null\);/g,
  `const lineRef = useRef<any>(null);
  const vesselRef = useRef<THREE.Mesh>(null);
  const driftVesselRef = useRef<THREE.Mesh>(null);`
);

content = content.replace(
  /useFrame\(\(state\) => \{/g,
  `useFrame((state) => {
    if (vesselRef.current && activeMode === 'routing' && simState === 'complete') {
       const t = (state.clock.elapsedTime * 0.2) % 1.0;
       const p = curveOptimized.getPoint(t);
       vesselRef.current.position.copy(p);
    }
    
    if (driftVesselRef.current && activeMode === 'sar' && simState === 'complete') {
       // Interpolate drift based on sarTimeHour
       const t = sarTimeHour / 24; 
       driftVesselRef.current.position.lerp(new THREE.Vector3().lerpVectors(sarPos, driftPos, t), 0.1);
    }`
);

// Update render for Thermal Risk and Currents
content = content.replace(
  /\{\/\* Hazard Zone \*\/\}\n\s*<mesh position=\{latLonToVector3\(12\.35, 86\.5, 2\.011\)\}>\n\s*<sphereGeometry args=\{\[0\.06, 16, 16\]\} \/>\n\s*<meshBasicMaterial color="#f59e0b" transparent opacity=\{0\.3\} \/>\n\s*<\/mesh>/s,
  `{/* Hazard Zone */}
          {showThermalRisk && (
            <mesh position={latLonToVector3(12.35, 86.5, 2.011)}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
            </mesh>
          )}
          {/* Current Vectors Mock */}
          {showCurrents && (
             <group>
               {[0,1,2,3,4].map(i => (
                  <mesh key={i} position={curveOptimized.getPoint(i/4)} rotation={[0, 0, Math.PI/4]}>
                    <coneGeometry args={[0.005, 0.02, 8]} />
                    <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
                  </mesh>
               ))}
             </group>
          )}
          {/* Vessel */}
          {simState === 'complete' && (
             <mesh ref={vesselRef}>
                <sphereGeometry args={[0.012, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
             </mesh>
          )}`
);

// SAR Drift Vessel update
content = content.replace(
  /<mesh position=\{driftPos\}><sphereGeometry args=\{\[0\.02, 16, 16\]\} \/><meshBasicMaterial color="#fbbf24" \/><\/mesh>/g,
  `<mesh ref={driftVesselRef} position={sarPos}><sphereGeometry args={[0.02, 16, 16]} /><meshBasicMaterial color="#fbbf24" /></mesh>`
);

fs.writeFileSync(file, content);
console.log('Updated Overlay Visuals');
