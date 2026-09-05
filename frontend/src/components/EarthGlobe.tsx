import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useOceanStore } from '../store/oceanStore';

const playSimplePing = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    if (!(window as any).audioCtx) (window as any).audioCtx = new AudioContext();
    const ctx = (window as any).audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Clean, normal soothing UI ping (no random chords or space bends)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    
    // Quick attack, soft clear decay
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

export default function EarthGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  const selectedLocation = useOceanStore(state => state.selectedLocation);
  const setLocation = useOceanStore(state => state.setLocation);
  const { gl } = useThree();
  
  // Load textures
  const [colorMap, specularMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_normal.jpg'
  ]);

  // Maximize texture quality to prevent blurring when zoomed
  useEffect(() => {
    if (colorMap && specularMap && normalMap) {
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
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

  // Subtle rotation
  useFrame(() => {
    if (globeRef.current && !selectedLocation) {
      globeRef.current.rotation.y += 0.0005;
    }
  });

  const handleClick = (e: any) => {
    if (e.delta > 2) return;
    playSimplePing();
    e.stopPropagation();
    
    // Calculate lat/lon from local 3D intersection point on the sphere (radius 2)
    const point = globeRef.current!.worldToLocal(e.point.clone()).normalize();
    const lat = Math.asin(point.y) * (180 / Math.PI);
    const lon = Math.atan2(point.x, point.z) * (180 / Math.PI);
    
    const today = new Date().toISOString().split('T')[0];
    
    const region = (lat > 0 && lon > 30 && lon < 100) ? "INDIAN OCEAN" 
                 : (lat > 0 && (lon > 100 || lon < -90)) ? "NORTH PACIFIC"
                 : (lat < 0 && (lon > 100 || lon < -90)) ? "SOUTH PACIFIC"
                 : (lat > 0 && lon > -90 && lon < 0) ? "NORTH ATLANTIC"
                 : (lat < 0 && lon > -90 && lon < 20) ? "SOUTH ATLANTIC"
                 : (lat < -60) ? "SOUTHERN OCEAN"
                 : (lat > 60) ? "ARCTIC OCEAN" : "OCEAN TARGET";
    
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
      r * Math.cos(phi) * Math.sin(theta),
      r * Math.sin(phi),
      r * Math.cos(phi) * Math.cos(theta)
    );
  }, [selectedLocation]);

  return (
    <group ref={globeRef} rotation={[0.2, -1.8, 0]}>
      {/* High ambient light completely removes the day/night shadow, illuminating the whole globe */}
      <ambientLight intensity={1.2} color="#ffffff" />
      
      {/* Lights from multiple angles to maintain shiny oceans everywhere without creating a dark side */}
      <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[0, -10, 0]} intensity={0.5} color="#ffffff" />
      
      {/* Stars placed back in the same scene as Earth so they move together */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
      
      {/* Main Earth - Upgraded to 128 segments for perfectly smooth premium boundary */}
      <Sphere 
        args={[2, 128, 128]} 
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'crosshair'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshPhongMaterial 
          map={colorMap}
          specularMap={specularMap} normalMap={normalMap} normalScale={new THREE.Vector2(0.5, 0.5)}
          specular={new THREE.Color('#0a5c7a')}
          shininess={15}
        />
      </Sphere>
      
      {/* Premium Atmospheric Boundary Glow */}
      <Sphere args={[2.02, 128, 128]}>
        <meshBasicMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={0.12} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Selected Location Marker - Original version */}
      {markerPosition && (
        <group position={markerPosition}>
          <mesh>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}
