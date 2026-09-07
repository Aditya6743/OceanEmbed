import { useOceanStore } from '../store/oceanStore';

let currentTimeout: any = null;

export const startAutoPilot = () => {
  if (currentTimeout) clearTimeout(currentTimeout);
  
  const store = useOceanStore.getState();
  if (!store.autoPilotMode) return;

  const locations = [
    { name: "BAY OF BENGAL", lat: 15.0, lon: 85.0 },
    { name: "ARABIAN SEA", lat: 15.0, lon: 65.0 },
    { name: "EQUATORIAL INDIAN OCEAN", lat: 6.0, lon: 77.0 }
  ];

  let step = 0;

  const runSequence = () => {
    if (!useOceanStore.getState().autoPilotMode) return; // cancelled
    if (step >= locations.length) {
      useOceanStore.getState().setAutoPilotMode(false);
      return;
    }

    const loc = locations[step];
    useOceanStore.getState().setLocation({
      latitude: loc.lat,
      longitude: loc.lon,
      date: '2026-05-01',
      region: loc.name
    });

    step++;
    currentTimeout = setTimeout(runSequence, 10000);
  };

  currentTimeout = setTimeout(runSequence, 1000);
};

export const stopAutoPilot = () => {
  if (currentTimeout) clearTimeout(currentTimeout);
  useOceanStore.getState().setAutoPilotMode(false);
};
