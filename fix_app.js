const fs = require('fs');
const file = 'frontend/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the conditional background block with just the GradientWaves
const regex = /\{!isMobile \? \([\s\S]*?\) \: \([\s\S]*?\}\)/g;
const replacement = `<div className="absolute inset-0">
            <GradientWaves 
                horizonColor="#020617"
                waveColor="#0891b2"
                crestColor="#22d3ee"
                speed={0.6}
                amplitude={2.1}
                waveScale={1.0}
                tilt={1.1}
                zoom={1.2}
                height={4.5}
                fogDepth={18}
                brightness={0.8}
                opacity={1.0}
                mouseInteraction={false}
                detail="low"
            />
          </div>`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Restored GradientWaves background for mobile.');
