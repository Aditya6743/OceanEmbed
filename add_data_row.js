const fs = require('fs');
let file = 'README.md';
let content = fs.readFileSync(file, 'utf8');

const oldTable = `| Domain | Stack | Purpose in OceanEmbed |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 · TypeScript · Vite · Tailwind CSS · Zustand | Lightning-fast component UI, strict type safety, and highly resilient global state management. |
| **3D & Spatial** | React Three Fiber · THREE.js · Leaflet | Hardware-accelerated WebGL ocean rendering, Earth mapping, and immersive digital twin environments. |
| **Data Visualization** | Recharts · HTML5 Canvas | Rigorous scientific charting, statistical bounds visualization, and dynamic 2D topography mapping. |
| **Deep Learning & AI** | PyTorch · TorchVision | Deep learning architecture utilizing V6 Hybrid CNN+ViT+PINN, spatial attention masks, and massive neural tensor processing. |
| **API & Serving** | FastAPI · Uvicorn · Python 3.10 | High-concurrency REST API layer delivering sub-100ms real-time 3D volume reconstruction. |
| **DevOps** | Git · Docker · Render · Vercel | Source-code management, containerized microservices, and continuous edge deployment. |`;

const newTable = `| Domain | Stack | Purpose in OceanEmbed |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 · TypeScript · Vite · Tailwind CSS · Zustand | Lightning-fast component UI, strict type safety, and highly resilient global state management. |
| **3D & Spatial** | React Three Fiber · THREE.js · Leaflet | Hardware-accelerated WebGL ocean rendering, Earth mapping, and immersive digital twin environments. |
| **Data Visualization** | Recharts · HTML5 Canvas | Rigorous scientific charting, statistical bounds visualization, and dynamic 2D topography mapping. |
| **Data Engineering** | Xarray · NumPy · Pandas · NetCDF4 | High-dimensional spatiotemporal data parsing, multi-satellite telemetry harmonization, and robust matrix transformations. |
| **Deep Learning & AI** | PyTorch · TorchVision | Deep learning architecture utilizing V6 Hybrid CNN+ViT+PINN, spatial attention masks, and massive neural tensor processing. |
| **API & Serving** | FastAPI · Uvicorn · Python 3.10 | High-concurrency REST API layer delivering sub-100ms real-time 3D volume reconstruction. |
| **DevOps** | Git · Docker · Render · Vercel | Source-code management, containerized microservices, and continuous edge deployment. |`;

content = content.replace(oldTable, newTable);
fs.writeFileSync(file, content);
console.log('Added Data Engineering row to README');
