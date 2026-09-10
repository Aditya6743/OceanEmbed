import { useOceanStore } from '../store/oceanStore';

let currentTimeout: any = null;
let isCancelled = false;

export const startAutoPilot = () => {
  if (currentTimeout) clearTimeout(currentTimeout);
  isCancelled = false;
  
  const store = useOceanStore.getState();
  if (!store.autoPilotMode) return;

  const demoSequence = async () => {
    // 1. Pick a point in the square grid
    useOceanStore.getState().setLocation({
      latitude: 15.0,
      longitude: 65.0,
      date: '2026-05-01',
      region: 'ARABIAN SEA'
    });

    useOceanStore.getState().setActiveHighlight('globe');

    // Wait for the globe point to register visually
    await new Promise(r => { currentTimeout = setTimeout(r, 2000); });
    if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

    // 2. Glow the "Initialize Model" (analysis inference) button BEFORE pressing it
    useOceanStore.getState().setActiveHighlight('button');
    
    // Wait a moment so the audience sees the button is being targeted
    await new Promise(r => { currentTimeout = setTimeout(r, 1200); });
    if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
    
    // Actually press the button
    useOceanStore.getState().setIsLoading(true);

    // DYNAMIC SYNC: Wait for the ML model to finish fetching instead of guessing the time!
    while (useOceanStore.getState().isLoading) {
      await new Promise(r => { currentTimeout = setTimeout(r, 100); });
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
    }

    // Wait just a tiny bit for the UI to fade in
    await new Promise(r => { currentTimeout = setTimeout(r, 500); });
    if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

    // 3. Glow the metrics panel
    useOceanStore.getState().setActiveHighlight('metrics');
    await new Promise(r => { currentTimeout = setTimeout(r, 4000); });
    if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

    // 4. Glow the 3D depth visualizer
    useOceanStore.getState().setActiveHighlight('3d');
    await new Promise(r => { currentTimeout = setTimeout(r, 5000); });
    if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

    // 5. Glow the charts
    useOceanStore.getState().setActiveHighlight('charts');
    await new Promise(r => { currentTimeout = setTimeout(r, 6000); });
    if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

    // Restart or end
    useOceanStore.getState().setActiveHighlight(null);
    startAutoPilot(); // Loop the demo
  };

  demoSequence();
};

export const stopAutoPilot = () => {
  isCancelled = true;
  if (currentTimeout) clearTimeout(currentTimeout);
  useOceanStore.getState().setAutoPilotMode(false);
  useOceanStore.getState().setActiveHighlight(null);
};
