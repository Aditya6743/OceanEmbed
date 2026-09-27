const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix IotBeacon click
content = content.replace(
  /<mesh raycast=\{\(\) => null\}>\n\s*<sphereGeometry args=\{\[0\.015, 16, 16\]\} \/>\n\s*<meshBasicMaterial color=\{color\} depthTest=\{false\} \/>\n\s*<\/mesh>/g,
  `<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.015, 16, 16]} /><meshBasicMaterial color={color} depthTest={false} /></mesh>`
);

content = content.replace(
  /<mesh raycast=\{\(\) => null\}>\n\s*<sphereGeometry args=\{\[0\.035, 16, 16\]\} \/>/g,
  `<mesh onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}><sphereGeometry args={[0.035, 16, 16]} />`
);


// Pass onClick to IotBeacons in the globe rendering
const beaconClick = `onClick={(e) => setIotPopupPos(e.point)}`;
content = content.replace(/<IotBeacon lat=\{18\.922\} lon=\{72\.8347\} color="#f43f5e"  \/>/g, `<IotBeacon lat={18.922} lon={72.8347} color="#f43f5e" ${beaconClick} />`);
content = content.replace(/<IotBeacon lat=\{15\.5\} lon=\{68\.0\} color="#f43f5e"  \/>/g, `<IotBeacon lat={15.5} lon={68.0} color="#f43f5e" ${beaconClick} />`);
content = content.replace(/<IotBeacon lat=\{13\.0827\} lon=\{80\.2707\} color="#38bdf8"  \/>/g, `<IotBeacon lat={13.0827} lon={80.2707} color="#38bdf8" ${beaconClick} />`);
content = content.replace(/<IotBeacon lat=\{22\.309\} lon=\{70\.802\} color="#10b981"  \/>/g, `<IotBeacon lat={22.309} lon={70.802} color="#10b981" ${beaconClick} />`);

// Add the Html popup rendering block right after the Beacons group
const htmlPopup = `
        {iotPopupPos && (
          <Html position={iotPopupPos} center zIndexRange={[100, 0]}>
            <div className="bg-black/90 border border-cyan-500/50 p-3 rounded-lg backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in duration-200 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex flex-col items-center gap-2 pointer-events-auto">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase">IoT Beacon Selected</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setIotPopupPos(null); onRequest2D && onRequest2D(); }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded text-[10px] font-black tracking-widest transition-colors w-full"
              >
                VIEW TACTICAL FEED
              </button>
            </div>
          </Html>
        )}
`;

content = content.replace(
  /\{viewMode === 'iot' && \(\n\s*<group>\n([\s\S]*?)<\/group>\n\s*\)\}/,
  "{viewMode === 'iot' && (\n        <group>\n$1" + htmlPopup + "\n        </group>\n      )}"
);

// clear popup on globe click
content = content.replace(
  /setActivePin\(null\);\n\s*reset\(\);/g,
  "setActivePin(null);\n              reset();\n              setIotPopupPos(null);"
);

fs.writeFileSync(file, content);
console.log('Patched IotBeacon clicks');
