import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  CalendarDays,
  Crosshair,
  Droplets,
  RotateCcw,
  Satellite,
  Sparkles,
  Thermometer,
  Waves,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CausticBackground } from "@/components/CausticBackground";
import { PredictionResults } from "@/components/PredictionResults";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DEFAULT_DATE, DEFAULT_LOCATION } from "@/lib/ocean-data";
import { usePrediction } from "@/lib/prediction-context";
import { requestOceanPrediction } from "@/lib/prediction-service";

const OceanMap = lazy(() => import("@/components/OceanMap"));
const loadingSteps = ["Fetching surface data…", "Running OceanEmbed…", "Preparing temperature profile…"];

export const Route = createFileRoute("/dashboard")({ ssr: false, component: Dashboard });

// Subtle ambient particle drift behind the dashboard
function DashboardAmbientDrift() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 17) % 94 + 3}%`,
        top: `${(i * 23) % 92 + 4}%`,
        size: (i % 3) + 1.5,
        duration: `${20 + (i % 10) * 3}s`,
        delay: `-${(i * 1.8).toFixed(1)}s`,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="absolute rounded-full bg-cyan-300/20 shadow-[0_0_8px_rgba(34,211,238,0.25)] animate-[float_16s_ease-in-out_infinite]"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function TelemetryStatusStrip() {
  const statuses = [
    { label: "SENTINEL-3 ALTIMETRY", desc: "Streaming Real-Time", color: "bg-emerald-400" },
    { label: "ARGO PROFILING NETWORK", desc: "3,842 Floats Synced", color: "bg-cyan-400" },
    { label: "VIIRS SST OBSERVATION", desc: "Radiative Transfer Normal", color: "bg-sky-400" },
    { label: "NEURAL RECONSTRUCTION", desc: "T-S Weight Matrix Loaded", color: "bg-teal-400" },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statuses.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [statuses.length]);

  const active = statuses[currentIndex] ?? statuses[0]!;

  return (
    <div className="mt-4 rounded-md border border-primary/20 bg-background/50 p-2.5 backdrop-blur-sm transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
          <span className={`size-1.5 rounded-full ${active.color} shadow-[0_0_8px_currentColor] animate-pulse`} />
          <span>{active.label}</span>
        </div>
        <div className="flex items-end gap-0.5 h-3">
          <span className="waveform-bar" style={{ animationDelay: "0ms" }} />
          <span className="waveform-bar" style={{ animationDelay: "200ms" }} />
          <span className="waveform-bar" style={{ animationDelay: "400ms" }} />
          <span className="waveform-bar" style={{ animationDelay: "150ms" }} />
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-[9px]">
        <span className="text-primary/90 font-medium">{active.desc}</span>
        <span className="text-[7.5px] tracking-wider text-muted-foreground/70 uppercase">Telemetry Active</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const { prediction, setPrediction, resetPrediction } = usePrediction();
  const [coordinates, setCoordinates] = useState(DEFAULT_LOCATION);
  const [date, setDate] = useState(DEFAULT_DATE);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    if (loadingStep < 0 || loadingStep >= loadingSteps.length - 1) return;
    const timer = window.setTimeout(() => setLoadingStep((value) => value + 1), 700);
    return () => window.clearTimeout(timer);
  }, [loadingStep]);

  const predict = async () => {
    setHasResults(false);
    setLoadingStep(0);
    const nextPrediction = await requestOceanPrediction({ ...coordinates, date });
    setPrediction(nextPrediction);
    window.setTimeout(() => {
      setLoadingStep(-1);
      setHasResults(true);
      window.setTimeout(() => document.querySelector("#results")?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 1050);
  };

  const reset = () => {
    setCoordinates(DEFAULT_LOCATION);
    setDate(DEFAULT_DATE);
    setHasResults(false);
    setLoadingStep(-1);
    resetPrediction();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <main className="dashboard-shell relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Subtle animated water caustics & faint particle drift behind all panels */}
      <CausticBackground opacity={0.08} />
      <DashboardAmbientDrift />

      <div className="relative z-10">
        <AppHeader />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[1480px] px-4 py-6 sm:px-7 sm:py-8"
        >
          <motion.div variants={itemVariants} className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="data-kicker">Prediction workspace</p>
                <span className="flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 font-mono text-[8px] uppercase text-cyan-300">
                  <span className="size-1 rounded-full bg-emerald-400 animate-ping" />
                  Live Hydrographic Grid
                </span>
              </div>
              <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl tracking-tight">
                Ocean surface selection
              </h1>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              Select an ocean coordinate on the geospatial bathymetric basemap and reconstruct its subsurface thermal structure from satellite observations.
            </p>
          </motion.div>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            {/* Elevated Map Panel with Glassmorphic Bezel & Telemetry Brackets */}
            <motion.div variants={itemVariants}>
              <Card className="ocean-panel ocean-panel-elevated ocean-card-hover overflow-hidden border border-cyan-400/25 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7),0_0_28px_rgba(34,211,238,0.14)]">
                <div className="flex h-12 items-center justify-between border-b border-border/70 px-4 bg-background/30 backdrop-blur-md">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground">
                    <Satellite className="size-4 text-primary" /> CartoDB Dark Ocean Basemap
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] text-cyan-300">
                    <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
                    CLICK ANYWHERE TO RE-TARGET
                  </span>
                </div>

                {/* Glassmorphic Map Viewport Container */}
                <div className="relative h-[510px] sm:h-[590px] p-2 bg-slate-950/30">
                  <div className="relative h-full w-full overflow-hidden rounded-lg border border-cyan-400/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">
                    {/* Corner Telemetry Brackets */}
                    <span className="pointer-events-none absolute -top-0.5 -left-0.5 size-3.5 border-t-2 border-l-2 border-cyan-400 z-20" />
                    <span className="pointer-events-none absolute -top-0.5 -right-0.5 size-3.5 border-t-2 border-r-2 border-cyan-400 z-20" />
                    <span className="pointer-events-none absolute -bottom-0.5 -left-0.5 size-3.5 border-b-2 border-l-2 border-cyan-400 z-20" />
                    <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 size-3.5 border-b-2 border-r-2 border-cyan-400 z-20" />

                    <Suspense
                      fallback={
                        <div className="grid h-full place-items-center font-mono text-xs text-muted-foreground">
                          Initializing geospatial layer…
                        </div>
                      }
                    >
                      <OceanMap value={coordinates} onChange={setCoordinates} />
                    </Suspense>

                    {/* Elevated Coordinate Telemetry Overlay */}
                    <div className="map-coordinate-readout">
                      <Crosshair className="size-3.5 text-primary" />
                      <span>
                        {coordinates.lat.toFixed(4)}° {coordinates.lat >= 0 ? "N" : "S"} ·{" "}
                        {coordinates.lon.toFixed(4)}° {coordinates.lon >= 0 ? "E" : "W"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Elevated Control Panel with Rich Visual Hierarchy */}
            <motion.div variants={itemVariants}>
              <Card className="ocean-panel ocean-panel-elevated ocean-card-hover h-fit p-5 xl:sticky xl:top-4 border border-cyan-400/25 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7),0_0_24px_rgba(34,211,238,0.12)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="data-kicker">Input parameters</p>
                    <h2 className="mt-0.5 font-display text-lg font-semibold tracking-tight">Prediction control</h2>
                  </div>
                  <span className="flex items-center gap-1 rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[8px] uppercase text-emerald-400">
                    <span className="size-1 rounded-full bg-emerald-400 animate-ping" />
                    Ready
                  </span>
                </div>

                <div className="my-3.5 h-px bg-border/70" />

                <label className="control-label">Selected latitude / longitude</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={coordinates.lat}
                    type="number"
                    step="0.0001"
                    onChange={(e) => setCoordinates((value) => ({ ...value, lat: Number(e.target.value) }))}
                    className="ocean-input font-mono focus:border-cyan-400"
                  />
                  <Input
                    value={coordinates.lon}
                    type="number"
                    step="0.0001"
                    onChange={(e) => setCoordinates((value) => ({ ...value, lon: Number(e.target.value) }))}
                    className="ocean-input font-mono focus:border-cyan-400"
                  />
                </div>

                <label className="control-label mt-4">
                  <CalendarDays className="size-3.5" /> Observation date
                </label>
                <Input
                  value={date}
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  className="ocean-input font-mono focus:border-cyan-400"
                />

                <div className="mt-4 flex items-center justify-between">
                  <p className="control-label mb-0">Surface observations</p>
                  <span className="font-mono text-[7.5px] uppercase tracking-wider text-muted-foreground/70">
                    Satellite Ingested
                  </span>
                </div>

                {/* Elevated Surface Observations with Icons & Color Accents */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <SurfaceDatum
                    label="SST"
                    value={`${prediction.surfaceData.sst}°C`}
                    icon={<Thermometer className="size-3 text-amber-400" />}
                    accent="border-amber-400/20 bg-amber-400/5 text-amber-300"
                  />
                  <SurfaceDatum
                    label="SSH"
                    value={`${prediction.surfaceData.ssh}m`}
                    icon={<Waves className="size-3 text-cyan-400" />}
                    accent="border-cyan-400/20 bg-cyan-400/5 text-cyan-300"
                  />
                  <SurfaceDatum
                    label="SSS"
                    value={`${prediction.surfaceData.sss}`}
                    icon={<Droplets className="size-3 text-teal-400" />}
                    accent="border-teal-400/20 bg-teal-400/5 text-teal-300"
                  />
                </div>

                {/* Live Scientific Telemetry Status Strip */}
                <TelemetryStatusStrip />

                <AnimatePresence mode="wait">
                  {loadingStep >= 0 ? (
                    <motion.div
                      key={loadingStep}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      className="mt-5 flex flex-col gap-2 rounded-lg border border-cyan-400/40 bg-slate-950/80 p-3.5 backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.2),0_0_35px_rgba(168,85,247,0.15)]"
                    >
                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-cyan-300">
                        <div className="flex items-center gap-2.5">
                          <span className="loading-sonar-ring" />
                          <span className="font-semibold text-foreground">{loadingSteps[loadingStep]}</span>
                        </div>
                        <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 text-[8px] text-cyan-300 border border-cyan-400/25">
                          {loadingStep + 1} / 3
                        </span>
                      </div>

                      {/* Multi-phase animated progress bar */}
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 shadow-[0_0_8px_#22d3ee]"
                          initial={{ width: `${(loadingStep / 3) * 100}%` }}
                          animate={{ width: `${((loadingStep + 1) / 3) * 100}%` }}
                          transition={{ duration: 0.65, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <Button
                      onClick={predict}
                      className="ocean-interactive mt-5 h-11 w-full bg-gradient-to-r from-cyan-500 via-primary to-violet-600 text-primary-foreground font-medium shadow-[0_0_28px_var(--glow-soft)] hover:shadow-[0_0_36px_var(--glow-strong)] transition-all duration-300 cursor-pointer"
                    >
                      <Sparkles className="size-4 text-cyan-100" /> Predict profile
                    </Button>
                  )}
                </AnimatePresence>

                <Button
                  variant="ghost"
                  onClick={reset}
                  className="ocean-interactive mt-2 w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RotateCcw /> Reset inputs
                </Button>
              </Card>
            </motion.div>
          </div>

          <AnimatePresence>
            {hasResults && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <PredictionResults prediction={prediction} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}

function SurfaceDatum({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className={`tilt-card rounded-md border p-2.5 transition-all duration-200 hover:scale-[1.02] ${accent}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="mt-1 font-mono text-sm font-semibold tracking-tight">{value}</p>
    </div>
  );
}