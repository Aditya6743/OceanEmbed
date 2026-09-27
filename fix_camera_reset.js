const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update CameraResetTrigger logic
const oldAngles = `        const targetAzimuth = 0; 
        const targetPolar = Math.PI / 2; 
        const targetDist = 5.35;`;

const newAngles = `        let targetAzimuth = 0; 
        let targetPolar = Math.PI / 2; 
        let targetDist = 5.35;

        if (activeTab === 'iot' || activeTab === 'sar') {
            const lat = activeTab === 'iot' ? 14.5 : 12.5;
            const lon = activeTab === 'iot' ? 69.5 : 68.0;
            targetPolar = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            targetAzimuth = theta - Math.PI / 2;
            if (activeTab === 'sar') targetDist = 4.8;
        }`;

content = content.replace(oldAngles, newAngles);

// 2. Add handleRunSimulation interceptor
const interceptor = `  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const handleRunSimulation = () => {
      setIsRotationLocked(true);
      setRecenterTrigger(prev => prev + 1);
      runSimulation();
  };`;

content = content.replace('  const [recenterTrigger, setRecenterTrigger] = useState(0);', interceptor);

// 3. Inject handleRunSimulation into IotLeftPanel
content = content.replace('<IotLeftPanel \n                runSimulation={runSimulation}', '<IotLeftPanel \n                runSimulation={handleRunSimulation}');

fs.writeFileSync(file, content);
console.log('Fixed CameraResetTrigger and simulation trigger');
