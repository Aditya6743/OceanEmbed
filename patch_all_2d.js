const fs = require('fs');

// 1. Fix RoutingSar2DMap React import
let f1 = 'frontend/src/components/RoutingSar2DMap.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(/import React, \{ useMemo, useEffect \} from 'react';/, "import { useMemo, useEffect } from 'react';");
fs.writeFileSync(f1, c1);

// 2. Fix RoutingSar3DOverlay React import & click logic
let f2 = 'frontend/src/components/RoutingSar3DOverlay.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
if (!c2.includes('import { useRef, useMemo, useState }')) {
  c2 = c2.replace(/import \{ useRef, useMemo \} from 'react';/, "import { useRef, useMemo, useState } from 'react';");
}
c2 = c2.replace(/React\.useState/g, "useState");
fs.writeFileSync(f2, c2);

// 3. Fix Solutions.tsx overlay and prop
let f3 = 'frontend/src/pages/Solutions.tsx';
let c3 = fs.readFileSync(f3, 'utf8');

// Fix the prop on one line
c3 = c3.replace(
  /\{activeTab === 'sar' && <RoutingSar3DOverlay simState=\{sarSimState\} activeMode=\{sarActiveMode\} sarTimeHour=\{sarTimeHour\} showCurrents=\{showCurrents\} showThermalRisk=\{showThermalRisk\} \/>\}/g,
  "{activeTab === 'sar' && <RoutingSar3DOverlay simState={sarSimState} activeMode={sarActiveMode} sarTimeHour={sarTimeHour} showCurrents={showCurrents} showThermalRisk={showThermalRisk} onRequest2D={() => setIs2DMode(true)} />}"
);

// Inject 2D Map above Canvas
const targetCanvas = /<div className=\{activeTab === 'iot' \? 'hidden' : 'w-full h-full'\}>\n\s*<Canvas/;
const replacementCanvas = `<div className={activeTab === 'iot' ? 'hidden' : 'w-full h-full relative'}>
          {is2DMode && activeTab === 'sar' && (
             <RoutingSar2DMap 
               activeMode={sarActiveMode}
               simState={sarSimState}
               sarTimeHour={sarTimeHour}
               showThermalRisk={showThermalRisk}
               onClose={() => setIs2DMode(false)}
             />
          )}
          <Canvas`;
c3 = c3.replace(targetCanvas, replacementCanvas);
fs.writeFileSync(f3, c3);

console.log('Patched all 2D logic');
