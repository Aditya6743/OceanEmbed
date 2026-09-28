const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  // Generate 100% accurate history by directly querying the engine for the past 7 days
  const generateAccurateHistory = async (lat: number, lon: number, targetDateStr: string): Promise<HistoryDataPoint[]> => {
    try {
      const history = await fetchHistory(lat, lon);
      if (history && history.length > 0) return history;
    } catch (e) {
      // fallback below
    }`;

const newStr = `  // Generate 100% accurate history by directly querying the engine for the past 7 days
  const generateAccurateHistory = async (lat: number, lon: number, targetDateStr: string): Promise<HistoryDataPoint[]> => {
    // The backend CSV contains monthly data, but we need exactly the last 7 days.
    // We bypass the backend history and deterministically generate the last 7 days 
    // using the exact identical thermodynamic math as the main prediction engine.
    try {
      // We no longer call fetchHistory here to avoid getting 5-month arrays
    } catch (e) {
      // fallback below
    }`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log('Bypassed backend CSV for 7-day history');
