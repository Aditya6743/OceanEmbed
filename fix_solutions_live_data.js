const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  useEffect(() => {
    // Connect Solutions dashboard to the LIVE PyTorch AI Model
    const fetchLiveStats = async () => {
      try {
        // Fetch from the PyTorch backend API using actual Copernicus Live data
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(\`\${baseUrl}/predict?lat=\${liveData.lat}&lon=\${liveData.lon}&date=\${useOceanStore.getState().selectedDate || "2026-06-01"}\`);
        if (res.ok) {
          const data = await res.json();
          const temps = data.profile.temperature;
          const depths = data.profile.depth;
          
          // Calculate actual TCHP (Tropical Cyclone Heat Potential) using the deep learning output
          // Integral of (T - 26) * density * heat_capacity for depths where T > 26C
          let calculatedTchp = 0;
          for(let i=0; i<temps.length; i++) {
             if (temps[i] > 26) {
               const depthSlice = i === 0 ? depths[0] : (depths[i] - depths[i-1]);
               calculatedTchp += (temps[i] - 26) * depthSlice * 0.4; 
             }
          }
          
          setLiveData(prev => ({
             ...prev,
             tchp: Math.max(12.5, calculatedTchp),
             sst: data.surface_data.sst,
             sss: data.surface_data.sss,
             ssh: data.surface_data.ssh,
             wind: Math.sqrt(Math.pow(data.surface_data.wind_u, 2) + Math.pow(data.surface_data.wind_v, 2))
          }));
        }
      } catch (err) {
         // Silently fail and use default random baseline on first load
      }
    };

    fetchLiveStats();
    const int = setInterval(fetchLiveStats, 5000); // Ping API every 5 seconds
    return () => clearInterval(int);
  }, [selectedDate]);`;


const newStr = `  useEffect(() => {
    // Connect Solutions dashboard to the main API module (which safely handles offline fallback mode)
    const fetchLiveStats = async () => {
      try {
        // Fetch using the shared API wrapper to guarantee sync and fallback generation
        const data = await fetchOceanPrediction(
           liveData.lat, 
           liveData.lon, 
           useOceanStore.getState().selectedDate || "2026-06-01"
        );
        
        const temps = data.profile.temperature;
        const depths = data.profile.depth;
        
        // Calculate actual TCHP (Tropical Cyclone Heat Potential) using the deep learning output
        let calculatedTchp = 0;
        for(let i=0; i<temps.length; i++) {
           if (temps[i] > 26) {
             const depthSlice = i === 0 ? depths[0] : (depths[i] - depths[i-1]);
             calculatedTchp += (temps[i] - 26) * depthSlice * 0.4; 
           }
        }
        
        setLiveData(prev => ({
           ...prev,
           tchp: Math.max(12.5, calculatedTchp),
           sst: data.surface_data.sst,
           sss: data.surface_data.sss,
           ssh: data.surface_data.ssh,
           wind: Math.sqrt(Math.pow(data.surface_data.wind_u, 2) + Math.pow(data.surface_data.wind_v, 2))
        }));
      } catch (err) {
         // Silently fail and use default random baseline on first load
      }
    };

    fetchLiveStats();
    // No need to spam setInterval for historical/deterministic data. 
    // It updates smoothly when the dependency (selectedDate) changes!
  }, [selectedDate]);`;

if(content.includes('// Connect Solutions dashboard to the LIVE PyTorch AI Model')) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Fixed Solutions panel integration');
} else {
    console.error('Could not find the target string');
}
