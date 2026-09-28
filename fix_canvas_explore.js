const fs = require('fs');
let f3 = 'frontend/src/pages/Explore.tsx';
let c3 = fs.readFileSync(f3, 'utf8');

if (!c3.includes('earthContainerRef = React.useRef')) {
    c3 = c3.replace('const controlsRef = React.useRef(null);', 'const controlsRef = React.useRef(null);\n  const earthContainerRef = React.useRef<HTMLDivElement>(null);');
    
    // Replace the opening div of RIGHT PANEL
    c3 = c3.replace('      {/* RIGHT PANEL (Now rendered on Right via flex-row-reverse) - INTERACTIVE GLOBE */}\n      <div className={`w-full', '      {/* RIGHT PANEL (Now rendered on Right via flex-row-reverse) - INTERACTIVE GLOBE */}\n      <div ref={earthContainerRef} className={`w-full');
    
    // Replace the canvas
    c3 = c3.replace('<Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>', '<Canvas eventSource={earthContainerRef} camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>');
    
    fs.writeFileSync(f3, c3);
    console.log('Fixed Explore');
}
