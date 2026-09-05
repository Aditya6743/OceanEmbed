import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { interpolateTemperature, type ProfilePoint } from "@/lib/ocean-data";

const NUM_SLICES = 32;
const COLUMN_HEIGHT = 4.8;
const BASE_RADIUS = 0.82;

// Temperature to Color mapper for ocean thermocline
function getTemperatureColor(temp: number) {
  // Surface warm (28°C): bright cyan-teal
  // Mid thermocline (15°C): deep ocean cyan-blue
  // Deep cold (2°C): deep midnight sapphire / abyssal indigo
  const normalized = Math.max(0, Math.min(1, (temp - 2) / 28));
  const hue = 0.58 + (1 - normalized) * 0.12;
  const saturation = 0.78 + normalized * 0.15;
  const lightness = 0.22 + normalized * 0.32;
  return new THREE.Color().setHSL(hue, saturation, lightness);
}

// Emissive glow proportional to temperature (warmer = brighter glow, colder = dimmer)
function getEmissiveIntensity(temp: number, isHovered: boolean) {
  const norm = Math.max(0, Math.min(1, (temp - 2) / 28));
  const base = 0.12 + Math.pow(norm, 1.2) * 0.55;
  return isHovered ? base + 0.35 : base;
}

// Marine snow drifting strictly INSIDE the 3D column, denser in deeper zones
function InternalMarineSnow({ hoveredDepth }: { hoveredDepth: number | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 380;

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution bounded inside the column radius
      const r = Math.sqrt(Math.random()) * (BASE_RADIUS * 0.75);
      const theta = Math.random() * Math.PI * 2;

      // Higher density in deeper zones (lower Y, using power distribution)
      // Y goes from -2.4 (2000m) to +2.4 (0m)
      const bias = Math.pow(Math.random(), 0.7); // bias towards lower values
      const y = 2.4 - bias * 4.8;

      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta);

      speeds[i] = 0.05 + Math.random() * 0.12;
    }

    return { positions, speeds };
  }, [count]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!posAttr) return;

    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const currentY = array[idx + 1] ?? 0;
      const speed = speeds[i] ?? 0.08;
      let nextY = currentY - speed * delta;

      // Wrap around
      if (nextY < -2.4) {
        nextY = 2.4;
      }
      array[idx + 1] = nextY;

      // Gentle internal eddy swirl
      const curX = array[idx] ?? 0;
      const curZ = array[idx + 2] ?? 0;
      const swirl = Math.sin(nextY * 1.5 + i) * 0.0008;
      array[idx] = curX + swirl;
      array[idx + 2] = curZ + Math.cos(nextY * 1.5 + i) * 0.0008;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.034}
        color={hoveredDepth !== null ? "#cffafe" : "#a5f3fc"}
        transparent
        opacity={0.62}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Volumetric internal fog/haze that thickens and darkens with depth
function InternalDepthHaze() {
  const hazeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.NormalBlending,
        vertexShader: `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPosition;
          void main() {
            // vPosition.y ranges from -2.4 to +2.4
            float depthFactor = clamp((2.4 - vPosition.y) / 4.8, 0.0, 1.0);
            // Surface is subtle cyan haze; deep is dark navy-black absorption
            vec3 topHaze = vec3(0.12, 0.55, 0.75);
            vec3 bottomHaze = vec3(0.01, 0.04, 0.12);
            vec3 hazeColor = mix(topHaze, bottomHaze, depthFactor);
            float alpha = mix(0.08, 0.42, pow(depthFactor, 1.4));
            gl_FragColor = vec4(hazeColor, alpha);
          }
        `,
      }),
    []
  );

  return (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[BASE_RADIUS * 0.65, BASE_RADIUS * 0.5, COLUMN_HEIGHT * 0.98, 32, 1, true]} />
      <primitive object={hazeMaterial} attach="material" />
    </mesh>
  );
}

