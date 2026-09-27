const fs = require('fs');
let file = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add the animation state ref
content = content.replace(
  /const searchAreaRef = useRef<THREE\.Mesh>\(null\);\n  const pulseRef = useRef<THREE\.Mesh>\(null\);/g,
  `const searchAreaRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const animState = useRef({ startTime: 0, isRunning: false });`
);

// Replace the running animation logic in useFrame
const glitchLogic = /if \(simState === 'running'\) \{[\s\S]*?\} else if \(simState === 'complete'\) \{/s;

const smoothLogic = `if (simState === 'running') {
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
           const scale = 1.0 + animT * 5.0; // Grows smoothly as it moves
           searchAreaRef.current.scale.set(scale, scale, scale);
           (searchAreaRef.current.material as THREE.Material).opacity = Math.max(0.1, 0.5 - (animT * 0.3));
        }
      } else if (simState === 'complete') {
        animState.current.isRunning = false;`;

content = content.replace(glitchLogic, smoothLogic);

fs.writeFileSync(file, content);
console.log('Fixed SAR glitch');
