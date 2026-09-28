const fs = require('fs');
let file = 'frontend/src/components/landing/ProjectVisionSection.tsx';
let content = fs.readFileSync(file, 'utf8');

const cardsTarget = `  const cards = [
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
      desc: "OceanEmbed fundamentally bypasses physical sensors. By feeding satellite surface telemetry (SST, SSS, SSH) into our proprietary V6 Hybrid CNN + Vision Transformer Engine, mathematically constrained by Physics-Informed Neural Networks (PINN), we instantly reconstruct a high-fidelity 3D thermodynamic volume down to 1000m."
    },
    {
      num: "03",
      label: "Real-Time Application",
      title: "Tactical Live Inference",
      desc: "Our WebGL-powered 3D Digital Twin serves as a live command center. Click anywhere to instantly resolve 3D thermal gradients, locate submarine acoustic shadow zones (SLD), calculate cyclone heat potentials (TCHP), and trigger automated IoT evacuation alerts."
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
      desc: "Our WebGL-powered 3D Digital Twin serves as a live command center. Click anywhere to resolve 3D thermal gradients and instantly power 7 tactical modules: Naval Submarine Stealth, Cyclone Intensification, Marine Heatwaves, Subsea Cable Routing, SAR Drift Prediction, Sustainable Fisheries, and IoT Evacuation Alerts."
    }
  ];`;

content = content.replace(cardsTarget, cardsNew);
fs.writeFileSync(file, content);
console.log('Fixed ProjectVisionSection.tsx');
