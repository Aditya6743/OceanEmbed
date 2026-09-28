async function run() {
  const lat = 15.123;
  const lon = 65.456;
  
  // Test offline JS fallback behavior by not running backend
  
  // 1. Simulate what Explore.tsx does for the 7-day trend
  const dates = ['2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30', '2026-05-01'];
  
  for (const date of dates) {
    const safeDateStr = date;
    const [y, m, d_str] = safeDateStr.split('-');
    const parsedDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d_str));
    const doy = Math.floor((parsedDate.getTime() - new Date(parsedDate.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233 + doy * 3.14) * 43758.5453);
    const rnd = (offset = 1) => {
      const s = Math.abs(Math.sin(seed * offset + offset * 3.14159)) % 1;
      return s;
    };
    const noise = (offset, scale = 1.0) => (rnd(offset) + rnd(offset + 100) + rnd(offset + 200) - 1.5) * scale;
    const month = parsedDate.getMonth(); 
    
    const seasonalAnomaly = 2.5 * Math.sin((month - 1) * Math.PI / 6);
    const latEffect = -0.5 * (lat - 5); 
    const lonEffect = (lon > 75) ? 1.5 : (lon < 60 ? -2.5 : -0.5); 
    const localMicroclimate = noise(10, 3.5); 

    const baseSST = 27.0 + latEffect + lonEffect + seasonalAnomaly + localMicroclimate;
    const sst = Math.max(16.0, Math.min(34.5, +baseSST.toFixed(2))); 
    
    console.log(`${date} -> Trend SST: ${sst}`);
  }
}

run();
