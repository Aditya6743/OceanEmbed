import { useRef, useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoutingSar3DOverlayProps {
  simState: 'idle' | 'running' | 'complete';
  activeMode: 'routing' | 'sar';
  sarTimeHour: number;
  showCurrents: boolean;
  showThermalRisk: boolean;
}

function latLonToVector3(lat: number, lon: number, radius = 2.02): THREE.Vector3 {
  const phi = lat * (Math.PI / 180);
  const theta = lon * (Math.PI / 180);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * -Math.sin(theta)
  );
}

export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk }: RoutingSar3DOverlayProps) {
  const routeGroupRef = useRef<THREE.Group>(null);
  const driftVesselRef = useRef<THREE.Mesh>(null);
  const routeVesselRef = useRef<THREE.Mesh>(null);
  const searchAreaRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const animState = useRef({ startTime: 0, isRunning: false });
  
  // ROUTING POINTS
  const p1 = useMemo(() => latLonToVector3(13.08, 80.27, 2.015), []); // Chennai
  const p2 = useMemo(() => latLonToVector3(11.62, 92.72, 2.015), []); // Port Blair
  const pMid = useMemo(() => latLonToVector3(15.25, 86.5, 2.05), []); // Hugs the hazard boundary closely // Ocean-Aware Arc
  const pMidStandard = useMemo(() => latLonToVector3(12.35, 86.5, 2.015), []); // Standard direct

  const curveOptimized = useMemo(() => new THREE.QuadraticBezierCurve3(p1, pMid, p2), [p1, pMid, p2]);
  const curveStandard = useMemo(() => new THREE.QuadraticBezierCurve3(p1, pMidStandard, p2), [p1, pMidStandard, p2]);

  const routePointsOpt = useMemo(() => curveOptimized.getPoints(50), [curveOptimized]);
  const routePointsStd = useMemo(() => curveStandard.getPoints(50), [curveStandard]);

  // SAR POINTS
  const sarLKP = useMemo(() => latLonToVector3(11.5, 85.2, 2.015), []);
  const sarMid = useMemo(() => latLonToVector3(13.0, 86.5, 2.03), []); // Arc the drift slightly
  const sarEnd = useMemo(() => latLonToVector3(14.5, 87.8, 2.015), []); // 24H Drift destination
  const sarCurve = useMemo(() => new THREE.QuadraticBezierCurve3(sarLKP, sarMid, sarEnd), [sarLKP, sarMid, sarEnd]);
  const sarPoints = useMemo(() => sarCurve.getPoints(40), [sarCurve]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (routeVesselRef.current && activeMode === 'routing' && simState === 'complete') {
      const animT = (t * 0.15) % 1.0; // Slowly sail along the route
      const currentPos = curveOptimized.getPoint(animT);
      routeVesselRef.current.position.copy(currentPos);
      
      // Face forward along the path
      const nextPos = curveOptimized.getPoint(Math.min(animT + 0.01, 1.0));
      const targetWorld = nextPos.clone();
      if (routeVesselRef.current.parent) {
         routeVesselRef.current.parent.localToWorld(targetWorld);
         routeVesselRef.current.up.copy(currentPos.clone().normalize());
         routeVesselRef.current.lookAt(targetWorld);
         routeVesselRef.current.rotateX(Math.PI / 2); // Lay the cone flat on the surface
      }
    }

    // Pulse LKP marker
    if (pulseRef.current) {
      const s = 1.0 + (t % 1.5) * 2.0;
      pulseRef.current.scale.set(s, s, s);
      (pulseRef.current.material as THREE.Material).opacity = Math.max(0, 1.0 - (s - 1.0));
    }

    // SAR Animation
    if (activeMode === 'sar') {
      if (simState === 'running') {
        if (!animState.current.isRunning) {
           animState.current.startTime = t;
           animState.current.isRunning = true;
        }
        
        // Smoothly animate from 0 to 1 over 1.5 seconds (matches standard progress speeds)
        const elapsed = t - animState.current.startTime;
        const animT = Math.min(elapsed / 1.5, 1.0); 
        
        const currentPos = sarCurve.getPoint(animT);
        
        if (driftVesselRef.current) driftVesselRef.current.position.copy(currentPos);
        if (searchAreaRef.current) {
           searchAreaRef.current.position.copy(currentPos);
           // Rotate the flat circle so it lies tangent to the Earth's surface
           searchAreaRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), currentPos.clone().normalize());
           const scale = 1.0 + animT * 5.0; // Grows smoothly as it moves
           searchAreaRef.current.scale.set(scale, scale, scale);
           (searchAreaRef.current.material as THREE.Material).opacity = Math.max(0.1, 0.5 - (animT * 0.3));
        }
      } else if (simState === 'complete') {
        animState.current.isRunning = false;
        // Snap to exactly what the left panel dictates (sarTimeHour)
        const progress = sarTimeHour / 24; // 0 to 1
        const currentPos = sarCurve.getPoint(progress);
        
        if (driftVesselRef.current) driftVesselRef.current.position.copy(currentPos);
        if (searchAreaRef.current) {
           searchAreaRef.current.position.copy(currentPos);
           // Rotate the flat circle so it lies tangent to the Earth's surface
           searchAreaRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), currentPos.clone().normalize());
           // Lerp the scale for smooth transitions when clicking time buttons
           const targetScale = 1.0 + progress * 8.0; 
           searchAreaRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
           (searchAreaRef.current.material as THREE.Material).opacity = 0.6 - (progress * 0.4);
        }
      }
    }
  });

  if (simState === 'idle') return null;

  return (
    <group ref={routeGroupRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>
      {activeMode === 'routing' && (
        <group>
          <mesh position={p1}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color="#22d3ee" /></mesh>
          <mesh position={p2}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color="#22d3ee" /></mesh>

          <Line points={routePointsStd} color="#ef4444" lineWidth={1.5} transparent opacity={0.4} dashed={true} dashScale={10} dashSize={0.2} gapSize={0.1} />

          {simState === 'complete' && (
            <>
              <Line points={routePointsOpt} color="#22d3ee" lineWidth={4} transparent opacity={0.9} />
              <mesh ref={routeVesselRef}>
                 <coneGeometry args={[0.015, 0.04, 16]} />
                 <meshBasicMaterial color="#ffffff" />
              </mesh>
            </>
          )}

          {showThermalRisk && (
            <mesh position={latLonToVector3(12.35, 86.5, 2.015)}>
              <sphereGeometry args={[0.045, 32, 32]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
            </mesh>
          )}

          {showCurrents && (
             <group>
               {[0, 1, 2, 3, 4, 5].map(i => {
                  const pt = curveOptimized.getPoint(i/5);
                  // Push vectors slightly to the side to simulate broad field
                  const offset = new THREE.Vector3(0.02, 0.02, 0);
                  pt.add(offset);
                  return (
                    <mesh key={i} position={pt} rotation={[0.2, 0.5, Math.PI/3]}>
                      <coneGeometry args={[0.008, 0.03, 8]} />
                      <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
                    </mesh>
                  )
               })}
             </group>
          )}
        </group>
      )}

      {activeMode === 'sar' && (
        <group>
          {/* LKP Incident Point */}
          <mesh position={sarLKP}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
          {/* Pulsing LKP beacon */}
          <mesh position={sarLKP} ref={pulseRef}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.8} />
          </mesh>

          {/* Full Drift Trajectory Line (Faint background line showing max 24H path) */}
          {simState === 'complete' && (
             <Line points={sarPoints} color="#fbbf24" lineWidth={2} transparent opacity={0.3} dashed={true} dashScale={20} dashSize={0.1} gapSize={0.1} />
          )}

          {/* Moving Drift Marker & Dynamic Search Area */}
          {(simState === 'running' || simState === 'complete') && (
            <>
              {/* The Object Adrift */}
              <mesh ref={driftVesselRef}>
                <sphereGeometry args={[0.015, 16, 16]} />
                <meshBasicMaterial color="#fbbf24" />
              </mesh>
              
              {/* The Expanding Search Area Circle */}
              <mesh ref={searchAreaRef}>
                <circleGeometry args={[0.03, 32]} />
                <meshBasicMaterial color="#f43f5e" transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
            </>
          )}

          {/* SAR Current Vectors pushing the object */}
          {showCurrents && (
             <group>
               {[0, 1, 2, 3].map(i => {
                  const pt = sarCurve.getPoint((i+1)/5);
                  return (
                    <mesh key={i} position={pt} rotation={[-0.1, 0.3, Math.PI/4]}>
                      <coneGeometry args={[0.01, 0.04, 8]} />
                      <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
                    </mesh>
                  )
               })}
             </group>
          )}
        </group>
      )}
    </group>
  );
}
