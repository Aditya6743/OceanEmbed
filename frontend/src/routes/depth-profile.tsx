import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, ChartNoAxesCombined, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CausticBackground } from "@/components/CausticBackground";
import { OceanTsParticles } from "@/components/OceanTsParticles";
import { getDepthZone, getProfileStats, interpolateTemperature, type ProfilePoint } from "@/lib/ocean-data";
import { usePrediction } from "@/lib/prediction-context";

export const Route = createFileRoute("/depth-profile")({ ssr: false, component: DepthProfile });

// Shimmering sunlight rays streaming down from the surface
function ShimmeringSunlightRays({ progress }: { progress: number }) {
  const opacity = Math.max(0, 0.9 - progress * 1.5);
  if (opacity <= 0.01) return null;

  return (
    <div
      className="sunlight-ray-field transition-opacity duration-300"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="sunlight-ray-1" />
      <div className="sunlight-ray-2" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[860px] rounded-full blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(125, 211, 252, 0.45), rgba(56, 189, 248, 0.2) 40%, rgba(168, 85, 247, 0.08) 65%, transparent 75%)",
        }}
      />
    </div>
  );
}

// Large soft out-of-focus background jellyfish silhouettes framing the text
function OutOfFocusMarineSilhouettes() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Left Jellyfish: soft, blurred, violet/cyan glow framing left side */}
      <div className="absolute -left-14 top-[16vh] w-[280px] h-[360px] opacity-25 filter blur-[7px] animate-[float_24s_ease-in-out_infinite]">
        <svg viewBox="0 0 120 160" fill="none" className="w-full h-full text-violet-400">
          <ellipse cx="60" cy="46" rx="48" ry="38" fill="currentColor" fillOpacity="0.32" />
          <path
            d="M18 50 C24 18, 96 18, 102 50 C82 58, 38 58, 18 50 Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
          <path
            d="M34 55 Q28 95, 36 142 M48 55 Q42 105, 50 152 M72 55 Q78 105, 70 152 M86 55 Q92 95, 84 142"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Right Jellyfish: soft, blurred, cyan glow framing right side */}
      <div className="absolute -right-16 top-[34vh] w-[320px] h-[400px] opacity-20 filter blur-[9px] animate-[float_28s_ease-in-out_infinite_-9s]">
        <svg viewBox="0 0 120 160" fill="none" className="w-full h-full text-cyan-300">
          <ellipse cx="60" cy="48" rx="50" ry="40" fill="currentColor" fillOpacity="0.28" />
          <path
            d="M16 52 C20 16, 100 16, 104 52 C84 62, 36 62, 16 52 Z"
            fill="currentColor"
            fillOpacity="0.46"
          />
          <path
            d="M30 58 Q26 100, 34 146 M46 58 Q40 110, 48 156 M74 58 Q80 110, 72 156 M90 58 Q94 100, 86 146"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeOpacity="0.38"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Deep Mesopelagic Siphonophore Silhouette */}
      <div className="absolute right-[10%] top-[68vh] w-[440px] h-[170px] opacity-15 filter blur-[10px] animate-[float_36s_ease-in-out_infinite_-16s]">
        <svg viewBox="0 0 200 80" fill="none" className="w-full h-full text-fuchsia-400">
          <path
            d="M10 40 Q50 18, 100 40 T190 40"
            stroke="currentColor"
            strokeWidth="6"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
          <ellipse cx="40" cy="40" rx="9" ry="9" fill="currentColor" fillOpacity="0.4" />
          <ellipse cx="80" cy="40" rx="11" ry="11" fill="currentColor" fillOpacity="0.5" />
          <ellipse cx="120" cy="40" rx="10" ry="10" fill="currentColor" fillOpacity="0.4" />
          <ellipse cx="160" cy="40" rx="8" ry="8" fill="currentColor" fillOpacity="0.3" />
        </svg>
      </div>
    </div>
  );
}

