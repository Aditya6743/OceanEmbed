const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStartSim = `  const startSimulation = () => {
    if (activeMode === 'routing') {
      setShowThermalRisk(true);
    }
    onInteract();
    playUISound('start');
    setSimState('running');
    setProgress(0);`;

const newStartSim = `  const startSimulation = () => {
    if (activeMode === 'routing') {
      setShowThermalRisk(true);
    }
    setShowCurrents(true); // Auto-enable surface currents
    onInteract();
    playUISound('start');
    setSimState('running');
    setProgress(0);`;

content = content.replace(targetStartSim, newStartSim);

const targetExpand = `                    onClick={() => {
                      const next = sarTimeHour === 1 ? 3 : sarTimeHour === 3 ? 6 : sarTimeHour === 6 ? 12 : 24;
                      setSarTimeHour(next);
                      setSimState('complete');
                      onInteract();
                      playUISound('expand');
                    }}`;

const newExpand = `                    onClick={() => {
                      const next = sarTimeHour === 1 ? 3 : sarTimeHour === 3 ? 6 : sarTimeHour === 6 ? 12 : 24;
                      setSarTimeHour(next);
                      setSimState('complete');
                      setShowCurrents(true); // Auto-enable surface currents
                      onInteract();
                      playUISound('expand');
                    }}`;

content = content.replace(targetExpand, newExpand);

fs.writeFileSync(file, content);
console.log('Added auto-toggling for surface currents');
