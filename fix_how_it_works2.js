const fs = require('fs');
let file = 'frontend/src/pages/HowItWorks.tsx';
let content = fs.readFileSync(file, 'utf8');

const cardsTarget = `  const cards = [
    {
      num: "01",
      label: "The Problem",
      title: "The Hidden Ocean",
      desc: "Satellites provide massive amounts of real-time data about the ocean's surface, but they cannot penetrate the water. The deep ocean, which drives global climate and cyclones, remains entirely hidden from space. Physical sensors like Argo floats leave massive geographical gaps."
    },
    {
      num: "02",
      label: "The Solution",
      title: "AI Reconstruction",
      desc: "OceanEmbed leverages advanced machine learning to bridge the gap. By learning the complex thermodynamic relationships between surface telemetry (SST, SSH, SSS, winds) and deep layers, we can generate continuous 3D ocean models entirely from satellite data."
    },
    {
      num: "03",
      label: "Our Prototype",
      title: "Live Inference",
      desc: "Our interactive dashboard connects to a live backend inference engine. Select any coordinate in the North Indian Ocean to instantly receive a 3D thermodynamic volume, thermal gradients (dT/dz), confidence intervals, and depth-layer climatology anomalies."
    }
  ];`;

const cardsNew = `  const cards = [
    {
      num: "01",
      label: "The Problem",
      title: "The Hidden Ocean",
      desc: "Satellites provide massive amounts of real-time surface data, but the deep ocean—which drives global climate and cyclones—remains entirely hidden from space. Physical sensors like Argo floats are incredibly expensive, geographically sparse, and fundamentally unscalable for real-time global monitoring."
    },
    {
      num: "02",
      label: "The Solution",
      title: "V6 Hybrid AI Architecture",
      desc: "OceanEmbed fundamentally bypasses physical sensors. By feeding satellite surface telemetry (SST, SSS, SSH, Currents, Winds) into our proprietary V6 Hybrid CNN + Vision Transformer Engine, mathematically constrained by Physics-Informed Neural Networks (PINN), we instantly reconstruct a high-fidelity 3D thermodynamic volume down to 1000m."
    },
    {
      num: "03",
      label: "Real-Time Application",
      title: "Tactical Live Inference",
      desc: "Our WebGL-powered 3D Digital Twin serves as a live command center. Click anywhere to resolve 3D thermal gradients and instantly power 7 tactical modules: Disaster Mgmt, Naval Ops, Fisheries, Benthic Cable, IOD Climate, IoT Beacons, and Routing & SAR."
    }
  ];`;

content = content.replace(cardsTarget, cardsNew);
fs.writeFileSync(file, content);
console.log('Fixed HowItWorks.tsx');
