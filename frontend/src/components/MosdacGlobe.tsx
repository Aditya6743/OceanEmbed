import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import type { LiveArgoMarker } from '../types/ocean';
import { fetchLiveArgoFleet, getRelativeArgoTime } from '../data/liveArgoFleet';
import { useOceanStore } from '../store/oceanStore';
import { Html } from '@react-three/drei';

const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const BASE_URL = env?.VITE_API_URL || 'http://localhost:8000/api/v1';


import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// TCHP Cyclone Risk Shader (Red/Orange)
const tchpFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D tchpMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        vec4 mlData = texture2D(tchpMap, vec2(mlX, 1.0 - mlY));
        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (intensity < 0.05) discard;
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

// Fishery Upwelling Shader (Green/Blue/Yellow pockets)
const fisheryFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D fisheryMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        vec4 mlData = texture2D(fisheryMap, vec2(mlX, 1.0 - mlY));
        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (intensity < 0.05) discard;
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

// Naval Acoustic Shader (Cyan contour maps indicating thermocline gradients)
const navyFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D navyMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        vec4 mlData = texture2D(navyMap, vec2(mlX, 1.0 - mlY));
        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (intensity < 0.05) discard;
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

// Benthic Cable Threat Shader (Purple pulsing grid lines)
const cableFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D benthicMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        vec4 mlData = texture2D(benthicMap, vec2(mlX, 1.0 - mlY));
        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (intensity < 0.05) discard;
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

// IOD Climate Predictor Shader (Red/Blue dipole zones)
const ensoFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D iodMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        vec4 mlData = texture2D(iodMap, vec2(mlX, 1.0 - mlY));
        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (intensity < 0.05) discard;
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;


function ArgoBeacon({ float, isSelected, onSelect }: { float: LiveArgoMarker, isSelected: boolean, onSelect: (f: LiveArgoMarker) => void }) {
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => {
    const phi = (90 - float.lat) * (Math.PI / 180);
    const theta = (float.lon + 180) * (Math.PI / 180);
    const radius = 2.016;
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, [float.lat, float.lon]);

  return (
    <group position={pos}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(float); }} onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }} visible={false}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial /></mesh>
      <mesh raycast={() => null}><sphereGeometry args={[isSelected ? 0.009 : 0.005, 12, 12]} /><meshBasicMaterial color={isSelected ? "#a3e635" : "#4ade80"} /></mesh>
      <mesh raycast={() => null}><sphereGeometry args={[isSelected ? 0.016 : (hovered ? 0.013 : 0.008), 12, 12]} /><meshBasicMaterial color="#a3e635" transparent opacity={isSelected ? 0.6 : (hovered ? 0.45 : 0.25)} /></mesh>
      {(hovered || isSelected) && (
        <Html position={[0, 0.05, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-black/90 border border-lime-500/50 p-2 rounded backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in duration-200">
            <div className="text-lime-400 text-[10px] font-bold tracking-wider mb-1">ARGO FLOAT #{float.id}</div>
            <div className="text-white/70 text-[9px] font-mono mb-1">{float.lat.toFixed(3)}°N, {float.lon.toFixed(3)}°E</div>
            <div className="text-cyan-400/80 text-[8px] uppercase tracking-widest">{getRelativeArgoTime(float.timestamp)}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function MosdacGlobe({ viewMode = 'climate' }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' }) {
  const { showGlobeArgo, selectedArgoMarker, setSelectedArgoMarker } = useOceanStore();
  const [argoFloats, setArgoFloats] = useState<LiveArgoMarker[]>([]);
  useEffect(() => {
    let mounted = true;
    fetchLiveArgoFleet().then(floats => { if (mounted && floats) setArgoFloats(floats); });
    return () => { mounted = false; };
  }, []);
  const globeRef = useRef<THREE.Group>(null);
  const tchpShaderRef = useRef<THREE.ShaderMaterial>(null);
  const fisheryShaderRef = useRef<THREE.ShaderMaterial>(null);
  const navyShaderRef = useRef<THREE.ShaderMaterial>(null);
  const cableShaderRef = useRef<THREE.ShaderMaterial>(null);
  const ensoShaderRef = useRef<THREE.ShaderMaterial>(null);

  
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
        tex.anisotropy = maxAnisotropy; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter; tex.needsUpdate = true;
      });
    }
  }, [colorMap, specularMap, normalMap, gl]);

  useFrame((state) => {
    if (globeRef.current) globeRef.current.rotation.y += 0.0005;
    if (tchpShaderRef.current) tchpShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (fisheryShaderRef.current) fisheryShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (navyShaderRef.current) navyShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = state.clock.elapsedTime;

  });

  // Safe texture loading to prevent crashes if backend is restarting
  const [tchpMap, setTchpMap] = useState<THREE.Texture | null>(null);
  const [fisheryMap, setFisheryMap] = useState<THREE.Texture | null>(null);
  const [navyMap, setNavyMap] = useState<THREE.Texture | null>(null);
  const [benthicMap, setBenthicMap] = useState<THREE.Texture | null>(null);
  const [iodMap, setIodMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(`${BASE_URL}/spatial/heatmap/tchp`, setTchpMap, undefined, () => console.warn('Failed to load tchp'));
    loader.load(`${BASE_URL}/spatial/heatmap/fishery`, setFisheryMap);
    loader.load(`${BASE_URL}/spatial/heatmap/navy`, setNavyMap);
    loader.load(`${BASE_URL}/spatial/heatmap/benthic`, setBenthicMap);
    loader.load(`${BASE_URL}/spatial/heatmap/iod`, setIodMap);
  }, []);
  const sharedUniforms = useMemo(() => ({ 
    time: { value: 0 }, 
    earthMap: { value: specularMap },
    tchpMap: { value: tchpMap },
    fisheryMap: { value: fisheryMap },
    navyMap: { value: navyMap },
    benthicMap: { value: benthicMap },
    iodMap: { value: iodMap }
  }), [specularMap, tchpMap, fisheryMap, navyMap, benthicMap, iodMap]);

  return (
    <group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#ffffff" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
      
      {/* Main Earth Surface (Always Opaque, no depth buffer fighting) */}
      <Sphere args={[2, 128, 128]} raycast={() => null}>
        <meshPhongMaterial 
          map={colorMap} specularMap={specularMap} normalMap={normalMap} normalScale={new THREE.Vector2(0.5, 0.5)}
          specular={new THREE.Color('#0a5c7a')} shininess={15}
        />
      </Sphere>
      
      {/* Dynamic Overlays at slightly larger radius */}
      {viewMode === 'climate' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={tchpShaderRef} vertexShader={vertexShader} fragmentShader={tchpFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      {viewMode === 'fishery' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={fisheryShaderRef} vertexShader={vertexShader} fragmentShader={fisheryFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      {viewMode === 'navy' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={navyShaderRef} vertexShader={vertexShader} fragmentShader={navyFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      {viewMode === 'cable' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={cableShaderRef} vertexShader={vertexShader} fragmentShader={cableFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'enso' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={ensoShaderRef} vertexShader={vertexShader} fragmentShader={ensoFragmentShader} uniforms={sharedUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      {showGlobeArgo && argoFloats.map((float) => (
        <ArgoBeacon key={float.id} float={float} isSelected={selectedArgoMarker?.id === float.id} onSelect={(f) => setSelectedArgoMarker(f)} />
      ))}
    </group>
  );
}