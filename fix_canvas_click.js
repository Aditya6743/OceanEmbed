const fs = require('fs');
let file = 'frontend/src/components/DigitalTwinGlobe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove onPointerMissed from the Sphere
const oldSphereBlock = `      <Sphere 
        args={[2.065, 64, 64]} 
        onClick={handleGlobeClick}
        onPointerMissed={(e) => {
          if (e.target && (e.target as HTMLElement).tagName === 'CANVAS') {
              setActivePin(null);
              reset();
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >`;

const newSphereBlock = `      <Sphere 
        args={[2.065, 64, 64]} 
        onClick={handleGlobeClick}
        onPointerMove={handlePointerMove}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >`;

content = content.replace(oldSphereBlock, newSphereBlock);

// 2. Add it to the root group!
const oldGroup = '<group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>';
const newGroup = `<group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]} onPointerMissed={(e) => {
          if (e.target && (e.target as HTMLElement).tagName === 'CANVAS') {
              setActivePin(null);
              reset();
              setIotPopupPos(null);
          }
        }}>`;

content = content.replace(oldGroup, newGroup);

fs.writeFileSync(file, content);
console.log('Moved onPointerMissed to root group');
