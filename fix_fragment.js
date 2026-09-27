const fs = require('fs');
let file = 'frontend/src/components/RoutingSar2DMap.tsx';
let content = fs.readFileSync(file, 'utf8');

const badBlock = `{showThermalRisk && (
              <Circle center={[12.35, 86.5]} radius={130000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.3, weight: 2 }} />
              <Marker position={[12.35, 86.5]} icon={thermalHazardLabel} />
            )}`;
const goodBlock = `{showThermalRisk && (
              <>
                <Circle center={[12.35, 86.5]} radius={130000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.3, weight: 2 }} />
                <Marker position={[12.35, 86.5]} icon={thermalHazardLabel} />
              </>
            )}`;

content = content.replace(badBlock, goodBlock);
fs.writeFileSync(file, content);
console.log('Fixed JSX Fragment error');
