import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const INDIAN_OCEAN = { latitude: -20, longitude: 80 };
const GLOBE_RADIUS = 1.72;

function pointFromCoordinates(latitude: number, longitude: number, radius: number) {
  const latitudeRadians = THREE.MathUtils.degToRad(latitude);
  const longitudeRadians = THREE.MathUtils.degToRad(longitude);
  return new THREE.Vector3(
    radius * Math.cos(latitudeRadians) * Math.cos(longitudeRadians),
    radius * Math.sin(latitudeRadians),
    -radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians)
  );
}

// Custom Fresnel atmosphere rim shader with cyan-to-violet color cycling
function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vPosition = mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(-vPosition);
            float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
            float intensity = pow(rim, 3.2);

            // Cycle between cyan (#22d3ee) and soft violet (#a855f7)
            float cycle = 0.5 + 0.5 * sin(uTime * 0.4);
            vec3 colorCyan = vec3(0.14, 0.84, 0.98);
            vec3 colorViolet = vec3(0.68, 0.35, 0.98);
            vec3 targetGlow = mix(colorCyan, colorViolet, cycle);

            vec3 glow = mix(vec3(0.04, 0.22, 0.65), targetGlow, intensity);
            gl_FragColor = vec4(glow, intensity * 0.82);
          }
        `,
      }),
    [uniforms]
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh scale={1.12}>
      <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// Inner subtle rim glow (front side) with cyan-to-violet shift
function InnerAtmosphereGlow() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vPosition = mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(-vPosition);
            float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
            float intensity = pow(rim, 4.0);
            float cycle = 0.5 + 0.5 * sin(uTime * 0.4);
            vec3 glow = mix(vec3(0.14, 0.82, 0.98), vec3(0.68, 0.35, 0.98), cycle);
            gl_FragColor = vec4(glow, intensity * 0.42);
          }
        `,
      }),
    [uniforms]
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh scale={1.018}>
      <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// Primary subtle halo ring with cyan-to-violet gradient sheen
function PrimaryOrbitRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.elapsedTime * 0.04;
      meshRef.current.rotation.y = clock.elapsedTime * 0.015;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2.35, 0.1, 0]}>
      <torusGeometry args={[GLOBE_RADIUS * 1.38, 0.003, 16, 120]} />
      <meshBasicMaterial color="#818cf8" transparent opacity={0.2} />
    </mesh>
  );
}

// Secondary slow-rotating orbital ring with glowing satellite-like dots
function SatelliteOrbitSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const satellite1Ref = useRef<THREE.Group>(null);
  const satellite2Ref = useRef<THREE.Group>(null);
  const orbitRadius = GLOBE_RADIUS * 1.55;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.02;
    }

    if (satellite1Ref.current) {
      const angle1 = t * 0.28;
      satellite1Ref.current.position.set(
        Math.cos(angle1) * orbitRadius,
        Math.sin(angle1) * orbitRadius,
        0
      );
    }

    if (satellite2Ref.current) {
      const angle2 = t * 0.28 + Math.PI * 1.1;
      satellite2Ref.current.position.set(
        Math.cos(angle2) * orbitRadius,
        Math.sin(angle2) * orbitRadius,
        0
      );
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 3.4, 0.45, 0.2]}>
      <mesh>
        <torusGeometry args={[orbitRadius, 0.002, 16, 140]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.22} />
      </mesh>

      {/* Satellite 1: Cyan Beacon */}
      <group ref={satellite1Ref}>
        <mesh>
          <boxGeometry args={[0.038, 0.022, 0.022]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.036, 0, 0]}>
          <boxGeometry args={[0.032, 0.016, 0.002]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[-0.036, 0, 0]}>
          <boxGeometry args={[0.032, 0.016, 0.002]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
        <pointLight color="#22d3ee" intensity={1.8} distance={0.6} />
      </group>

      {/* Satellite 2: Violet Beacon (Altimetry Node) */}
      <group ref={satellite2Ref}>
        <mesh>
          <boxGeometry args={[0.032, 0.026, 0.022]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.034, 0, 0]}>
          <boxGeometry args={[0.028, 0.014, 0.002]} />
          <meshBasicMaterial color="#7c3aed" />
        </mesh>
        <mesh position={[-0.034, 0, 0]}>
          <boxGeometry args={[0.028, 0.014, 0.002]} />
          <meshBasicMaterial color="#7c3aed" />
        </mesh>
        <mesh position={[0, 0.016, 0]}>
          <sphereGeometry args={[0.013, 12, 12]} />
          <meshBasicMaterial color="#c084fc" />
        </mesh>
        <pointLight color="#a855f7" intensity={2.0} distance={0.6} />
      </group>
    </group>
  );
}

// Multi-layer particle cloud surrounding the globe with cyan and violet bioluminescent specks
function GlobeParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const count = 380;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const c1 = new THREE.Color("#67e8f9"); // cyan
    const c2 = new THREE.Color("#38bdf8"); // sky
    const c3 = new THREE.Color("#c084fc"); // violet
    const c4 = new THREE.Color("#f472b6"); // soft pink

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.15 + Math.random() * 3.2;

      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const colorPick = Math.random();
      const color =
        colorPick < 0.38 ? c1 : colorPick < 0.65 ? c2 : colorPick < 0.88 ? c3 : c4;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = (0.015 + Math.random() * 0.032) * (window.devicePixelRatio || 1);
    }

    return { positions, colors, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.012;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.008) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.52}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Location Marker with 2-color cyan core + violet pulse ring
