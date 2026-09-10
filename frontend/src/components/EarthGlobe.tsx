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

const gridFragmentShader = `
  varying vec3 vPosition;
  uniform float time;
  uniform float showHighlight;
  
  void main() {
    if (showHighlight < 0.5) discard;
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
      float pulse = (sin(time * 2.0) + 1.0) * 0.5 * 0.15 + 0.05;
      float edgeX = min(lon - 45.0, 105.0 - lon);
      float edgeY = min(lat - 5.0, 30.0 - lat);
      float edge = min(edgeX, edgeY);
      
      float intensity = 0.0;
      if (edge < 0.3) intensity = 0.5;
      else if (edge < 1.0) intensity = 0.5 * (1.0 - (edge - 0.3) / 0.7);
      
      float gridX = mod(lon, 5.0);
      float gridY = mod(lat, 5.0);
      if (gridX < 0.1 || gridY < 0.1) intensity = max(intensity, 0.15);
      
      gl_FragColor = vec4(0.13, 0.83, 0.93, max(pulse, intensity) * 0.4);
    } else discard;
  }
`;

const tchpFragmentShader = `
  varying vec3 vPosition;
  uniform float time;
  uniform float showTchp;
  
  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 4321.5453); }
  float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)),f.x),
                 mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)),f.x),
                 mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)),f.x),f.y),f.z);
  }

  void main() {
    if (showTchp < 0.1) discard;
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    // TCHP Heatmap active in North Indian Ocean
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
      float n = noise(p * 10.0 + time * 0.15);
      float n2 = noise(p * 20.0 - time * 0.1);
      float heat = smoothstep(0.4, 0.8, n * 0.6 + n2 * 0.4);
      
      vec3 hotColor = mix(vec3(1.0, 0.8, 0.0), vec3(1.0, 0.1, 0.0), heat * 1.5);
      if (heat > 0.05) {
          gl_FragColor = vec4(hotColor, heat * showTchp * 0.9);
      } else discard;
    } else discard;
  }
`;

