const fs = require('fs');

// 1. Fix Spacing in IotBeaconsPanel.tsx (IotOverlays)
let fPanel = 'frontend/src/components/IotBeaconsPanel.tsx';
let cPanel = fs.readFileSync(fPanel, 'utf8');

// Fisherman box from left-[350px] to left-[340px] (or maybe left-6 if the panel isn't there? Wait, the panel IS there in 3D). Let's give it more distance: `left-[340px]` -> `left-[380px]`? 
// The user said: "Keep more distance between them, a little bit more." The left one is currently at `left-[350px]`. I'll push it to `left-[360px]` and right one to `right-12`
cPanel = cPanel.replace('left-[350px]', 'left-[380px]');
cPanel = cPanel.replace('right-6', 'right-12');

fs.writeFileSync(fPanel, cPanel);


// 2. Add Paths and Circle in DigitalTwinGlobe.tsx
let fGlobe = 'frontend/src/components/DigitalTwinGlobe.tsx';
let cGlobe = fs.readFileSync(fGlobe, 'utf8');

// Inject the IotBroadcastLine helper before DigitalTwinGlobe
const helperInjection = `const IotBroadcastLine = ({ lat1, lon1, lat2, lon2, color, dashed }: { lat1: number, lon1: number, lat2: number, lon2: number, color: string, dashed?: boolean }) => {
  const points = useMemo(() => {
    const p1 = new THREE.Vector3().setFromSphericalCoords(2.01, (90 - lat1) * Math.PI/180, (lon1 + 180) * Math.PI/180);
    const p2 = new THREE.Vector3().setFromSphericalCoords(2.01, (90 - lat2) * Math.PI/180, (lon2 + 180) * Math.PI/180);
    const pts = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = new THREE.Vector3().copy(p1).lerp(p2, t);
      p.normalize().multiplyScalar(2.01 + Math.sin(t * Math.PI) * 0.05); // 0.05 arc height
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
};

export default function DigitalTwinGlobe`;

cGlobe = cGlobe.replace("export default function DigitalTwinGlobe", helperInjection);

// Inject the hazard circle and lines inside the viewMode === 'iot' group
const startIotGroup = `{viewMode === 'iot' && (
        <group>`;

const linesAndCircle = `
          {/* Hazard Region Circle */}
          {iotSimState && iotSimState.step >= 2 && (() => {
            const hazardPos = new THREE.Vector3().setFromSphericalCoords(2.01, (90 - 16.0) * Math.PI/180, (70.5 + 180) * Math.PI/180);
            const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), hazardPos.clone().normalize());
            return (
              <group position={hazardPos} quaternion={quat}>
                <mesh>
                  <circleGeometry args={[0.12, 32]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
                <mesh>
                  <ringGeometry args={[0.115, 0.12, 64]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
              </group>
            );
          })()}

          {/* Broadcast Lines */}
          {iotSimState && iotSimState.step >= 5 && (
            <>
              {/* Gateway to Fisherman */}
              <IotBroadcastLine lat1={18.92} lon1={72.82} lat2={17.5} lon2={70.0} color={iotSimState.phase === 'DELIVERY FAILED' ? '#64748b' : '#38bdf8'} dashed />
              {/* Gateway to Tourist */}
              <IotBroadcastLine lat1={18.92} lon1={72.82} lat2={15.0} lon2={71.5} color="#38bdf8" dashed />
            </>
          )}
`;

cGlobe = cGlobe.replace(startIotGroup, startIotGroup + linesAndCircle);

fs.writeFileSync(fGlobe, cGlobe);
console.log('Fixed globe spacing, paths, and hazard circle in 3D');