function LocationMarker({ onSelect }: { onSelect: () => void }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const position = useMemo(
    () => pointFromCoordinates(INDIAN_OCEAN.latitude, INDIAN_OCEAN.longitude, GLOBE_RADIUS + 0.045),
    []
  );
  const orientation = useMemo(() => {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize());
    return quaternion;
  }, [position]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    pulseRef.current.scale.setScalar(1 + (Math.sin(clock.elapsedTime * 2.6) + 1) * 0.34);
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <group position={position} quaternion={orientation}>
      <mesh
        position={[0, 0.105, 0]}
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        scale={hovered ? 1.25 : 1}
      >
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} />
      </mesh>
      {/* 2-Color Cyan to Violet Pulsing Ring */}
      <mesh ref={pulseRef} rotation-x={-Math.PI / 2} position={[0, 0.018, 0]}>
        <ringGeometry args={[0.09, 0.145, 48]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#a855f7" intensity={hovered ? 4.8 : 3.2} distance={1.4} />
      <pointLight color="#22d3ee" intensity={hovered ? 3.0 : 1.8} distance={0.9} />
    </group>
  );
}

function GlobeScene({ diving, onSelect }: { diving: boolean; onSelect: () => void }) {
  const globeRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const textures = useTexture([
    "/textures/earth-day.jpg",
    "/textures/earth-clouds.png",
    "/textures/earth-night.png",
  ]);
  const day = textures[0]!;
  const clouds = textures[1]!;
  const night = textures[2]!;
  day.colorSpace = THREE.SRGBColorSpace;
  night.colorSpace = THREE.SRGBColorSpace;
  day.anisotropy = 8;

  // Google Earth cinematic fly-to state tracking
  const diveStartTime = useRef<number | null>(null);
  const startQuat = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const targetQuat = useMemo(() => {
    const localTarget = pointFromCoordinates(INDIAN_OCEAN.latitude, INDIAN_OCEAN.longitude, 1).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(localTarget, new THREE.Vector3(0, 0, 1));
    return q;
  }, []);

  useFrame(({ camera, clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (!diving) {
      if (globeRef.current) globeRef.current.rotation.y += delta * 0.045;
      if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.018;
      diveStartTime.current = null;
      return;
    }

    if (diveStartTime.current === null) {
      diveStartTime.current = clock.elapsedTime;
      if (globeRef.current) {
        startQuat.current.copy(globeRef.current.quaternion);
      }
    }

    const elapsed = clock.elapsedTime - diveStartTime.current;

    // Phase 1: Smooth globe rotation centering the target point (0.0s to 1.1s)
    const rotProgress = Math.min(1, Math.max(0, elapsed / 1.1));
    const easeRot =
      rotProgress < 0.5
        ? 4 * rotProgress * rotProgress * rotProgress
        : 1 - Math.pow(-2 * rotProgress + 2, 3) / 2;

    if (globeRef.current) {
      globeRef.current.quaternion.slerpQuaternions(startQuat.current, targetQuat, easeRot);
    }

    // Phase 2: Altitude Descent Zoom-in (0.8s to 2.4s)
    const zoomProgress = Math.min(1, Math.max(0, (elapsed - 0.8) / 1.5));
    const easeZoom = Math.pow(zoomProgress, 2.2);

    const targetZ = THREE.MathUtils.lerp(5.35, 1.96, easeZoom);
    camera.position.set(0, THREE.MathUtils.lerp(0.05, 0, easeZoom), targetZ);
    camera.lookAt(0, 0, GLOBE_RADIUS * 0.95);

    if (cloudRef.current) {
      cloudRef.current.scale.setScalar(THREE.MathUtils.lerp(1.007, 1.05, easeZoom));
    }
  });

  return (
    <>
      <hemisphereLight args={["#96dff1", "#08041c", 0.52]} />
      <directionalLight position={[-5, 3.5, 5]} intensity={3.4} color="#f4fbff" />
      <directionalLight position={[4, -2, -3]} intensity={0.6} color="#7c3aed" />

      <GlobeParticleField />

      <group ref={globeRef} rotation={[0.04, Math.PI, -0.08]}>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
          <meshPhongMaterial
            map={day}
            emissiveMap={night}
            emissive="#7dc8e8"
            emissiveIntensity={0.28}
            shininess={22}
            specular="#87b8ca"
          />
        </mesh>
        <mesh ref={cloudRef} scale={1.007}>
          <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
          <meshPhongMaterial
            map={clouds}
            transparent
            opacity={0.44}
            depthWrite={false}
            alphaTest={0.03}
          />
        </mesh>
        <InnerAtmosphereGlow />
        <Atmosphere />
        <PrimaryOrbitRing />
        <SatelliteOrbitSystem />
        <LocationMarker onSelect={onSelect} />
      </group>

      <OrbitControls
        enabled={!diving}
        enablePan={false}
        enableZoom={false}
        enableDamping={true}
        dampingFactor={0.048}
        rotateSpeed={0.42}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.82}
      />
    </>
  );
}

export function OceanGlobe({ diving, onSelect }: { diving: boolean; onSelect: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.05, 5.35], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="touch-none"
    >
      <Suspense fallback={null}>
        <GlobeScene diving={diving} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
