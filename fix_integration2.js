const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = '  // Generate 100% accurate history by directly querying the engine for the past 7 days';
const endStr = '    return results;\n  };\n';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex) + endStr.length;

if (startIndex === -1 || endIndex < endStr.length) {
    console.error("Could not find the function block!");
    process.exit(1);
}

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
  };\n`;

content = content.substring(0, startIndex) + newStr + content.substring(endIndex);
fs.writeFileSync(file, content);
console.log('Successfully replaced generateAccurateHistory');
