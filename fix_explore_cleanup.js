const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    "import { startAutoPilot } from '../lib/autopilot';",
    "import { startAutoPilot, stopAutoPilot } from '../lib/autopilot';"
);

content = content.replace(
    "useOceanStore.getState().setError(null);\n    };\n  }, []);",
    "useOceanStore.getState().setError(null);\n      stopAutoPilot();\n    };\n  }, []);"
);

fs.writeFileSync(file, content);
console.log('Fixed Explore.tsx cleanup');
