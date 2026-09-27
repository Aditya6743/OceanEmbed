import { useOceanStore } from '../store/oceanStore';

let currentTimeout: any = null;
let isCancelled = false;

const wait = (ms: number) => new Promise(resolve => {
  currentTimeout = setTimeout(() => {
    if (window.location.pathname !== '/explore' && window.location.pathname !== '/') {
      isCancelled = true;
      useOceanStore.getState().setAutoPilotMode(false);
    }
    resolve(null);
  }, ms);
});

export const startAutoPilot = () => {
  if (currentTimeout) clearTimeout(currentTimeout);
  isCancelled = false;
  
  const store = useOceanStore.getState();
  if (!store.autoPilotMode) return;

  const demoSequence = async () => {
    try {
      useOceanStore.getState().setViewMode('3d');
      useOceanStore.getState().setIsMaximized(false);
      useOceanStore.getState().setActiveHighlight(null);
      useOceanStore.getState().setShowReportModal(false);
      useOceanStore.getState().setShowExportMenu(false);

      // 1. Pick a point in the square grid
      useOceanStore.getState().setLocation({
        latitude: 15.0,
        longitude: 65.0,
        date: '2026-05-01',
        region: 'ARABIAN SEA'
      });

      useOceanStore.getState().setActiveHighlight('globe');
      await wait(1500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 2. Glow the "Initialize Model" button
      useOceanStore.getState().setActiveHighlight('button');
      await wait(1000);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
      
      // Press the button explicitly!
      useOceanStore.getState().setIsLoading(true);

      // Wait for ML inference to complete
      while (useOceanStore.getState().isLoading) {
        await wait(100);
        if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
      }

      await wait(500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 3. Show Surface Observation
      useOceanStore.getState().setActiveHighlight('surface');
      await wait(2500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 4. Show Model Performance
      useOceanStore.getState().setActiveHighlight('performance');
      await wait(2500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 5. Show 5-Month SSD Trend
      useOceanStore.getState().setActiveHighlight('trend');
      await wait(2500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 5.5 Expand View so the visualizers look massive and cinematic
      useOceanStore.getState().setActiveHighlight(null);
      useOceanStore.getState().setIsMaximized(true);
      await wait(1500); // Wait for expansion animation
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 6. Show 3D Volume
      useOceanStore.getState().setViewMode('3d');
      useOceanStore.getState().setActiveHighlight('3d');
      await wait(5000); // Allow full 3D deep dive rotation before moving on
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 7. Show 2D Depth Slice
      useOceanStore.getState().setViewMode('2d');
      const storeState = useOceanStore.getState();
      const availableDepths = storeState.prediction?.profile?.depth || [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
      
      window.dispatchEvent(new CustomEvent('autopilot-depth', { detail: availableDepths[0] }));
      await wait(1500); // Wait 1.5s before starting slider as requested
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      const steps = availableDepths.length - 1;
      const delayPerStep = 4000 / steps; // 4 seconds total
      for (let i = 1; i <= steps; i++) {
        if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
        window.dispatchEvent(new CustomEvent('autopilot-depth', { detail: availableDepths[i] }));
        await wait(delayPerStep);
      }
      
      await wait(1000); // Pause at bottom
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 8. Show Temperature vs Depth Graph
      useOceanStore.getState().setActiveHighlight('charts');
      await wait(3500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // Close expanded view before moving to report/export
      useOceanStore.getState().setActiveHighlight(null);
      useOceanStore.getState().setIsMaximized(false);
      await wait(1000); // Wait for minimize animation
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 11. Intelligence Report Button (Highlight -> Click -> Wait -> Close)
      useOceanStore.getState().setActiveHighlight('report');
      await wait(1500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
      useOceanStore.getState().setShowReportModal(true);
      await wait(2500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
      useOceanStore.getState().setShowReportModal(false);
      await wait(1000);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;

      // 12. Export Button (Highlight -> Click -> Wait -> Close)
      useOceanStore.getState().setActiveHighlight('export');
      await wait(1500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
      useOceanStore.getState().setShowExportMenu(true);
      await wait(2500);
      if (isCancelled || !useOceanStore.getState().autoPilotMode) return;
      useOceanStore.getState().setShowExportMenu(false);
      await wait(1000);

      // Stop cleanly
      stopAutoPilot();
      
    } catch (err) {
      console.error('Autopilot error:', err);
      stopAutoPilot();
    }
  };

  demoSequence();
};

export const stopAutoPilot = () => {
  isCancelled = true;
  if (currentTimeout) clearTimeout(currentTimeout);
  
  const store = useOceanStore.getState();
  if (store.autoPilotMode) {
    store.setAutoPilotMode(false);
    store.setActiveHighlight(null);
    store.setIsMaximized(false); 
    store.setShowReportModal(false);
    store.setShowExportMenu(false);
  }
};
