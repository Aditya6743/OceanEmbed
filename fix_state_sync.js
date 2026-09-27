const fs = require('fs');

// 1. Update RoutingSarLeftPanel
let file1 = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content1 = fs.readFileSync(file1, 'utf8');

content1 = content1.replace(
  /interface RoutingSarLeftPanelProps \{[\s\S]*?\}/,
  "interface RoutingSarLeftPanelProps {\n  simState: 'idle' | 'running' | 'complete';\n  setSimState: (state: 'idle' | 'running' | 'complete') => void;\n}"
);

content1 = content1.replace(
  /export default function RoutingSarLeftPanel\(\{ runSimulation, resetSimulation \}: RoutingSarLeftPanelProps\) \{/g,
  `export default function RoutingSarLeftPanel({ simState, setSimState }: RoutingSarLeftPanelProps) {`
);

content1 = content1.replace(
  /const \[simState, setSimState\] = useState<'idle' \| 'running' \| 'complete'>\('idle'\);\n/g,
  ""
);

content1 = content1.replace(
  /const startSimulation = \(\) => \{\n    runSimulation\(\);/g,
  `const startSimulation = () => {`
);

content1 = content1.replace(
  /const reset = \(\) => \{\n    resetSimulation\(\);/g,
  `const reset = () => {`
);

fs.writeFileSync(file1, content1);

// 2. Update Solutions.tsx
let file2 = 'frontend/src/pages/Solutions.tsx';
let content2 = fs.readFileSync(file2, 'utf8');

content2 = content2.replace(
  /runSimulation=\{.*\}\s*resetSimulation=\{.*\}/,
  "simState={sarSimState} \n               setSimState={setSarSimState}"
);

fs.writeFileSync(file2, content2);
console.log('Fixed state sync');
