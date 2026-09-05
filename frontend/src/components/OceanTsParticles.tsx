import { useCallback, useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

interface OceanTsParticlesProps {
  className?: string;
  particleCount?: number;
}

export function OceanTsParticles({ className = "", particleCount = 80 }: OceanTsParticlesProps) {
  const initEngine = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 60,
      fullScreen: {
        enable: false,
      },
      particles: {
        number: {
          value: particleCount,
          density: {
            enable: true,
            width: 1000,
            height: 800,
          },
        },
        color: {
          value: ["#22D3EE", "#A78BFA"],
          animation: {
            enable: true,
            speed: 25,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.18, max: 0.82 },
          animation: {
            enable: true,
            speed: 1.0,
            sync: false,
            startValue: "random",
          },
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 1.5,
            sync: false,
            startValue: "random",
          },
        },
        links: {
          enable: true,
          distance: 120,
          color: "#22D3EE",
          opacity: 0.12,
          width: 0.8,
          triangles: {
            enable: false,
          },
        },
        move: {
          enable: true,
          speed: { min: 0.35, max: 0.85 },
          direction: "top",
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
        },
      },
      detectRetina: true,
    }),
    [particleCount]
  );

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <ParticlesProvider init={initEngine}>
        <Particles
          id="ocean-tsparticles"
          className="pointer-events-none h-full w-full"
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          options={options}
        />
      </ParticlesProvider>
    </div>
  );
}

