const fs = require('fs');

let f4 = 'frontend/src/pages/Solutions.tsx';
let c4 = fs.readFileSync(f4, 'utf8');
if (!c4.includes('solutionsContainerRef = React.useRef')) {
    c4 = c4.replace('const [prediction, setPrediction] = useState', 'const solutionsContainerRef = React.useRef<HTMLDivElement>(null);\n  const [prediction, setPrediction] = useState');
    c4 = c4.replace('<div className="w-full md:w-[60%] h-[50vh] md:h-[100dvh] relative bg-black shrink-0 overflow-hidden">', '<div ref={solutionsContainerRef} className="w-full md:w-[60%] h-[50vh] md:h-[100dvh] relative bg-black shrink-0 overflow-hidden">');
    c4 = c4.replace('<Canvas className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>', '<Canvas eventSource={solutionsContainerRef} className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>');
    fs.writeFileSync(f4, c4);
    console.log('Fixed Solutions');
}

let f5 = 'frontend/src/pages/Architecture.tsx';
let c5 = fs.readFileSync(f5, 'utf8');
if (!c5.includes('archContainerRef = React.useRef')) {
    c5 = c5.replace('const controlsRef = React.useRef<any>(null);', 'const controlsRef = React.useRef<any>(null);\n  const archContainerRef = React.useRef<HTMLDivElement>(null);');
    c5 = c5.replace('      <div className="absolute inset-0 z-0 bg-transparent">\n        <Canvas', '      <div ref={archContainerRef} className="absolute inset-0 z-0 bg-transparent">\n        <Canvas eventSource={archContainerRef}');
    fs.writeFileSync(f5, c5);
    console.log('Fixed Architecture');
}
