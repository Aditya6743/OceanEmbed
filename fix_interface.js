const fs = require('fs');
let file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const newInterface = `interface RoutingSarLeftPanelProps {
  activeMode: 'routing' | 'sar';
  setActiveMode: (mode: 'routing' | 'sar') => void;
  simState: 'idle' | 'running' | 'complete';
  setSimState: (state: 'idle' | 'running' | 'complete') => void;
  sarTimeHour: number;
  setSarTimeHour: (h: number) => void;
  showCurrents: boolean;
  setShowCurrents: (s: boolean) => void;
  showThermalRisk: boolean;
  setShowThermalRisk: (s: boolean) => void;
}`;

content = content.replace(/interface RoutingSarLeftPanelProps \{[\s\S]*?\}/, newInterface);

fs.writeFileSync(file, content);
console.log('Fixed interface');
