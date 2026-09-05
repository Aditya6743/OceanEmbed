import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AmbientMarineBackground } from "../components/AmbientMarineBackground";
import { OceanButton } from "../components/OceanButton";
import { OceanGlobe } from "../components/OceanGlobe";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "OceanEmbed — Subsurface Ocean Intelligence" },
      {
        name: "description",
        content: "Explore reconstructed subsurface ocean temperature from satellite observations.",
      },
      { property: "og:title", content: "OceanEmbed — Subsurface Ocean Intelligence" },
      {
        property: "og:description",
        content: "Explore reconstructed subsurface ocean temperature from satellite observations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [diving, setDiving] = useState(false);
  const [enteringAtmosphere, setEnteringAtmosphere] = useState(false);
  const [transitioned, setTransitioned] = useState(false);

  useEffect(() => {
    if (!diving) return;

    // Atmospheric entry starts at 1.7s during the high-speed descent
    const atmosphereTimer = window.setTimeout(() => {
      setEnteringAtmosphere(true);
    }, 1650);

    // Full 2.45s sequence completes before dissolving to dashboard
    const transitionTimer = window.setTimeout(() => {
      setTransitioned(true);
      window.setTimeout(() => void navigate({ to: "/dashboard" }), 450);
    }, 2450);

    return () => {
      window.clearTimeout(atmosphereTimer);
      window.clearTimeout(transitionTimer);
    };
  }, [diving, navigate]);

  const explore = () => {
    if (!diving) setDiving(true);
  };

  return (
    <main className="ocean-stage relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <div className="ocean-grid absolute inset-0" aria-hidden="true" />
      <AmbientMarineBackground />
      <div className="ocean-vignette absolute inset-0" aria-hidden="true" />

      {/* Atmospheric Entry Effect: subtle cloud wisps & light streaks during final descent */}
      <div
        className={`pointer-events-none absolute inset-0 z-25 flex items-center justify-center transition-opacity duration-700 ${
          enteringAtmosphere ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,242,254,0.45)_0%,rgba(34,211,238,0.2)_40%,transparent_75%)] backdrop-blur-[2px]" />
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent scale-y-150 animate-pulse" />
      </div>

      <header
        className={`absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 transition-opacity duration-700 sm:px-8 sm:py-7 ${
          diving ? "opacity-0" : "opacity-100"
        }`}
      >
        <button
          className="flex items-center gap-3"
          aria-label="Reset OceanEmbed intro"
          onClick={() => {
            setDiving(false);
            setEnteringAtmosphere(false);
            setTransitioned(false);
          }}
        >
          <span className="relative flex size-7 items-center justify-center" aria-hidden="true">
            <span className="absolute size-5 rounded-full border border-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
            <span className="absolute h-px w-7 rotate-[-18deg] bg-gradient-to-r from-cyan-400 to-violet-400" />
            <span className="size-1.5 rounded-full bg-gradient-to-tr from-cyan-300 to-violet-400 shadow-[0_0_12px_#c084fc]" />
          </span>
          <span className="font-mono text-[11px] uppercase text-muted-foreground">Ocean observation system</span>
        </button>
        <span className="rounded-sm border border-border/80 bg-card/45 px-3 py-1.5 font-mono text-[10px] uppercase text-muted-foreground backdrop-blur-md">
          SIH 2026 · PS26066
        </span>
      </header>

      <section
        className={`relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 pb-8 pt-20 transition-all duration-700 ${
          diving ? "scale-105 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">Satellite-derived ocean intelligence</p>
          <h1 className="font-display text-4xl font-semibold leading-none text-foreground sm:text-6xl">
            Ocean<span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">Embed</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Reconstructing Subsurface Ocean Temperature from Satellite Data
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="globe-orbit-stage relative my-2 h-[46vh] min-h-[310px] w-full max-w-[720px] sm:h-[52vh] sm:min-h-[390px]"
        >
          {/* Volumetric corner light beams (Cyan top-left, Violet bottom-right) */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />

          {/* Fixed Coordinates Readout */}
          <div className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase leading-6 text-muted-foreground/60 sm:block">
            <p>20.000° S</p>
            <p>80.000° E</p>
          </div>

          {/* Floating Glassmorphic Readout 1: Top-Right */}
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="ocean-card-hover pointer-events-none absolute right-2 top-4 z-10 hidden sm:flex flex-col gap-0.5 rounded-sm border border-cyan-400/25 bg-card/60 px-3 py-1.5 font-mono backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_16px_rgba(168,85,247,0.12)] animate-[pulse_6s_ease-in-out_infinite]"
          >
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-cyan-300">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              SST: 28.4°C · ANOMALY +0.3°C
            </div>
            <span className="text-[8px] text-muted-foreground/70">SENSOR: VIIRS / MODIS L3</span>
          </motion.div>

          {/* Floating Glassmorphic Readout 2: Bottom-Left */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="ocean-card-hover pointer-events-none absolute left-2 bottom-8 z-10 hidden sm:flex flex-col gap-0.5 rounded-sm border border-cyan-400/25 bg-card/60 px-3 py-1.5 font-mono backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_16px_rgba(168,85,247,0.12)] animate-[pulse_7s_ease-in-out_1.5s_infinite]"
          >
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-cyan-300">
              <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              SATELLITE LINK: ACTIVE
            </div>
            <span className="text-[8px] text-muted-foreground/70">ORBIT: SENTINEL-3A · 814KM LEO</span>
          </motion.div>

          {/* Floating Glassmorphic Readout 3: Mid-Right */}
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.42 }}
            className="ocean-card-hover pointer-events-none absolute -right-2 bottom-20 z-10 hidden md:flex flex-col gap-0.5 rounded-sm border border-violet-400/25 bg-card/60 px-3 py-1.5 font-mono backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_16px_rgba(168,85,247,0.15)] animate-[pulse_8s_ease-in-out_3s_infinite]"
          >
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-violet-300">
              <span className="size-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#c084fc]" />
              ALTIMETRY: SSH +0.42m
            </div>
            <span className="text-[8px] text-muted-foreground/70">KU-BAND RADAR · RES 0.05°</span>
          </motion.div>

          <OceanGlobe diving={diving} onSelect={explore} />

          <div className="pointer-events-none absolute bottom-[12%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-sm border border-cyan-400/35 bg-card/75 px-3.5 py-1.5 font-mono text-[9px] uppercase text-cyan-200 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.25),0_0_25px_rgba(168,85,247,0.2)]">
            <span className="size-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_10px_#a855f7]" />
            Indian Ocean · Active node
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.25 }}
          className="flex flex-col items-center"
        >
          <OceanButton onClick={explore} aria-label="Explore Ocean Data">
            Explore Ocean Data
          </OceanButton>
          <p className="mt-3 font-mono text-[9px] uppercase text-muted-foreground/60">
            Drag globe to inspect · select node to enter
          </p>
        </motion.div>
      </section>

      {/* Final transition veil entering Indian Ocean dataset */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-background transition-opacity duration-700 ${
          transitioned ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!transitioned}
      >
        <div
          className={`text-center transition-all delay-200 duration-700 ${
            transitioned ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span className="mx-auto block size-2 rounded-full bg-primary shadow-[0_0_24px_var(--glow-strong)]" />
          <p className="mt-4 font-mono text-[10px] uppercase text-muted-foreground">
            Entering Indian Ocean dataset
          </p>
        </div>
      </div>
    </main>
  );
}
