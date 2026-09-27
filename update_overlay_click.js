const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Html import if not present
if (!content.includes('Html')) {
  content = content.replace(/import { Line } from '@react-three\/drei';/, "import { Line, Html } from '@react-three/drei';");
}

// Add props
content = content.replace(/showThermalRisk: boolean;\n\}/, "showThermalRisk: boolean;\n  onRequest2D: () => void;\n}");
content = content.replace(
  /export default function RoutingSar3DOverlay\(\{ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk \}: RoutingSar3DOverlayProps\) \{/,
  "export default function RoutingSar3DOverlay({ simState, activeMode, sarTimeHour, showCurrents, showThermalRisk, onRequest2D }: RoutingSar3DOverlayProps) {"
);

// Add state for popup
content = content.replace(
  /const animState = useRef\(\{ startTime: 0, isRunning: false \}\);/,
  "const animState = useRef({ startTime: 0, isRunning: false });\n  const [popupPos, setPopupPos] = React.useState<THREE.Vector3 | null>(null);"
);

// Add click handler for meshes
const clickHandler = `onClick={(e) => { e.stopPropagation(); setPopupPos(e.point); }}`;

content = content.replace(/<mesh ref=\{searchAreaRef\}>/g, `<mesh ref={searchAreaRef} ${clickHandler}>`);
content = content.replace(/<mesh ref=\{driftVesselRef\}>/g, `<mesh ref={driftVesselRef} ${clickHandler}>`);
content = content.replace(/<mesh ref=\{routeVesselRef\}>/g, `<mesh ref={routeVesselRef} ${clickHandler}>`);
content = content.replace(/<Line points=\{routePointsOpt\}/g, `<Line onClick={(e) => { e.stopPropagation(); setPopupPos(e.point); }} points={routePointsOpt}`);

// Add HTML Popup render logic
const popupHtml = `
      {popupPos && (
        <Html position={popupPos} center zIndexRange={[100, 0]}>
          <div className="bg-black/90 border border-cyan-500/50 p-3 rounded-lg backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in duration-200 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex flex-col items-center gap-2 pointer-events-auto">
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">Tactical Overlay Selected</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setPopupPos(null); onRequest2D(); }}
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded text-[10px] font-black tracking-widest transition-colors w-full"
            >
              VIEW IN 2D
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
`;

content = content.replace(/<\/group>\n\s*\);\n\}/, popupHtml);

// Add pointer missed to dismiss popup
content = content.replace(/<group ref=\{routeGroupRef\}/, `<group ref={routeGroupRef} onPointerMissed={() => setPopupPos(null)}`);

fs.writeFileSync(file, content);
console.log('Updated 3D Overlay');