function DepthBandCard({
  point,
  stats,
  index,
}: {
  point: ProfilePoint;
  stats: ReturnType<typeof getProfileStats>;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
    const rotateX = ((y - rect.height / 2) / rect.height) * -5;
    const rotateY = ((x - rect.width / 2) / rect.width) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const warmth = (point.temp - stats.min) / (stats.max - stats.min);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="depth-card tilt-card ocean-card-hover cursor-default border border-cyan-400/25 bg-slate-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      style={{ "--card-warmth": warmth } as React.CSSProperties}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-widest text-primary">
          {getDepthZone(point.depth)}
        </p>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-primary/90">
          Layer #{index + 1}
        </span>
      </div>
      <div>
        <strong>{point.depth}</strong>
        <span>meters</span>
      </div>
      <div
        className="depth-temp"
        style={{ "--depth-warmth": warmth } as React.CSSProperties}
      >
        {point.temp.toFixed(1)}
        <span>°C</span>
      </div>
      <small>
        {index < 2
          ? "Solar energy shapes a warm, dynamic upper layer."
          : index < 5
            ? "Temperature falls rapidly across the ocean thermocline."
            : "Cold, dense water stores climate signals across long timescales."}
      </small>
    </div>
  );
}

const DEPTH_TICKS = [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000];

const DEPTH_ZONES = [
  { label: "Surface", top: "3%", color: "text-cyan-300" },
  { label: "Thermocline", top: "21%", color: "text-sky-300" },
  { label: "Deep Layer", top: "54%", color: "text-indigo-300" },
  { label: "Abyssal", top: "88%", color: "text-fuchsia-300" },
];

