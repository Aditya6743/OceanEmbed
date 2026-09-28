const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `      // Simulate historical variance deterministically based on date offset
      const var1 = Math.sin(lat * 12 + i * 2) * 0.8;
      const var2 = Math.cos(lon * 78 - i) * 0.5;
      const baseSST = 27.5 + var1 + var2;
      const sst = Math.max(16.0, Math.min(34.5, baseSST));
      
      results.push({ date: displayDate, sst: +sst.toFixed(2) });`;

const newLogic = `      // Synchronize exact fallback math with api.ts so history perfectly matches 3D model stats
      const targetDateStrForMath = d.toISOString().split('T')[0];
      const parsedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const doy = Math.floor((parsedDate.getTime() - new Date(parsedDate.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

      const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233 + doy * 3.14) * 43758.5453);
      const rnd = (offset = 1) => Math.abs(Math.sin(seed * offset + offset * 3.14159)) % 1;
      const noise = (offset, scale = 1.0) => (rnd(offset) + rnd(offset + 100) + rnd(offset + 200) - 1.5) * scale;

      const monthNum = parsedDate.getMonth();
      const seasonalAnomaly = 2.5 * Math.sin((monthNum - 1) * Math.PI / 6);
      const latEffect = -0.5 * (lat - 5);
      const lonEffect = (lon > 75) ? 1.5 : (lon < 60 ? -2.5 : -0.5);
      const localMicroclimate = noise(10, 3.5);

      const baseSST = 27.0 + latEffect + lonEffect + seasonalAnomaly + localMicroclimate;
      const sst = Math.max(16.0, Math.min(34.5, +baseSST.toFixed(2)));
      
      // Send the FULL YYYY-MM-DD string to HistoryChart.tsx so it can format it properly
      results.push({ date: targetDateStrForMath, sst: +sst.toFixed(2) });`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content);
console.log('Fixed SST trend logic in Explore.tsx');
