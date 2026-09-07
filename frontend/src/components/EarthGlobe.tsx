import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useOceanStore } from '../store/oceanStore';
import { Ping } from './Ping';

const playSimplePing = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    if (!(window as any).audioCtx) (window as any).audioCtx = new AudioContext();
    const ctx = (window as any).audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

const vertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vPosition;
  uniform float time;
  uniform float showHighlight;
  
  void main() {
    if (showHighlight < 0.5) discard;
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    // Bounds: 5N - 30N, 45E - 105E
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
      float pulse = (sin(time * 2.0) + 1.0) * 0.5 * 0.15 + 0.05;
      
      float edgeX = min(lon - 45.0, 105.0 - lon);
      float edgeY = min(lat - 5.0, 30.0 - lat);
      float edge = min(edgeX, edgeY);
      
      float intensity = 0.0;
      if (edge < 0.3) {
        intensity = 0.5;
      } else if (edge < 1.0) {
        intensity = 0.5 * (1.0 - (edge - 0.3) / 0.7);
      }
      
      float gridX = mod(lon, 5.0);
      float gridY = mod(lat, 5.0);
      if (gridX < 0.1 || gridY < 0.1) {
         intensity = max(intensity, 0.15);
      }
      
      gl_FragColor = vec4(0.13, 0.83, 0.93, max(pulse, intensity) * 0.4);
    } else {
      discard;
    }
  }
`;

export default function EarthGlobe({ alwaysShowGrid = false, showStars = true }: { alwaysShowGrid?: boolean, showStars?: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const targetQuaternionRef = useRef<THREE.Quaternion | null>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const [pingPos, setPingPos] = useState<THREE.Vector3 | null>(null);
  
  const selectedLocation = useOceanStore(state => state.selectedLocation);
  const setLocation = useOceanStore(state => state.setLocation);
  const error = useOceanStore(state => state.error);
  
  const { gl } = useThree();
  useEffect(() => {
    const blockDrag = (e: PointerEvent) => {
      if (document.body.dataset.canDrag === 'false') {
        e.stopPropagation();
      }
    };
    gl.domElement.addEventListener('pointerdown', blockDrag, { capture: true });
    return () => gl.domElement.removeEventListener('pointerdown', blockDrag, { capture: true });
  }, [gl]);


  
  const [colorMap, specularMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_normal.jpg'
  ]);

  useEffect(() => {
    if (colorMap && specularMap && normalMap) {
      const maxAnisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
      colorMap.anisotropy = maxAnisotropy;
      specularMap.anisotropy = maxAnisotropy;
      normalMap.anisotropy = maxAnisotropy;
      colorMap.minFilter = THREE.LinearMipmapLinearFilter;
      colorMap.magFilter = THREE.LinearFilter;
      specularMap.minFilter = THREE.LinearMipmapLinearFilter;
      specularMap.magFilter = THREE.LinearFilter;
      normalMap.minFilter = THREE.LinearMipmapLinearFilter;
      normalMap.magFilter = THREE.LinearFilter;
      colorMap.needsUpdate = true;
      specularMap.needsUpdate = true;
      normalMap.needsUpdate = true;
    }
  }, [colorMap, specularMap, normalMap, gl]);

  const showErrorBounds = error !== null && error.toLowerCase().includes("out of bounds");

  useFrame((state) => {
    if (globeRef.current && !selectedLocation) {
      if (showErrorBounds) {
        if (targetQuaternionRef.current) {
          globeRef.current.quaternion.slerp(targetQuaternionRef.current, 0.1);
        }
      } else {
        targetQuaternionRef.current = null;
      }
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = state.clock.elapsedTime;
      const target = (alwaysShowGrid || showErrorBounds) ? 1.0 : 0.0;
      shaderRef.current.uniforms.showHighlight.value += (target - shaderRef.current.uniforms.showHighlight.value) * 0.1;
    }
  });

  const handleClick = (e: any) => {
    if (e.delta > 2) return;
    playSimplePing();
    e.stopPropagation();
    
    const point = globeRef.current!.worldToLocal(e.point.clone()).normalize();
    const lat = Math.asin(point.y) * (180 / Math.PI);
    const lon = Math.atan2(-point.z, point.x) * (180 / Math.PI);
    
    setPingPos(point.clone().multiplyScalar(2)); 
    
    if (lat < 5 || lat > 30 || lon < 45 || lon > 105) {
      useOceanStore.getState().setError("Out of bounds", { x: e.clientX, y: e.clientY });
      const targetEuler = new THREE.Euler(17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0);
      targetQuaternionRef.current = new THREE.Quaternion().setFromEuler(targetEuler);
      setTimeout(() => { targetQuaternionRef.current = null; }, 1500);
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const region = "INDIAN OCEAN";
    
    setLocation({
      latitude: Number(lat.toFixed(2)),
      longitude: Number(lon.toFixed(2)),
      date: today,
      region
    });
  };

  const markerPosition = useMemo(() => {
    if (!selectedLocation) return null;
    const phi = selectedLocation.latitude * (Math.PI / 180);
    const theta = selectedLocation.longitude * (Math.PI / 180);
    const r = 2.01;
    return new THREE.Vector3(
      r * Math.cos(phi) * Math.cos(theta),
      r * Math.sin(phi),
      r * Math.cos(phi) * -Math.sin(theta)
    );
  }, [selectedLocation]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    showHighlight: { value: 0 }
  }), []);

  return (
    <group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[0, -10, 0]} intensity={0.5} color="#ffffff" />
      
      {showStars && <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1.5} />}
      
      {pingPos && <Ping point={pingPos} onComplete={() => setPingPos(null)} />}
      
      {/* INVISIBLE OUTER "GRAB" SPHERE - Catch hovers outside the physical earth */}
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); gl.domElement.style.cursor = 'grab'; }}
        onPointerOut={() => { gl.domElement.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0} side={THREE.BackSide} />
      </mesh>

                  {/* INVISIBLE EDGE SPHERE FOR DRAG BOUNDS */}
      <mesh 
        onPointerEnter={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('setCursor', { detail: 'grab' })); document.body.dataset.canDrag = 'true'; }}
        onPointerMove={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('setCursor', { detail: 'grab' })); document.body.dataset.canDrag = 'true'; }}
        onPointerLeave={() => { window.dispatchEvent(new CustomEvent('setCursor', { detail: 'auto' })); document.body.dataset.canDrag = 'false'; }}
      >
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial visible={false} />
      </mesh>

            {/* PHYSICAL EARTH SPHERE */}
      <Sphere 
        args={[2, 64, 64]} 
        onClick={handleClick}
        onPointerEnter={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('setCursor', { detail: 'crosshair' })); document.body.dataset.canDrag = 'true'; }}
        onPointerMove={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('setCursor', { detail: 'crosshair' })); document.body.dataset.canDrag = 'true'; }}
        onPointerLeave={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('setCursor', { detail: 'grab' })); document.body.dataset.canDrag = 'true'; }}
      >
        <meshPhongMaterial 
          map={colorMap}
          specularMap={specularMap} normalMap={normalMap} normalScale={new THREE.Vector2(0.5, 0.5)}
          specular={new THREE.Color('#0a5c7a')}
          shininess={15}
        />
      </Sphere>
      
      {/* OVERLAYS */}
      <Sphere args={[2.005, 64, 64]} raycast={() => null}>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <Sphere args={[2.02, 64, 64]} raycast={() => null}>
        <meshBasicMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={0.12} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* MARKER */}
      {markerPosition && (
        <group position={markerPosition}>
          <mesh>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#0ea5e9" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}
