const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update DigitalTwinGlobe props in Solutions.tsx
content = content.replace(
  /<DigitalTwinGlobe \n\s*viewMode=\{activeTab as any\} \n\s*climateSubMode=\{climateMode\} \n\s*isRotationLocked=\{isRotationLocked\}\n\s*\/>/g,
  `<DigitalTwinGlobe \n              viewMode={activeTab as any} \n              climateSubMode={climateMode} \n              isRotationLocked={isRotationLocked}\n              onRequest2D={() => setIs2DMode(true)}\n            />`
);

// We need to stop hiding the canvas entirely when in IoT mode.
// Previously: <div className={activeTab === 'iot' ? 'hidden' : 'w-full h-full relative'}>
// We want the canvas to show the globe for IoT.
content = content.replace(
  /<div className=\{activeTab === 'iot' \? 'hidden' : 'w-full h-full relative'\}>/g,
  `<div className="w-full h-full relative">`
);

// We also need to remove the direct rendering of IotRightView that was outside the canvas:
// {activeTab === 'iot' && <IotRightView simState={simState} handleIotAck={handleIotAck} />}
content = content.replace(
  /\{activeTab === 'iot' && <IotRightView simState=\{simState\} handleIotAck=\{handleIotAck\} \/>\}/g,
  ""
);

// And inject it into the relative overlay container where RoutingSar2DMap is:
const targetOverlay = /\{is2DMode && activeTab === 'sar' && \(\n\s*<RoutingSar2DMap/g;
const replacementOverlay = `{is2DMode && activeTab === 'iot' && (
             <IotRightView simState={simState} handleIotAck={handleIotAck} onClose={() => setIs2DMode(false)} />
          )}
          {is2DMode && activeTab === 'sar' && (
             <RoutingSar2DMap`;
content = content.replace(targetOverlay, replacementOverlay);

// Wait, the IotLeftPanel takes up width.
// The IotRightView is now an overlay inside the right side.
// Wait! Does IotLeftPanel take up 45% or 100%?
// `<div className={\`h-full ... ${activeTab === 'iot' ? 'w-full md:w-[45%]' : activeTab === 'sar' ? 'w-full md:w-[40%]' : 'w-full md:w-[35%]'}\`}>`
// That's fine, the Left panel takes 45%, and the right section (which now renders the Canvas) takes the rest.

fs.writeFileSync(file, content);
console.log('Patched Solutions for IoT 2D');
