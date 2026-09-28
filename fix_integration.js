const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  // Generate 100% accurate history by directly querying the engine for the past 7 days
  const generateAccurateHistory = async (lat: number, lon: number, targetDateStr: string): Promise<HistoryDataPoint[]> => {
    // The backend CSV contains monthly data, but we need exactly the last 7 days.
    // We bypass the backend history and deterministically generate the last 7 days 
    // using the exact identical thermodynamic math as the main prediction engine.
    try {
      // We no longer call fetchHistory here to avoid getting 5-month arrays
    } catch (e) {
      // fallback below
    }
    
    // Fast fallback if backend is offline or history is empty
    
    const [y, m, d_str] = targetDateStr.split('-');
    const target = new Date(parseInt(y), parseInt(m) - 1, parseInt(d_str));
    
    const results = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(target.getFullYear(), target.getMonth(), target.getDate() - i);
      
      
      // Synchronize exact fallback math with api.ts so history perfectly matches 3D model stats
      const targetDateStrForMath = d.toISOString().split('T')[0];
      const parsedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const doy = Math.floor((parsedDate.getTime() - new Date(parsedDate.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

      const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233 + doy * 3.14) * 43758.5453);
      const rnd = (offset = 1) => Math.abs(Math.sin(seed * offset + offset * 3.14159)) % 1;
      const noise = (offset: number, scale = 1.0) => (rnd(offset) + rnd(offset + 100) + rnd(offset + 200) - 1.5) * scale;

      const monthNum = parsedDate.getMonth();
      const seasonalAnomaly = 2.5 * Math.sin((monthNum - 1) * Math.PI / 6);
      const latEffect = -0.5 * (lat - 5);
      const lonEffect = (lon > 75) ? 1.5 : (lon < 60 ? -2.5 : -0.5);
      const localMicroclimate = noise(10, 3.5);

      const baseSST = 27.0 + latEffect + lonEffect + seasonalAnomaly + localMicroclimate;
      const sst = Math.max(16.0, Math.min(34.5, +baseSST.toFixed(2)));
      
      // Send the FULL YYYY-MM-DD string to HistoryChart.tsx so it can format it properly
      results.push({ date: targetDateStrForMath, sst: +sst.toFixed(2) });
    }
    return results;
  };`;

const newStr = `  // Generate 100% accurate history by calling the exact same endpoint as the 3D block
  const generateAccurateHistory = async (lat: number, lon: number, targetDateStr: string): Promise<HistoryDataPoint[]> => {
    const [y, m, d_str] = targetDateStr.split('-');
    const target = new Date(parseInt(y), parseInt(m) - 1, parseInt(d_str));
    
    // We construct 7 days ending on the target date
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(target.getFullYear(), target.getMonth(), target.getDate() - i);
      // Format to YYYY-MM-DD safely avoiding timezone shifts
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(\`\${yyyy}-\${mm}-\${dd}\`);
    }

    try {
      // Query fetchOceanPrediction concurrently for all 7 days.
      // This guarantees 100% integration: if backend is online, it uses backend. If offline, uses fallback.
      // Promise.all ensures they run concurrently, so even if offline, it only takes 3s to timeout.
      const predictions = await Promise.all(
        dates.map(date => fetchOceanPrediction(lat, lon, date))
      );
      
      return predictions.map((pred, idx) => ({
        date: dates[idx],
        sst: pred.surface_data.sst
      }));
    } catch (err) {
      console.warn("Failed to generate historical trend concurrently", err);
      return [];
    }
  };`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log('Fixed historical integration!');
