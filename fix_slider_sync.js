const fs = require('fs');
let file = 'frontend/src/components/DepthSlice2D.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix handleAutopilotDepth
content = content.replace(
  '      setActiveDepth(e.detail);\n    };\n    window.addEventListener',
  '      setActiveDepth(e.detail);\n      useOceanStore.setState({ hoveredDepth: e.detail });\n    };\n    window.addEventListener'
);

// Fix updateDepthFromEvent
content = content.replace(
  '    setSliderDepth(newDepth);\n\n    if (debounceTimerRef.current)',
  '    setSliderDepth(newDepth);\n    useOceanStore.setState({ hoveredDepth: newDepth });\n\n    if (debounceTimerRef.current)'
);

fs.writeFileSync(file, content);
console.log('Fixed DepthSlice2D.tsx');
