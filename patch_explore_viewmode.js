const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'stopAutoPilot();\n    };\n  }, []);',
  'stopAutoPilot();\n      useOceanStore.getState().setViewMode("3d");\n    };\n  }, []);'
);

fs.writeFileSync(file, content);
console.log('Explore.tsx unmount cleanup updated to reset viewMode to 3d');
