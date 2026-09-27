const fs = require('fs');
const file = 'frontend/src/components/RoutingSarLeftPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix imports
content = content.replace(
  /import React, \{ useState, useEffect \} from 'react';/g,
  "import { useState } from 'react';"
);

content = content.replace(
  /import \{ Navigation, LifeBuoy, Anchor, Activity, Clock, ShieldAlert, Thermometer, Layers, Route, Play, RefreshCw, Zap, Maximize2, MoveRight, Eye \} from 'lucide-react';/g,
  "import { Navigation, LifeBuoy, Anchor, ShieldAlert, Thermometer, Layers, Route, Play, RefreshCw, MoveRight } from 'lucide-react';"
);

content = content.replace(
  /import \{ useOceanStore \} from '\.\.\/store\/oceanStore';\n/g,
  ""
);

// Fix props usage
content = content.replace(
  /export default function RoutingSarLeftPanel\(\{ runSimulation, resetSimulation \}: RoutingSarLeftPanelProps\) \{/g,
  `export default function RoutingSarLeftPanel({ runSimulation, resetSimulation }: RoutingSarLeftPanelProps) {`
);

content = content.replace(
  /const startSimulation = \(\) => \{/g,
  `const startSimulation = () => {
    runSimulation();`
);

content = content.replace(
  /const reset = \(\) => \{/g,
  `const reset = () => {
    resetSimulation();`
);

fs.writeFileSync(file, content);
console.log('Fixed Left Panel');
