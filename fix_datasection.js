const fs = require('fs');
const file = 'frontend/src/components/landing/DataSection.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the Canvas block in desktop view
const canvasRegex = /<Suspense fallback=\{null\}>[\s\S]*?<\/Suspense>/s;

const replacement = `<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       {/* Pure CSS Isometric Mesh replacing heavy WebGL */}
                       <div className="relative w-full h-[150%] max-h-[300px] flex items-center justify-center" style={{ transform: "rotateX(60deg) rotateZ(-45deg)", transformStyle: "preserve-3d" }}>
                          {/* Grid plane */}
                          <div className="absolute w-[280px] h-[280px] border border-cyan-500/30" 
                               style={{ 
                                 backgroundImage: "linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)", 
                                 backgroundSize: "20px 20px" 
                               }}>
                          </div>
                          {/* Image placed on top of the mesh */}
                          <img src="/images/map-perfect.png" alt="Spatial Grid" className="absolute w-[240px] h-auto object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] opacity-90" />
                       </div>
                    </div>`;

content = content.replace(canvasRegex, replacement);

// Also need to remove the imports of three, fiber, drei to clean up
content = content.replace(/import \{ Canvas, useFrame \} from '@react-three\/fiber';/, '');
content = content.replace(/import \{ OrbitControls, Float \} from '@react-three\/drei';/, '');
content = content.replace(/import \* as THREE from 'three';/, '');
content = content.replace(/import \{ Suspense, useMemo, useRef \} from 'react';/, 'import { useMemo, useRef } from "react";');

fs.writeFileSync(file, content);
console.log('Replaced WebGL in DataSection with CSS mesh.');
