const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite IotBroadcastLine to animate the dashOffset
const oldHelper = `const IotBroadcastLine = ({ lat1, lon1, lat2, lon2, color, dashed }: { lat1: number, lon1: number, lat2: number, lon2: number, color: string, dashed?: boolean }) => {
  const points = useMemo(() => {
    const p1 = latLonToVector3(lat1, lon1, 2.06);
    const p2 = latLonToVector3(lat2, lon2, 2.06);
    const pts = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = new THREE.Vector3().copy(p1).lerp(p2, t);
      p.normalize().multiplyScalar(2.06 + Math.sin(t * Math.PI) * 0.05); // 0.05 arc height
      pts.push(p);
    }
    return pts;
  }, [lat1, lon1, lat2, lon2]);

  return (
    <Line 
      points={points}
      color={color}
      lineWidth={dashed ? 1.5 : 2}
      dashed={dashed}
      dashSize={0.05}
      gapSize={0.05}
      transparent
      opacity={0.8}
    />
  );
};`;

const newHelper = `const IotBroadcastLine = ({ lat1, lon1, lat2, lon2, color, dashed }: { lat1: number, lon1: number, lat2: number, lon2: number, color: string, dashed?: boolean }) => {
  const lineRef = useRef<any>(null);
  
  const points = useMemo(() => {
    const p1 = latLonToVector3(lat1, lon1, 2.06);
    const p2 = latLonToVector3(lat2, lon2, 2.06);
    const pts = [];
    const segments = 30;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = new THREE.Vector3().copy(p1).lerp(p2, t);
      p.normalize().multiplyScalar(2.06 + Math.sin(t * Math.PI) * 0.07); // dynamic arc height
      pts.push(p);
    }
    return pts;
  }, [lat1, lon1, lat2, lon2]);

  useFrame((state, delta) => {
      if (dashed && lineRef.current?.material) {
          lineRef.current.material.dashOffset -= delta * 0.2;
      }
  });

  return (
    <Line 
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={dashed ? 2 : 2}
      dashed={dashed}
      dashSize={0.08}
      gapSize={0.08}
      transparent
      opacity={0.8}
    />
  );
};`;

content = content.replace(oldHelper, newHelper);


// 2. Rewrite the Hazard Circle to be a dashed outline with a faint fill, scaling up gracefully
const oldHazard = `          {/* Hazard Region Circle */}
          {iotSimState && iotSimState.step >= 2 && (() => {
            const hazardPos = latLonToVector3(14.5, 69.5, 2.06);
            const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), hazardPos.clone().normalize());
            return (
              <group position={hazardPos} quaternion={quat}>
                <mesh>
                  <circleGeometry args={[0.22, 64]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
                <mesh>
                  <ringGeometry args={[0.21, 0.22, 128]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
              </group>
            );
          })()}`;

const newHazard = `          {/* Hazard Region Circle */}
          {iotSimState && iotSimState.step >= 2 && (() => {
            const hazardPos = latLonToVector3(14.5, 69.5, 2.06);
            const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), hazardPos.clone().normalize());
            
            // Create dashed circle points
            const circlePts = [];
            for(let i=0; i<=64; i++){
               const a = (i/64) * Math.PI * 2;
               circlePts.push(new THREE.Vector3(Math.cos(a)*0.22, Math.sin(a)*0.22, 0));
            }
            
            return (
              <group position={hazardPos} quaternion={quat}>
                <mesh>
                  <circleGeometry args={[0.22, 64]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
                <Line 
                    points={circlePts} 
                    color="#ef4444" 
                    lineWidth={1.5} 
                    dashed 
                    dashSize={0.02} 
                    gapSize={0.02} 
                    transparent 
                    opacity={0.8} 
                />
              </group>
            );
          })()}`;

content = content.replace(oldHazard, newHazard);

fs.writeFileSync(file, content);
console.log('Added animation and dashed styling to 3D elements');
