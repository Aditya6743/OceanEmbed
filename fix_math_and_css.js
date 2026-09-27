const fs = require('fs');

// 1. Fix CSS in IotOverlays
let fPanel = 'frontend/src/components/IotBeaconsPanel.tsx';
let cPanel = fs.readFileSync(fPanel, 'utf8');

cPanel = cPanel.replace('className="absolute bottom-8 left-[380px] pointer-events-auto"', 'className="absolute pointer-events-auto" style={{ left: "360px", bottom: "32px" }}');
cPanel = cPanel.replace('className="absolute bottom-8 right-12 pointer-events-auto"', 'className="absolute pointer-events-auto" style={{ right: "48px", bottom: "32px" }}');
cPanel = cPanel.replace('className="absolute top-12 right-6 pointer-events-auto"', 'className="absolute pointer-events-auto" style={{ right: "24px", top: "48px" }}');

fs.writeFileSync(fPanel, cPanel);


// 2. Fix Math in DigitalTwinGlobe.tsx
let fGlobe = 'frontend/src/components/DigitalTwinGlobe.tsx';
let cGlobe = fs.readFileSync(fGlobe, 'utf8');

// Replace IotBroadcastLine
const oldHelper = `const IotBroadcastLine = ({ lat1, lon1, lat2, lon2, color, dashed }: { lat1: number, lon1: number, lat2: number, lon2: number, color: string, dashed?: boolean }) => {
  const points = useMemo(() => {
    const p1 = new THREE.Vector3().setFromSphericalCoords(2.01, (90 - lat1) * Math.PI/180, (lon1 + 180) * Math.PI/180);
    const p2 = new THREE.Vector3().setFromSphericalCoords(2.01, (90 - lat2) * Math.PI/180, (lon2 + 180) * Math.PI/180);
    const pts = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = new THREE.Vector3().copy(p1).lerp(p2, t);
      p.normalize().multiplyScalar(2.01 + Math.sin(t * Math.PI) * 0.05); // 0.05 arc height
      pts.push(p);
    }
    return pts;
  }, [lat1, lon1, lat2, lon2]);`;

const newHelper = `
const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
};

const IotBroadcastLine = ({ lat1, lon1, lat2, lon2, color, dashed }: { lat1: number, lon1: number, lat2: number, lon2: number, color: string, dashed?: boolean }) => {
  const points = useMemo(() => {
    const p1 = latLonToVector3(lat1, lon1, 2.01);
    const p2 = latLonToVector3(lat2, lon2, 2.01);
    const pts = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = new THREE.Vector3().copy(p1).lerp(p2, t);
      p.normalize().multiplyScalar(2.01 + Math.sin(t * Math.PI) * 0.05); // 0.05 arc height
      pts.push(p);
    }
    return pts;
  }, [lat1, lon1, lat2, lon2]);`;

cGlobe = cGlobe.replace(oldHelper, newHelper);

// Replace Hazard Circle Position
const oldHazard = `const hazardPos = new THREE.Vector3().setFromSphericalCoords(2.01, (90 - 16.0) * Math.PI/180, (70.5 + 180) * Math.PI/180);`;
const newHazard = `const hazardPos = latLonToVector3(16.0, 70.5, 2.01);`;

cGlobe = cGlobe.replace(oldHazard, newHazard);

fs.writeFileSync(fGlobe, cGlobe);
console.log('Fixed math and layout overlap');