// Outer volumetric water tube rim-light / luminous meniscus
function WaterColumnRimLight() {
  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
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
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(-vPosition);
            float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
            float intensity = pow(rim, 2.8);
            vec3 rimColor = mix(vec3(0.06, 0.45, 0.85), vec3(0.35, 0.94, 1.0), intensity);
            gl_FragColor = vec4(rimColor, intensity * 0.52);
          }
        `,
      }),
    []
  );

  return (
    <mesh position={[0, 0, 0]} scale={[1.035, 1.0, 1.035]}>
      <cylinderGeometry args={[BASE_RADIUS * 1.02, BASE_RADIUS * 0.95, COLUMN_HEIGHT, 48, 1, true]} />
      <primitive object={rimMaterial} attach="material" />
    </mesh>
  );
}

// 3D Ambient Organism: Translucent Bioluminescent Jellyfish
function AmbientJellyfish({
  initialPosition,
  scale = 1,
  color = "#22d3ee",
}: {
  initialPosition: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime * 0.8 + initialPosition[0];

    const pulse = Math.sin(t * 2.2);
    groupRef.current.position.y = initialPosition[1] + Math.sin(t * 0.6) * 0.22;
    groupRef.current.position.x = initialPosition[0] + Math.cos(t * 0.4) * 0.28;
    groupRef.current.position.z = initialPosition[2] + Math.sin(t * 0.35) * 0.28;

    groupRef.current.scale.y = scale * (1 + pulse * 0.16);
    groupRef.current.scale.x = scale * (1 - pulse * 0.08);
    groupRef.current.scale.z = scale * (1 - pulse * 0.08);

    groupRef.current.rotation.y = t * 0.12;
  });

  return (
    <group ref={groupRef} position={initialPosition}>
      <mesh position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.15, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.42}
          roughness={0.12}
          transmission={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.145, 0.007, 10, 28]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.65} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.09, -0.14, Math.sin(angle) * 0.09]}>
            <cylinderGeometry args={[0.0025, 0.001, 0.28, 6]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.35} />
          </mesh>
        );
      })}
      <pointLight color={color} intensity={0.7} distance={0.6} />
    </group>
  );
}

interface ColumnProps {
  profile: ProfilePoint[];
  hoveredDepth: number | null;
  onHoverDepth: (depth: number | null) => void;
}

function Column({ profile, hoveredDepth, onHoverDepth }: ColumnProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, rawDelta) => {
    if (group.current) {
      group.current.rotation.y += Math.min(rawDelta, 0.05) * 0.08;
    }
  });

  // Generate 32 continuous thin depth slices for a smooth thermal gradient
  const slices = useMemo(() => {
    const result = [];
    const sliceHeight = (COLUMN_HEIGHT / NUM_SLICES) * 1.02; // slight overlap avoids hairline gaps

    for (let i = 0; i < NUM_SLICES; i++) {
      const depth = (i / (NUM_SLICES - 1)) * 2000;
      const nextDepth = ((i + 1) / (NUM_SLICES - 1)) * 2000;
      const temp = interpolateTemperature(profile, depth);
      const y = 2.4 - (i / (NUM_SLICES - 1)) * 4.8;
      const radiusTop = BASE_RADIUS * (0.86 + (temp / 30) * 0.28);
      const tempNext = interpolateTemperature(profile, Math.min(2000, nextDepth));
      const radiusBottom = BASE_RADIUS * (0.86 + (tempNext / 30) * 0.28);

      result.push({
        index: i,
        depth,
        temp,
        y: y - sliceHeight / 2,
        radiusTop,
        radiusBottom,
        sliceHeight,
        color: getTemperatureColor(temp),
      });
    }
    return result;
  }, [profile]);

  return (
    <group ref={group} rotation={[0.08, 0, -0.05]}>
      {/* 30+ Continuous Depth Slices with Temperature-Proportional Emissive Glow */}
      {slices.map((slice) => {
        const isHovered = hoveredDepth !== null && Math.abs(hoveredDepth - slice.depth) < 60;
        const emissiveIntensity = getEmissiveIntensity(slice.temp, isHovered);

        return (
          <mesh
            key={slice.index}
            position={[0, slice.y, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverDepth(Math.round(slice.depth));
            }}
            onPointerOut={() => {
              onHoverDepth(null);
            }}
          >
            <cylinderGeometry
              args={[slice.radiusTop, slice.radiusBottom, slice.sliceHeight, 48, 1, true]}
            />
            <meshPhysicalMaterial
              color={slice.color}
              emissive={slice.color}
              emissiveIntensity={emissiveIntensity}
              transparent
              opacity={0.68}
              roughness={0.14}
              metalness={0.06}
              transmission={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* Internal Volumetric Fog / Deep Haze Absorption */}
      <InternalDepthHaze />

      {/* Outer Luminous Water Tube Rim-Light Meniscus */}
      <WaterColumnRimLight />

      {/* Discrete Key Profile Depth Rings & HTML Tooltips */}
      {profile.map((point) => {
        const y = 2.4 - (point.depth / 2000) * 4.8;
        const isHovered = hoveredDepth === point.depth || (hoveredDepth !== null && Math.abs(hoveredDepth - point.depth) < 35);
        const ringRadius = BASE_RADIUS * (1.18 + (point.temp / 30) * 0.1);

        return (
          <group key={`point-marker-${point.depth}`} position={[0, y, 0]}>
            {/* Interactive Strata Ring */}
            <mesh
              rotation-x={Math.PI / 2}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHoverDepth(point.depth);
              }}
              onPointerOut={() => {
                onHoverDepth(null);
              }}
              scale={isHovered ? 1.15 : 1}
            >
              <torusGeometry args={[ringRadius, isHovered ? 0.016 : 0.007, 10, 64]} />
              <meshBasicMaterial
                color={isHovered ? "#38bdf8" : "#67e8f9"}
                transparent
                opacity={isHovered ? 0.95 : 0.45}
              />
            </mesh>

            {/* Glowing Depth Callout on Hover */}
            {isHovered && (
              <Html position={[ringRadius + 0.35, 0, 0]} center distanceFactor={8}>
                <div className="pointer-events-none flex flex-col gap-0.5 rounded-sm border border-cyan-400/50 bg-slate-950/90 px-2.5 py-1 text-[10px] font-mono text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.4)] backdrop-blur-md whitespace-nowrap">
                  <span className="font-semibold text-white">{point.depth}m Depth</span>
                  <span className="text-cyan-400 font-medium">{point.temp.toFixed(2)}°C</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Drifting Marine Snow INSIDE the Column */}
      <InternalMarineSnow hoveredDepth={hoveredDepth} />

      {/* Ambient 3D Creatures in the Column Volume */}
      <AmbientJellyfish initialPosition={[1.05, 1.35, 0.35]} scale={0.9} color="#22d3ee" />
      <AmbientJellyfish initialPosition={[-1.12, -0.45, 0.25]} scale={0.72} color="#38bdf8" />
    </group>
  );
}

export function WaterColumn({ profile }: { profile: ProfilePoint[] }) {
  const [hoveredDepth, setHoveredDepth] = useState<number | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const lastInteractionTime = useRef<number>(performance.now());
  const isInteracting = useRef<boolean>(false);

  const handleInteractionStart = () => {
    isInteracting.current = true;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  };

  const handleInteractionEnd = () => {
    isInteracting.current = false;
    lastInteractionTime.current = performance.now();
  };

  return (
    <div className="relative h-full w-full">
      {/* Selected Depth Header Indicator */}
      <div className="pointer-events-none absolute right-3 top-3 z-10 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80 bg-background/65 px-2.5 py-1 rounded border border-primary/20 backdrop-blur-md shadow-sm">
        {hoveredDepth !== null ? (
          <span className="text-primary font-medium">Selected Stratum: {hoveredDepth}m</span>
        ) : (
          <span>Interactive 3D Column · 32 Thermal Layers</span>
        )}
      </div>

      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [3.8, 0.8, 6.8], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} color="#7dd3fc" />
        <directionalLight position={[4, 6, 4]} intensity={2.8} color="#e0f2fe" />
        <directionalLight position={[-4, -3, -2]} intensity={0.8} color="#0284c7" />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#38bdf8" distance={6} />

        <Column
          profile={profile}
          hoveredDepth={hoveredDepth}
          onHoverDepth={setHoveredDepth}
        />

        <IdleAutoRotate
          controlsRef={controlsRef}
          isInteracting={isInteracting}
          lastInteractionTime={lastInteractionTime}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.045}
          onStart={handleInteractionStart}
          onEnd={handleInteractionEnd}
        />
      </Canvas>
    </div>
  );
}

// Controller to resume auto-rotation after 2.5s of inactivity
function IdleAutoRotate({
  controlsRef,
  isInteracting,
  lastInteractionTime,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  isInteracting: React.RefObject<boolean>;
  lastInteractionTime: React.RefObject<number>;
}) {
  useFrame(() => {
    if (!controlsRef.current || isInteracting.current) return;
    const elapsed = performance.now() - lastInteractionTime.current;
    if (elapsed > 2500) {
      controlsRef.current.autoRotate = true;
    }
  });

  return null;
}