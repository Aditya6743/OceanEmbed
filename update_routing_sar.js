const fs = require('fs');

// 1. Lift state in Solutions.tsx
let f1 = 'frontend/src/pages/Solutions.tsx';
let c1 = fs.readFileSync(f1, 'utf8');

c1 = c1.replace(
  /const \[sarSimState, setSarSimState\] = useState<'idle' \| 'running' \| 'complete'>\('idle'\);/,
  "const [sarSimState, setSarSimState] = useState<'idle' | 'running' | 'complete'>('idle');\n  const [sarActiveMode, setSarActiveMode] = useState<'routing' | 'sar'>('routing');"
);

c1 = c1.replace(
  /<RoutingSarLeftPanel \n               simState=\{sarSimState\}\n               setSimState=\{setSarSimState\} \n            \/>/,
  `<RoutingSarLeftPanel 
               simState={sarSimState}
               setSimState={setSarSimState} 
               activeMode={sarActiveMode}
               setActiveMode={setSarActiveMode}
            />`
);

c1 = c1.replace(
  /<RoutingSar3DOverlay simState=\{sarSimState\} \/>/,
  `<RoutingSar3DOverlay simState={sarSimState} activeMode={sarActiveMode} />`
);

fs.writeFileSync(f1, c1);

// 2. Update RoutingSarLeftPanel.tsx to accept activeMode props
let f2 = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let c2 = fs.readFileSync(f2, 'utf8');

c2 = c2.replace(
  /interface RoutingSarLeftPanelProps \{/,
  "interface RoutingSarLeftPanelProps {\n  activeMode: 'routing' | 'sar';\n  setActiveMode: (mode: 'routing' | 'sar') => void;"
);

c2 = c2.replace(
  /export default function RoutingSarLeftPanel\(\{ simState, setSimState \}: RoutingSarLeftPanelProps\) \{/,
  "export default function RoutingSarLeftPanel({ simState, setSimState, activeMode, setActiveMode }: RoutingSarLeftPanelProps) {"
);

c2 = c2.replace(
  /const \[activeMode, setActiveMode\] = useState<'routing' \| 'sar'>\('routing'\);\n/g,
  ""
);

fs.writeFileSync(f2, c2);

// 3. Write completely new RoutingSar3DOverlay.tsx
const newOverlay = `import React, { useRef, useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoutingSar3DOverlayProps {
  simState: 'idle' | 'running' | 'complete';
  activeMode: 'routing' | 'sar';
}

function latLonToVector3(lat: number, lon: number, radius = 2.01): THREE.Vector3 {
  const phi = lat * (Math.PI / 180);
  const theta = lon * (Math.PI / 180);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * -Math.sin(theta)
  );
}

export default function RoutingSar3DOverlay({ simState, activeMode }: RoutingSar3DOverlayProps) {
  const routeGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<any>(null);
  
  useFrame((state) => {
    // Animate expanding ring for SAR
    if (ringRef.current && activeMode === 'sar') {
      if (simState === 'running') {
        const t = state.clock.elapsedTime * 2;
        const targetScale = 1.0 + (t % 2) * 0.8;
        ringRef.current.scale.set(targetScale, targetScale, targetScale);
        (ringRef.current.material as THREE.Material).opacity = Math.max(0, 1.0 - (targetScale - 1.0));
      } else if (simState === 'complete') {
        ringRef.current.scale.lerp(new THREE.Vector3(3.5, 3.5, 3.5), 0.05);
        (ringRef.current.material as THREE.Material).opacity = 0.4;
      } else {
        ringRef.current.scale.set(0.1, 0.1, 0.1);
        (ringRef.current.material as THREE.Material).opacity = 0;
      }
    }
  });

  // ROUTING POINTS
  const p1 = useMemo(() => latLonToVector3(13.08, 80.27, 2.01), []); // Chennai
  const p2 = useMemo(() => latLonToVector3(11.62, 92.72, 2.01), []); // Port Blair
  const pMid = useMemo(() => latLonToVector3(14.5, 86.5, 2.08), []); // Ocean-Aware Arc
  const pMidStandard = useMemo(() => latLonToVector3(12.35, 86.5, 2.015), []); // Standard direct

  const curveOptimized = useMemo(() => new THREE.QuadraticBezierCurve3(p1, pMid, p2), [p1, pMid, p2]);
  const curveStandard = useMemo(() => new THREE.QuadraticBezierCurve3(p1, pMidStandard, p2), [p1, pMidStandard, p2]);

  const routePointsOpt = useMemo(() => curveOptimized.getPoints(50), [curveOptimized]);
  const routePointsStd = useMemo(() => curveStandard.getPoints(50), [curveStandard]);

  // SAR POINTS
  const sarPos = useMemo(() => latLonToVector3(11.5, 85.2, 2.011), []);
  const driftPos = useMemo(() => latLonToVector3(12.8, 86.8, 2.012), []); // Predicted drift

  if (simState === 'idle') return null;

  return (
    <group ref={routeGroupRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>
      {activeMode === 'routing' && (
        <group>
          {/* Ports */}
          <mesh position={p1}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color="#22d3ee" /></mesh>
          <mesh position={p2}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color="#22d3ee" /></mesh>

          {/* Standard Route (Red/Straightish) */}
          <Line points={routePointsStd} color="#ef4444" lineWidth={1.5} transparent opacity={0.4} dashed={true} dashScale={10} dashSize={0.2} gapSize={0.1} />

          {/* Optimized Route (Cyan/Arcing) */}
          {simState === 'complete' && (
            <Line ref={lineRef} points={routePointsOpt} color="#22d3ee" lineWidth={4} transparent opacity={0.9} />
          )}

          {/* Hazard Zone */}
          <mesh position={latLonToVector3(12.35, 86.5, 2.011)}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} />
          </mesh>
        </group>
      )}

      {activeMode === 'sar' && (
        <group>
          {/* LKP Incident Point */}
          <mesh position={sarPos}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color="#f43f5e" /></mesh>
          <mesh position={sarPos}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.4} />
          </mesh>

          {/* Search Area Expanding Ring */}
          <mesh position={sarPos} ref={ringRef}>
            <ringGeometry args={[0.08, 0.085, 32]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>

          {/* Predicted Drift Vector */}
          {simState === 'complete' && (
            <>
              <Line points={[sarPos, driftPos]} color="#fbbf24" lineWidth={3} transparent opacity={0.9} dashed={true} dashSize={0.05} gapSize={0.05} />
              <mesh position={driftPos}><sphereGeometry args={[0.02, 16, 16]} /><meshBasicMaterial color="#fbbf24" /></mesh>
            </>
          )}
        </group>
      )}
    </group>
  );
}
`;
fs.writeFileSync('frontend/src/components/RoutingSar3DOverlay.tsx', newOverlay);

console.log('Updated state lifting and visually enhanced 3D Overlay');
