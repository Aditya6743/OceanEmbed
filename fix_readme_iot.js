const fs = require('fs');
let file = 'README.md';
let content = fs.readFileSync(file, 'utf8');

const targetLine = '- **Marine Heatwave & Anomaly Tracking:** Integrates live predicted profiles against massive 20-year historical climatology baselines to instantly generate dynamic anomaly heatmaps, detecting deeply trapped oceanic heat before it breaks the surface.';

const newLine = `- **Marine Heatwave & Anomaly Tracking:** Integrates live predicted profiles against massive 20-year historical climatology baselines to instantly generate dynamic anomaly heatmaps, detecting deeply trapped oceanic heat before it breaks the surface.
- **IoT Satellite Telemetry & Early Warning System:** Integrates real-time simulated LoRaWAN beacon tracking for vulnerable maritime assets (e.g. fishing vessels, tourist boats), instantly broadcasting automated evacuation alerts to tactical 2D and 3D dashboards when extreme thermal anomalies are detected.`;

content = content.replace(targetLine, newLine);

fs.writeFileSync(file, content);
console.log('Added IoT Beacons feature to README');
