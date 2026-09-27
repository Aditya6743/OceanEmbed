const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add setIotPopupPos(null) to handleGlobeClick
const oldHandleGlobe = `const handleGlobeClick = useCallback((e: any) => {
    if (e.delta > 3) return; // Prevent accidental clicks while rotating/dragging
    e.stopPropagation();
    playSimplePing();`;

const newHandleGlobe = `const handleGlobeClick = useCallback((e: any) => {
    if (onInteract) onInteract();
    if (e.delta > 3) return; // Prevent accidental clicks while rotating/dragging
    e.stopPropagation();
    playSimplePing();
    setIotPopupPos(null);`;

content = content.replace(oldHandleGlobe, newHandleGlobe);

// Remove setIotPopupPos(null) from onPointerMissed
const oldPointerMissed = `onPointerMissed={(e) => {
          if (e.target && (e.target as HTMLElement).tagName === 'CANVAS') {
              setActivePin(null);
              reset();
              setIotPopupPos(null);
          }
        }}`;

const newPointerMissed = `onPointerMissed={(e) => {
          if (e.target && (e.target as HTMLElement).tagName === 'CANVAS') {
              setActivePin(null);
              reset();
          }
        }}`;

content = content.replace(oldPointerMissed, newPointerMissed);

fs.writeFileSync(file, content);
console.log('Fixed race condition in onPointerMissed');