export default function EarthGlobe({ alwaysShowGrid = false }: { alwaysShowGrid?: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const targetQuaternionRef = useRef<THREE.Quaternion | null>(null);
  const gridShaderRef = useRef<THREE.ShaderMaterial>(null);
  const tchpShaderRef = useRef<THREE.ShaderMaterial>(null);
  
  const selectedLocation = useOceanStore(state => state.selectedLocation);
  const setLocation = useOceanStore(state => state.setLocation);
  const error = useOceanStore(state => state.error);
  
  // We simulate toggles for the presentation (you can hook these to buttons later)
  const showTchp = true; // Simulating AI outputting high TCHP
  const showThermocline = true; // Simulating deep layer discovery
  
  const { gl } = useThree();
  
  const [colorMap, specularMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_normal.jpg'
  ]);

  useEffect(() => {
    if (colorMap && specularMap && normalMap) {
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      [colorMap, specularMap, normalMap].forEach(tex => {
        tex.anisotropy = maxAnisotropy;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      });
    }
  }, [colorMap, specularMap, normalMap, gl]);

  const showErrorBounds = error !== null && error.toLowerCase().includes("out of bounds");

  useFrame((state) => {
    if (globeRef.current && !selectedLocation && showErrorBounds) {
      if (targetQuaternionRef.current) globeRef.current.quaternion.slerp(targetQuaternionRef.current, 0.1);
    } else if (globeRef.current && !selectedLocation) {
      targetQuaternionRef.current = null;
      // Gentle auto-rotation
      globeRef.current.rotation.y += 0.0005;
    }

    if (gridShaderRef.current) {
      gridShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
      const target = (alwaysShowGrid || showErrorBounds) ? 1.0 : 0.0;
      gridShaderRef.current.uniforms.showHighlight.value += (target - gridShaderRef.current.uniforms.showHighlight.value) * 0.1;
    }
    
    if (tchpShaderRef.current) {
      tchpShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
      const targetTchp = showTchp ? 1.0 : 0.0;
      tchpShaderRef.current.uniforms.showTchp.value += (targetTchp - tchpShaderRef.current.uniforms.showTchp.value) * 0.05;
    }
  });

  const handleClick = (e: any) => {
    if (e.delta > 2) return;
    playSimplePing();
    e.stopPropagation();
    
    const point = globeRef.current!.worldToLocal(e.point.clone()).normalize();
    const lat = Math.asin(point.y) * (180 / Math.PI);
    const lon = Math.atan2(-point.z, point.x) * (180 / Math.PI);
    
    if (lat < 5 || lat > 30 || lon < 45 || lon > 105) {
      useOceanStore.getState().setError("Out of bounds", { x: e.clientX, y: e.clientY });
      targetQuaternionRef.current = new THREE.Quaternion().setFromEuler(new THREE.Euler(17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0));
      setTimeout(() => { targetQuaternionRef.current = null; }, 1500);
      return;
    }
    
    setLocation({
      latitude: Number(lat.toFixed(2)),
      longitude: Number(lon.toFixed(2)),
      date: new Date().toISOString().split('T')[0],
      region: "INDIAN OCEAN"
    });
  };

  const markerPosition = useMemo(() => {
    if (!selectedLocation) return null;
    const phi = selectedLocation.latitude * (Math.PI / 180);
    const theta = selectedLocation.longitude * (Math.PI / 180);
    return new THREE.Vector3(2.01 * Math.cos(phi) * Math.cos(theta), 2.01 * Math.sin(phi), 2.01 * Math.cos(phi) * -Math.sin(theta));
  }, [selectedLocation]);

  const gridUniforms = useMemo(() => ({ time: { value: 0 }, showHighlight: { value: 0 } }), []);
  const tchpUniforms = useMemo(() => ({ time: { value: 0 }, showTchp: { value: 0 } }), []);

  return (
    <group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#ffffff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
      
      {/* 1. Subsurface Thermocline Inner Core (Green/Cyan glowing layer under the surface) */}
      {showThermocline && (
        <Sphere args={[1.97, 64, 64]} raycast={() => null}>
          <meshPhongMaterial 
            color="#00ffcc" 
            emissive="#0088aa"
            transparent={true} 
            opacity={0.3} 
            blending={THREE.AdditiveBlending} 
          />
        </Sphere>
      )}

      {/* 2. Main Earth Surface */}
      <Sphere args={[2, 128, 128]} onClick={handleClick}>
        <meshPhongMaterial 
          map={colorMap}
          specularMap={specularMap} normalMap={normalMap} normalScale={new THREE.Vector2(0.5, 0.5)}
          specular={new THREE.Color('#0a5c7a')}
          shininess={15}
          transparent={showThermocline} // Make crust slightly transparent to see thermocline
          opacity={showThermocline ? 0.85 : 1.0}
        />
      </Sphere>
      
      {/* 3. TCHP Cyclone Heatmap Layer (Red/Orange Glow) */}
      <Sphere args={[2.008, 128, 128]} raycast={() => null}>
        <shaderMaterial
          ref={tchpShaderRef}
          vertexShader={vertexShader}
          fragmentShader={tchpFragmentShader}
          uniforms={tchpUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* 4. SIH Grid Boundaries */}
      <Sphere args={[2.005, 128, 128]} raycast={() => null}>
        <shaderMaterial ref={gridShaderRef} vertexShader={vertexShader} fragmentShader={gridFragmentShader} uniforms={gridUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
      </Sphere>

      {/* Selected Marker */}
      {markerPosition && (
        <group position={markerPosition}>
          <mesh><sphereGeometry args={[0.02, 16, 16]} /><meshBasicMaterial color="#0ea5e9" /></mesh>
          <mesh><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} /></mesh>
        </group>
      )}
    </group>
  );
}
