const fs = require('fs');
let file = 'README.md';
let content = fs.readFileSync(file, 'utf8');

const oldText = `- **Proactive Tactical Routing:** Leverages subsurface thermal gradients and Acoustic Shadow Zones to chart optimal, stealth-maximized evasion paths for submarine fleets navigating high-risk operational theaters.
- **Reactive Search & Rescue (SAR) Drift Modeling:** Combines surface current vectors with subsurface density matrices to predict drifting object trajectories, calculating mathematically rigorous 24-hour search radius expansions for rapid disaster response.`;

const newText = `- **Tactical Routing & SAR Drift Modeling:** A powerful dual-engine maritime decision system that leverages spatial thermal gradients for stealth-optimized proactive submarine routing, and combines surface current matrices to mathematically predict reactive 24-hour Search and Rescue (SAR) object trajectories.`;

content = content.replace(oldText, newText);

fs.writeFileSync(file, content);
console.log('Combined Routing & SAR in README');
