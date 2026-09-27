const fs = require('fs');
const file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update ViewMode
content = content.replace(
  /type ViewMode = 'climate' \| 'navy' \| 'fishery' \| 'cable' \| 'enso' \| 'iot';/g,
  "type ViewMode = 'climate' | 'navy' | 'fishery' | 'cable' | 'enso' | 'iot' | 'sar';"
);

// 2. Add Import for components
content = content.replace(
  /import { useOceanStore } from '\.\.\/store\/oceanStore';/,
  "import { useOceanStore } from '../store/oceanStore';\nimport RoutingSarLeftPanel from '../components/RoutingSarLeftPanel';\nimport RoutingSar3DOverlay from '../components/RoutingSar3DOverlay';"
);

// 3. Import Navigation and LifeBuoy for the new button
content = content.replace(
  /import { Calendar, Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun, Lock, Unlock, Radio } from 'lucide-react';/,
  "import { Calendar, Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun, Lock, Unlock, Radio, Navigation } from 'lucide-react';"
);

// 4. Add the Tab Button AFTER IoT Beacons
const iotBtnTarget = /<button \s*onClick=\{\(\) => handleTabChange\('iot'\)\}.*?<\/button>/s;
content = content.replace(iotBtnTarget, (match) => {
  return match + `\n          <button 
            onClick={() => handleTabChange('sar')}
            className={\`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all \${
              activeTab === 'sar' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }\`}
          >
            <Navigation size={12} /> ROUTING & SAR
          </button>`;
});

// 5. Adjust layout width logic for activeTab === 'sar' (same as others)
content = content.replace(
  /w-full md:w-\[45%\]' : 'w-full md:w-\[35%\]'/g,
  "w-full md:w-[45%]' : activeTab === 'sar' ? 'w-full md:w-[40%]' : 'w-full md:w-[35%]'"
);

content = content.replace(
  /w-full md:w-\[55%\]' : 'w-full md:w-\[65%\]'/g,
  "w-full md:w-[55%]' : activeTab === 'sar' ? 'w-full md:w-[60%]' : 'w-full md:w-[65%]'"
);

// 6. Hook for SAR simulation state
content = content.replace(
  /const navigate = useNavigate\(\);/,
  `const [sarSimState, setSarSimState] = useState<'idle' | 'running' | 'complete'>('idle');\n  const navigate = useNavigate();`
);

// 7. Render RoutingSarLeftPanel
const iotLeftPanelTarget = /\{activeTab === 'iot' && \(\s*<IotLeftPanel[\s\S]*?\/>\s*\)\}/;
content = content.replace(iotLeftPanelTarget, (match) => {
  return match + `\n          {activeTab === 'sar' && (
            <RoutingSarLeftPanel 
               runSimulation={() => setSarSimState('running')} 
               resetSimulation={() => setSarSimState('idle')} 
            />
          )}`;
});

// 8. Render RoutingSar3DOverlay in Canvas
const earthGlobeTarget = /<EarthGlobe alwaysShowGrid=\{true\} showStars=\{true\} isRotationLocked=\{isRotationLocked\} \/>/;
content = content.replace(earthGlobeTarget, (match) => {
  return match + `\n            {activeTab === 'sar' && <RoutingSar3DOverlay simState={sarSimState} />}`;
});

// 9. Hide Date Picker for SAR
content = content.replace(
  /activeTab !== 'iot' && \(/g,
  "activeTab !== 'iot' && activeTab !== 'sar' && ("
);

// 10. Hide Legend for SAR
content = content.replace(
  /\{activeTab !== 'iot' && activeTab !== 'sar' && \(\s*<div className="mt-auto pt-4 border-t border-slate-800 shrink-0">/g,
  `{activeTab !== 'iot' && activeTab !== 'sar' && (
              <div className="mt-auto pt-4 border-t border-slate-800 shrink-0">`
);

fs.writeFileSync(file, content);
console.log('Patched Solutions.tsx');
