import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// TCHP Cyclone Risk Shader (Red/Orange)
const tchpFragmentShader = `
  varying vec3 vPosition;
  uniform float time;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 4321.5453); }
  float noise(vec3 x) {
      vec3 p = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)),f.x), mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)),f.x),f.y), mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)),f.x), mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)),f.x),f.y),f.z);
  }
  void main() {
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
      float n = noise(p * 10.0 + time * 0.15);
      float n2 = noise(p * 20.0 - time * 0.1);
      float heat = smoothstep(0.4, 0.8, n * 0.6 + n2 * 0.4);
      vec3 hotColor = mix(vec3(1.0, 0.8, 0.0), vec3(1.0, 0.1, 0.0), heat * 1.5);
      if (heat > 0.05) gl_FragColor = vec4(hotColor, heat * 0.9); else discard;
    } else discard;
  }
`;

// Fishery Upwelling Shader (Green/Blue/Yellow pockets)
const fisheryFragmentShader = `
  varying vec3 vPosition;
  uniform float time;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(43.232, 12.123, 89.432))) * 1234.5453); }
  float noise(vec3 x) {
      vec3 p = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)),f.x), mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)),f.x),f.y), mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)),f.x), mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)),f.x),f.y),f.z);
  }
  void main() {
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
      float n = noise(p * 15.0 - time * 0.05);
      float plankton = smoothstep(0.5, 0.7, n);
      vec3 fishColor = mix(vec3(0.0, 0.5, 0.8), vec3(0.2, 1.0, 0.5), plankton);
      if (plankton > 0.02) gl_FragColor = vec4(fishColor, plankton * 0.8); else discard;
    } else discard;
  }
`;

// Naval Acoustic Shader (Cyan contour maps indicating thermocline gradients)
const navyFragmentShader = `
  varying vec3 vPosition;
  uniform float time;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 4321.5453); }
  float noise(vec3 x) {
      vec3 p = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)),f.x), mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)),f.x),f.y), mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)),f.x), mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)),f.x),f.y),f.z);
  }
  void main() {
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
      float n = noise(p * 30.0 + time * 0.1);
      // Sharp contour lines for sonar anomalies
      float contour = smoothstep(0.9, 0.95, fract(n * 6.0));
      float baseGlow = smoothstep(0.6, 0.9, n);
      
      vec3 navyColor = vec3(0.0, 0.8, 1.0); // High-tech Cyan
      float alpha = contour * 0.8 + baseGlow * 0.3;
      
      if (alpha > 0.1) gl_FragColor = vec4(navyColor, alpha); else discard;
    } else discard;
  }
`;

export default function MosdacGlobe({ viewMode = 'climate' }: { viewMode?: 'navy' | 'fishery' | 'climate' }) {
  const globeRef = useRef<THREE.Group>(null);
  const tchpShaderRef = useRef<THREE.ShaderMaterial>(null);
  const fisheryShaderRef = useRef<THREE.ShaderMaterial>(null);
  const navyShaderRef = useRef<THREE.ShaderMaterial>(null);
  
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
  });

  const sharedUniforms = useMemo(() => ({ time: { value: 0 } }), []);

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
    </group>
  );
}
