const fs = require('fs');
let i = fs.readFileSync('frontend/src/components/IotBeaconsPanel.tsx', 'utf8');
i = i.replace('export const IotLeftPanel = ({ simState, runSimulation, resetSimulation, iotLogs, toggleMute }: any) => {\n  const store = useOceanStore();', 'export const IotLeftPanel = ({ simState, runSimulation, resetSimulation, iotLogs, toggleMute }: any) => {');
fs.writeFileSync('frontend/src/components/IotBeaconsPanel.tsx', i);