function DepthProfile() {
  const { prediction } = usePrediction();
  const [depth, setDepth] = useState(0);
  const [progress, setProgress] = useState(0);
  const stats = useMemo(() => getProfileStats(prediction.profile), [prediction.profile]);
  const currentTemp = interpolateTemperature(prediction.profile, depth);
  const warmth = Math.max(0, Math.min(1, (currentTemp - stats.min) / (stats.max - stats.min)));

  useEffect(() => {
    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const next = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setProgress(next);
      setDepth(Math.round(next * stats.maxDepth));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [stats.maxDepth]);

  // Rich bioluminescent particle field: bright near top, fading toward bottom, upward drift
  const bioluminescentParticles = useMemo(() => {
    const count = 52;
    return Array.from({ length: count }, (_, i) => {
      // Surface-biased top distribution: higher concentration near upper levels
      const topBias = Math.pow(Math.random(), 1.4);
      const top = topBias * 100;
      const left = Math.random() * 92 + 4;
      const size = Math.random() * 2.8 + 1.2;
      const duration = Math.random() * 12 + 10;
      const delay = -Math.random() * 16;

      // Color variation: cyan near surface, deep indigo/violet in middle, magenta in abyss
      let colorClass = "bg-cyan-300 shadow-[0_0_10px_#22d3ee]";
      if (top > 65) {
        colorClass = "bg-fuchsia-400 shadow-[0_0_12px_#d946ef]";
      } else if (top > 30) {
        colorClass = "bg-sky-300 shadow-[0_0_10px_#38bdf8]";
      }

      // Dimmer opacity towards the bottom
      const baseOpacity = (1.0 - top / 160) * (Math.random() * 0.4 + 0.45);

      return { left, top, size, duration, delay, colorClass, baseOpacity };
    });
  }, []);

  return (
    <main
      className="depth-experience relative overflow-hidden"
      style={
        {
          "--depth-progress": progress,
          "--depth-warmth": warmth,
        } as React.CSSProperties
      }
    >
      {/* Shimmering Sunlight Light-Rays streaming down from surface */}
      <ShimmeringSunlightRays progress={progress} />

      {/* Full-screen dense bioluminescent tsparticles network layer */}
      <OceanTsParticles particleCount={80} />

      {/* Large soft out-of-focus background marine silhouettes framing the text */}
      <OutOfFocusMarineSilhouettes />

      {/* Surface Caustic light refraction */}
      {progress < 0.45 && (
        <CausticBackground
          opacity={Math.max(0, 0.15 - progress * 0.32)}
          className="fixed inset-0 pointer-events-none"
        />
      )}

      {/* Bioluminescent Upward-Drifting Particles */}
      <div className="depth-ambient" aria-hidden="true">
        {bioluminescentParticles.map((p, index) => (
          <i
            key={index}
            className={p.colorClass}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.baseOpacity,
            }}
          />
        ))}
      </div>

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-4 sm:px-7 backdrop-blur-md border-b border-cyan-400/20 bg-slate-950/40">
        <Button asChild variant="ghost" className="depth-nav ocean-interactive cursor-pointer">
          <Link to="/dashboard">
            <ArrowLeft /> Dashboard
          </Link>
        </Button>
        <span className="font-mono text-[9px] uppercase text-cyan-200/70 tracking-wider">
          OceanEmbed · Vertical Reconstruction
        </span>
      </header>

      {/* Glassmorphic Depth / Temperature Card with 2-color cyan-to-violet glow & pulse */}
      <aside className="depth-counter" aria-live="polite">
        <p>Depth</p>
        <strong>
          {depth}
          <span>m</span>
        </strong>
        <div>
          {currentTemp.toFixed(1)}°C · {getDepthZone(depth)}
        </div>
      </aside>

      {/* Enhanced Depth-Axis Rail with Ticks, Glowing Zone Labels & Pulsing Dot */}
      <aside className="depth-rail" aria-label={`${Math.round(progress * 100)} percent through profile`}>
        <div className="depth-rail-line">
          {/* Pulsing indicator dot */}
          <i style={{ top: `${progress * 100}%` }} />

          {/* Interval tick marks */}
          {DEPTH_TICKS.map((m) => (
            <div
              key={m}
              className="depth-tick"
              style={{ top: `${(m / 2000) * 100}%` }}
            >
              <b />
              <span className="hidden sm:inline">{m}m</span>
            </div>
          ))}

          {/* Glowing Depth Zone Labels */}
          {DEPTH_ZONES.map((zone) => (
            <div
              key={zone.label}
              className={`depth-zone ${zone.color}`}
              style={{ top: zone.top }}
            >
              <b />
              <span className="hidden sm:inline font-mono">{zone.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Hero Section Framed by Silhouettes and Shimmering Rays */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="depth-hero"
      >
        <p className="data-kicker text-primary parallax-slow">Predicted thermal descent</p>
        <h1 className="parallax-fast">
          From sunlight
          <br />
          to the abyss.
        </h1>
        <p className="parallax-slow">
          Scroll to descend through the reconstructed water column at {prediction.lat.toFixed(2)}°,{" "}
          {prediction.lon.toFixed(2)}°.
        </p>
        <ChevronDown className="mt-12 size-5 animate-bounce text-primary" />
      </motion.section>

      <div className="depth-sections">
        {prediction.profile.map((point, index) => (
          <section
            className={`depth-band ${index % 2 ? "depth-band-right" : ""}`}
            key={point.depth}
          >
            <DepthBandCard point={point} stats={stats} index={index} />
          </section>
        ))}
      </div>

      <section className="depth-summary">
        <p className="data-kicker text-primary">Profile limit reached</p>
        <h2>2,000 meters below the surface</h2>
        <div className="depth-summary-grid">
          <Summary label="Maximum temperature" value={`${stats.max.toFixed(1)}°C`} />
          <Summary label="Minimum temperature" value={`${stats.min.toFixed(1)}°C`} />
          <Summary label="Depth range" value={`0–${stats.maxDepth}m`} />
        </div>
        <Button
          asChild
          className="ocean-interactive h-11 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 font-semibold shadow-[0_0_28px_rgba(34,211,238,0.4)] hover:brightness-110 transition-all cursor-pointer"
        >
          <Link to="/dashboard" hash="results">
            <ChartNoAxesCombined /> View Full Chart
          </Link>
        </Button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="ocean-interactive mt-8 flex items-center gap-2 font-mono text-[9px] uppercase text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowUp className="size-3" /> Return to surface
        </button>
      </section>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
