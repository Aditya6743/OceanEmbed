const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix IotBeacon props
content = content.replace(
    'const IotBeacon = ({ lat, lon, color, onClick }: { lat: number, lon: number, color: string, onClick?: (e: any) => void }) => {',
    'const IotBeacon = ({ lat, lon, color, onClick, onPointerEnter, onPointerLeave }: { lat: number, lon: number, color: string, onClick?: (e: any) => void, onPointerEnter?: (e: any) => void, onPointerLeave?: () => void }) => {'
);

// Fix IotBeacon group events and invisible hitbox
const oldGroup = `    <group 
        position={pos} 
        quaternion={quat}
        onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(e);
        }}
    >
      {/* Invisible Large Hitbox for incredibly easy clicking */}
      <mesh visible={false}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial />
      </mesh>`;

const newGroup = `    <group 
        position={pos} 
        quaternion={quat}
        onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(e);
        }}
        onPointerEnter={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            if (onPointerEnter) onPointerEnter(e);
        }}
        onPointerLeave={(e) => {
            document.body.style.cursor = 'auto';
            if (onPointerLeave) onPointerLeave();
        }}
    >
      {/* Invisible Large Hitbox for incredibly easy clicking */}
      <mesh>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial opacity={0} transparent={true} depthWrite={false} />
      </mesh>`;

content = content.replace(oldGroup, newGroup);

// Update Gateway color to NOT turn red, and add hover bindings
const oldGateway = `<IotBeacon lat={18.92} lon={72.82} color={iotSimState && iotSimState.step >= 8 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} />`;
const newGateway = `<IotBeacon lat={18.92} lon={72.82} color="#10b981" onClick={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} onPointerEnter={(e) => setIotPopupPos({ point: e.point, id: 'gateway' })} onPointerLeave={() => setIotPopupPos(null)} />`;
content = content.replace(oldGateway, newGateway);

const oldB1 = `<IotBeacon lat={16.0} lon={68.0} color={iotSimState && iotSimState.phase === 'DELIVERY FAILED' ? "#64748b" : (iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981")} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} />`;
const newB1 = `<IotBeacon lat={16.0} lon={68.0} color={iotSimState && iotSimState.phase === 'DELIVERY FAILED' ? "#64748b" : (iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981")} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} onPointerEnter={(e) => setIotPopupPos({ point: e.point, id: 'b1' })} onPointerLeave={() => setIotPopupPos(null)} />`;
content = content.replace(oldB1, newB1);

const oldB2 = `<IotBeacon lat={12.0} lon={72.0} color={iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} />`;
const newB2 = `<IotBeacon lat={12.0} lon={72.0} color={iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} onPointerEnter={(e) => setIotPopupPos({ point: e.point, id: 'b2' })} onPointerLeave={() => setIotPopupPos(null)} />`;
content = content.replace(oldB2, newB2);

fs.writeFileSync(file, content);
console.log('Fixed hitboxes and hover events');
