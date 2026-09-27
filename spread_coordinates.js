const fs = require('fs');

// 1. Update 2D Map (IotBeaconsPanel.tsx)
let fPanel = 'frontend/src/components/IotBeaconsPanel.tsx';
let cPanel = fs.readFileSync(fPanel, 'utf8');

// Update coordinates in the map variables
cPanel = cPanel.replace('const gateway = [18.92, 72.82];', 'const gateway = [18.92, 72.82];');
cPanel = cPanel.replace('const b1 = [17.5, 70.0];', 'const b1 = [16.0, 68.0];');
cPanel = cPanel.replace('const b2 = [15.0, 71.5];', 'const b2 = [12.0, 72.0];');
cPanel = cPanel.replace('center={[16.0, 70.5] as any} radius={400000}', 'center={[14.5, 69.5] as any} radius={800000}');

// Update coordinates in the text
cPanel = cPanel.replace('LAT: 17.5000', 'LAT: 16.0000');
cPanel = cPanel.replace('LON: 70.0000', 'LON: 68.0000');
cPanel = cPanel.replace('LAT: 15.0000', 'LAT: 12.0000');
cPanel = cPanel.replace('LON: 71.5000', 'LON: 72.0000');

fs.writeFileSync(fPanel, cPanel);


// 2. Update 3D Globe (DigitalTwinGlobe.tsx)
let fGlobe = 'frontend/src/components/DigitalTwinGlobe.tsx';
let cGlobe = fs.readFileSync(fGlobe, 'utf8');

// A. Fix the Z-fighting by raising everything above the 2.05 displacement map (radius 2.06)
cGlobe = cGlobe.replace(/radius = 2\.01/g, 'radius = 2.06');
cGlobe = cGlobe.replace(/2\.01/g, '2.06');

// B. Update the IotBeacon components
cGlobe = cGlobe.replace('<IotBeacon lat={17.5} lon={70.0}', '<IotBeacon lat={16.0} lon={68.0}');
cGlobe = cGlobe.replace('<IotBeacon lat={15.0} lon={71.5}', '<IotBeacon lat={12.0} lon={72.0}');

// C. Update the Hazard Circle position and scale
cGlobe = cGlobe.replace('latLonToVector3(16.0, 70.5, 2.06)', 'latLonToVector3(14.5, 69.5, 2.06)');
cGlobe = cGlobe.replace('<circleGeometry args={[0.12, 32]} />', '<circleGeometry args={[0.22, 64]} />');
cGlobe = cGlobe.replace('<ringGeometry args={[0.115, 0.12, 64]} />', '<ringGeometry args={[0.21, 0.22, 128]} />');

// D. Update the Broadcast Lines
cGlobe = cGlobe.replace('lat2={17.5} lon2={70.0}', 'lat2={16.0} lon2={68.0}');
cGlobe = cGlobe.replace('lat2={15.0} lon2={71.5}', 'lat2={12.0} lon2={72.0}');

// E. Update the text in the Html Popups
cGlobe = cGlobe.replace('LAT: 17.5000', 'LAT: 16.0000');
cGlobe = cGlobe.replace('LON: 70.0000', 'LON: 68.0000');
cGlobe = cGlobe.replace('LAT: 15.0000', 'LAT: 12.0000');
cGlobe = cGlobe.replace('LON: 71.5000', 'LON: 72.0000');

fs.writeFileSync(fGlobe, cGlobe);
console.log('Fixed coordinates and Z-fighting');
