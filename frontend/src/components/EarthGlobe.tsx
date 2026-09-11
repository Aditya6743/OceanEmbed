import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Sphere, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useOceanStore } from '../store/oceanStore';
import type { LiveArgoMarker } from '../types/ocean';
import { fetchLiveArgoFleet, DEFAULT_LIVE_ARGO_FLOATS, getRelativeArgoTime } from '../data/liveArgoFleet';

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
function latLonToVector3(lat: number, lon: number, radius = 2.015): THREE.Vector3 {
  const phi = lat * (Math.PI / 180);
  const theta = lon * (Math.PI / 180);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * -Math.sin(theta)
  );
}
function formatArgoTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const day = d.getUTCDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = months[d.getUTCMonth()];
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    return `${day} ${mon} ${d.getUTCFullYear()} ${hours}:${mins} UTC`;
  } catch (e) {
    return isoString;
  }
}
interface ArgoBeaconProps {
  float: LiveArgoMarker;
  isSelected: boolean;
  onSelect: (f: LiveArgoMarker) => void;
}
function ArgoBeacon({ float, isSelected, onSelect }: ArgoBeaconProps) {
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => latLonToVector3(float.lat, float.lon, 2.016), [float.lat, float.lon]);
  const formattedTime = useMemo(() => formatArgoTime(float.timestamp), [float.timestamp]);
  const relativeTime = useMemo(() => getRelativeArgoTime(float.timestamp), [float.timestamp]);
  return (
    <group position={pos}>
      {/* Invisible easy-click Hitbox */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(float);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        visible={false}
      >
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      <mesh raycast={() => null}>
        <sphereGeometry args={[isSelected ? 0.009 : 0.005, 12, 12]} />
        <meshBasicMaterial color={isSelected ? "#a3e635" : "#4ade80"} />
      </mesh>
      <mesh raycast={() => null}>
        <sphereGeometry args={[isSelected ? 0.016 : (hovered ? 0.013 : 0.008), 12, 12]} />
        <meshBasicMaterial 
          color="#a3e635" 
          transparent 
          opacity={isSelected ? 0.6 : (hovered ? 0.45 : 0.25)} 
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html position={[0, 0.05, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-black/95 border border-lime-500/50 p-2 rounded-md backdrop-blur-md shadow-[0_0_20px_rgba(163,230,53,0.3)] w-max max-w-[200px] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 mb-1 border-b border-white/10 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_#a3e635]"></span>
                <span className="text-[9px] font-mono tracking-wider text-lime-400 font-black">
                  ARGO #{float.id}
                </span>
              </div>
              {float.cycleNumber && (
                <span className="text-[7px] font-mono text-white/50 bg-white/10 px-1 py-0.2 rounded shrink-0">
                  CYC {float.cycleNumber}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5 text-[7.5px] font-mono">
              <div className="flex justify-between gap-2">
                <span className="text-white/40">TELEMETRY:</span>
                <span className="text-cyan-300 font-bold truncate">{relativeTime}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-white/40">TIME:</span>
                <span className="text-white/80 font-bold truncate">{formattedTime}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-white/40">LAT / LON:</span>
                <span className="text-white font-bold">{float.lat.toFixed(2)}°N, {float.lon.toFixed(2)}°E</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-white/40">STATUS:</span>
                <span className="text-emerald-400 font-bold">TRANSMITTING</span>
              </div>
            </div>
            <div className="mt-1 pt-1 border-t border-white/10 text-[6.5px] font-mono text-lime-400/90 text-center font-bold tracking-wider uppercase">
              CLICK TO LOCK & INFER
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
export default function EarthGlobe({ alwaysShowGrid = false, showStars = true }: { alwaysShowGrid?: boolean, showStars?: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const targetQuaternionRef = useRef<THREE.Quaternion | null>(null);
  const gridShaderRef = useRef<THREE.ShaderMaterial>(null);
  const landMaskRef = useRef<{ data: Uint8ClampedArray; width: number; height: number } | null>(null);
  
  const [argoFloats, setArgoFloats] = useState<LiveArgoMarker[]>(DEFAULT_LIVE_ARGO_FLOATS);
  
  const selectedLocation = useOceanStore(state => state.selectedLocation);
  const setLocation = useOceanStore(state => state.setLocation);
  const showGlobeArgo = useOceanStore(state => state.showGlobeArgo);
  const selectedArgoMarker = useOceanStore(state => state.selectedArgoMarker);
  const setSelectedArgoMarker = useOceanStore(state => state.setSelectedArgoMarker);
  const error = useOceanStore(state => state.error);
  const { gl } = useThree();
  const [colorMap, specularMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_normal.jpg'
  ]);
  useEffect(() => {
    let mounted = true;
    fetchLiveArgoFleet().then(floats => {
      if (mounted && floats && floats.length > 0) {
        setArgoFloats(floats);
      }
    });
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    if (colorMap && specularMap && normalMap) {
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      [colorMap, specularMap, normalMap].forEach(tex => {
        tex.anisotropy = maxAnisotropy;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      });
            try {
        const img = specularMap.image;
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          landMaskRef.current = {
            data: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
            width: canvas.width,
            height: canvas.height
          };
        }
      } catch (e) {
        console.warn("Could not extract land mask data", e);
      }
    }
  }, [colorMap, specularMap, normalMap, gl]);

  const showErrorBounds = error !== null && error.toLowerCase().includes("out of bounds");

  useFrame((state) => {
    if (globeRef.current && !selectedLocation && showErrorBounds) {
      if (targetQuaternionRef.current) globeRef.current.quaternion.slerp(targetQuaternionRef.current, 0.1);
    } else if (globeRef.current && !selectedLocation) {
      targetQuaternionRef.current = null;
      globeRef.current.rotation.y += 0.0005;
    }

    if (gridShaderRef.current) {
      gridShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
      const target = (alwaysShowGrid || showErrorBounds) ? 1.0 : 0.0;
      gridShaderRef.current.uniforms.showHighlight.value += (target - gridShaderRef.current.uniforms.showHighlight.value) * 0.1;
    }
  });

  const handleSelectArgo = (float: LiveArgoMarker) => {
    playSimplePing();
    setSelectedArgoMarker(float);
        const dateStr = float.timestamp ? float.timestamp.split('T')[0] : '2026-05-01';
    setLocation({
      latitude: Number(float.lat.toFixed(4)),
      longitude: Number(float.lon.toFixed(4)),
      date: dateStr,
      region: `INDIAN OCEAN (ARGO #${float.id})`
    });
  };

  const handleClick = (e: any) => {
    if (e.delta > 2) return;
    e.stopPropagation();
    playSimplePing();
    setSelectedArgoMarker(null);
    
    // 1. Calculate Latitude and Longitude first
    const point = globeRef.current!.worldToLocal(e.point.clone()).normalize();
    const lat = Math.asin(point.y) * (180 / Math.PI);
    const lon = Math.atan2(-point.z, point.x) * (180 / Math.PI);
    
    // 2. Out of Bounds Check (Takes priority)
    if (lat < 5 || lat > 30 || lon < 45 || lon > 105) {
      useOceanStore.getState().setError("OUT OF BOUNDS", { x: e.clientX, y: e.clientY });
      targetQuaternionRef.current = new THREE.Quaternion().setFromEuler(new THREE.Euler(17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0));
      setTimeout(() => { targetQuaternionRef.current = null; }, 1500);
      return;
    }

    // 3. Exact Pixel Collision Detection for Landmass (Only inside the grid)
    if (e.uv && landMaskRef.current) {
      const { data, width, height } = landMaskRef.current;
      const x = Math.floor(e.uv.x * width);
      const y = Math.floor((1.0 - e.uv.y) * height);
      const idx = (y * width + x) * 4;
      const brightness = data[idx];
      
      if (brightness < 30) {
        useOceanStore.getState().setError("LANDMASS DETECTED", { x: e.clientX, y: e.clientY });
        return;
      }
    }
    
    setLocation({
      latitude: Number(lat.toFixed(2)),
      longitude: Number(lon.toFixed(2)),
      date: useOceanStore.getState().selectedDate || '2026-05-01',
      region: "INDIAN OCEAN"
    });
  };

  const markerPosition = useMemo(() => {
    if (!selectedLocation) return null;
    return latLonToVector3(selectedLocation.latitude, selectedLocation.longitude, 2.015);
  }, [selectedLocation]);

  const gridUniforms = useMemo(() => ({ time: { value: 0 }, showHighlight: { value: 0 } }), []);

  return (
    <group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#ffffff" />
      
      {showStars && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />}
      
      {/* Main Earth Surface (Clean, No Heatmaps) */}
      <Sphere 
        args={[2, 128, 128]} 
        onClick={handleClick}
        onPointerEnter={() => document.body.style.cursor = 'crosshair'}
        onPointerLeave={() => document.body.style.cursor = 'auto'}
      >
        <meshPhongMaterial 
          map={colorMap}
          specularMap={specularMap} normalMap={normalMap} normalScale={new THREE.Vector2(0.5, 0.5)}
          specular={new THREE.Color('#0a5c7a')}
          shininess={15}
        />
      </Sphere>

      {/* SIH Grid Boundaries */}
      <Sphere args={[2.005, 128, 128]} raycast={() => null}>
        <shaderMaterial ref={gridShaderRef} vertexShader={vertexShader} fragmentShader={gridFragmentShader} uniforms={gridUniforms} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
      </Sphere>

      {/* Live ARGO Float Fleet Markers */}
      {showGlobeArgo && argoFloats.map((float) => (
        <ArgoBeacon
          key={float.id}
          float={float}
          isSelected={selectedArgoMarker?.id === float.id}
          onSelect={handleSelectArgo}
        />
      ))}
      {markerPosition && (
        <group position={markerPosition}>
          <mesh><sphereGeometry args={[0.02, 16, 16]} /><meshBasicMaterial color="#0ea5e9" /></mesh>
          <mesh><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} /></mesh>
        </group>
      )}
    </group>
  );
}

