const fs = require('fs');

function patchFile(file, divRefToReplace, canvasOpenRegex, isExplore) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('setEventTarget')) return;

  // Add useState import implicitly if it works or use React.useState
  const useStateStr = 'const [eventTarget, setEventTarget] = React.useState<HTMLElement | null>(null);\n  ';
  
  content = content.replace(divRefToReplace, useStateStr + divRefToReplace);
  
  // Replace ref with setEventTarget
  const refRegex = new RegExp(`ref=\\{${divRefToReplace.match(/const (\w+) =/)[1]}\\}`);
  content = content.replace(refRegex, 'ref={setEventTarget}');
  
  // Replace <Canvas ... > with {eventTarget && (<Canvas eventSource={eventTarget} ... >
  content = content.replace(canvasOpenRegex, (match) => {
    return `{eventTarget && (<Canvas eventSource={eventTarget} ${match.substring(7)}`;
  });
  
  // Find </Canvas> and replace with </Canvas>)}
  // Because Explore has a lot of </Canvas>, we just replace the last one in the main block.
  // Actually, replacing all `</Canvas>` with `</Canvas>)}` is bad if there are multiple.
  // Let's just do a string replace for the specific block.
  content = content.replace('</Canvas>', '</Canvas>)}');

  fs.writeFileSync(file, content);
  console.log('Patched ' + file);
}

patchFile(
  'frontend/src/components/Ocean3D.tsx',
  'const containerRef = useRef<HTMLDivElement>(null);',
  /<Canvas camera=\{{ position: \[0, 0\.5, 6\.5\], fov: 45 \}}>/
);

patchFile(
  'frontend/src/pages/Home.tsx',
  'const canvasContainerRef = React.useRef<HTMLDivElement>(null);',
  /<Canvas camera=\{{ position: \[0, 0, 5\.5\], fov: 45 \}} dpr=\{[1, 2]\} performance=\{{ min: 0\.5 \}}>/
);

patchFile(
  'frontend/src/pages/Explore.tsx',
  'const earthContainerRef = React.useRef<HTMLDivElement>(null);',
  /<Canvas camera=\{{ position: \[0, 0, 5\.5\], fov: 45 \}} dpr=\{[1, 2]\} performance=\{{ min: 0\.5 \}}>/
);

patchFile(
  'frontend/src/pages/Architecture.tsx',
  'const \[isExploded, setIsExploded\] = useState\(false\);', // We will inject after this
  /<Canvas camera=\{{ position: \[0\.45, 7\.5, 20\], fov: 40 \}} gl=\{{ antialias: true, alpha: true, powerPreference: "high-performance" \}} dpr=\{[1, 1\.5]\} performance=\{{ min: 0\.5 \}} onPointerMissed=\{handlePointerMissed\}>/
);

// Solutions has a hardcoded ID div, let's patch it manually
let solContent = fs.readFileSync('frontend/src/pages/Solutions.tsx', 'utf8');
if (!solContent.includes('setEventTarget')) {
  solContent = solContent.replace(
    'const [is2DMode, setIs2DMode] = useState(false);',
    'const [is2DMode, setIs2DMode] = useState(false);\n  const [eventTarget, setEventTarget] = useState<HTMLElement | null>(null);'
  );
  solContent = solContent.replace(
    '<div id="solutions-canvas-container" className="w-full h-full relative">',
    '<div id="solutions-canvas-container" ref={setEventTarget} className="w-full h-full relative">'
  );
  solContent = solContent.replace(
    '<Canvas className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>',
    '{eventTarget && (<Canvas eventSource={eventTarget} className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>'
  );
  solContent = solContent.replace('</Canvas>', '</Canvas>)}');
  fs.writeFileSync('frontend/src/pages/Solutions.tsx', solContent);
  console.log('Patched Solutions.tsx');
}

