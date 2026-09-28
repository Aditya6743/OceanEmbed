const lat = 15.0;
const lon = 65.0;
const dateStr = "2026-05-01";

// api.ts logic
const [y, m, d_str] = dateStr.split('-');
const parsedDate1 = new Date(parseInt(y), parseInt(m) - 1, parseInt(d_str));
const doy1 = Math.floor((parsedDate1.getTime() - new Date(parsedDate1.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

const seed1 = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233 + doy1 * 3.14) * 43758.5453);
const rnd1 = (offset = 1) => Math.abs(Math.sin(seed1 * offset + offset * 3.14159)) % 1;
const noise1 = (offset, scale = 1.0) => (rnd1(offset) + rnd1(offset + 100) + rnd1(offset + 200) - 1.5) * scale;
const month1 = parsedDate1.getMonth();
const seasonalAnomaly1 = 2.5 * Math.sin((month1 - 1) * Math.PI / 6);
const latEffect1 = -0.5 * (lat - 5);
const lonEffect1 = (lon > 75) ? 1.5 : (lon < 60 ? -2.5 : -0.5);
const localMicroclimate1 = noise1(10, 3.5);
const baseSST1 = 27.0 + latEffect1 + lonEffect1 + seasonalAnomaly1 + localMicroclimate1;
const sst1 = Math.max(16.0, Math.min(34.5, +baseSST1.toFixed(2)));


// Explore.tsx logic (with d from loop)
const [y2, m2, d2] = dateStr.split('-');
const target = new Date(parseInt(y2), parseInt(m2) - 1, parseInt(d2));
const d = new Date(target.getFullYear(), target.getMonth(), target.getDate() - 0); // i=0 (same day)

const targetDateStrForMath = d.toISOString().split('T')[0];
const parsedDate2 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
const doy2 = Math.floor((parsedDate2.getTime() - new Date(parsedDate2.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

const seed2 = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233 + doy2 * 3.14) * 43758.5453);
const rnd2 = (offset = 1) => Math.abs(Math.sin(seed2 * offset + offset * 3.14159)) % 1;
const noise2 = (offset, scale = 1.0) => (rnd2(offset) + rnd2(offset + 100) + rnd2(offset + 200) - 1.5) * scale;
const monthNum = parsedDate2.getMonth();
const seasonalAnomaly2 = 2.5 * Math.sin((monthNum - 1) * Math.PI / 6);
const latEffect2 = -0.5 * (lat - 5);
const lonEffect2 = (lon > 75) ? 1.5 : (lon < 60 ? -2.5 : -0.5);
const localMicroclimate2 = noise2(10, 3.5);
const baseSST2 = 27.0 + latEffect2 + lonEffect2 + seasonalAnomaly2 + localMicroclimate2;
const sst2 = Math.max(16.0, Math.min(34.5, +baseSST2.toFixed(2)));

console.log('API SST:', sst1);
console.log('Explore SST:', sst2);
