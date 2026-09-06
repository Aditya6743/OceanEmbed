import * as THREE from 'three';
const geom = new THREE.SphereGeometry(2, 32, 32);
const pos = geom.attributes.position;
const uv = geom.attributes.uv;

for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  const z = pos.getZ(i);
  
  if (Math.abs(y) < 0.01) { // Equator
    if (x > 1.99 && Math.abs(z) < 0.01) console.log("+X axis UV:", uv.getX(i));
    if (z > 1.99 && Math.abs(x) < 0.01) console.log("+Z axis UV:", uv.getX(i));
    if (x < -1.99 && Math.abs(z) < 0.01) console.log("-X axis UV:", uv.getX(i));
    if (z < -1.99 && Math.abs(x) < 0.01) console.log("-Z axis UV:", uv.getX(i));
  }
}
