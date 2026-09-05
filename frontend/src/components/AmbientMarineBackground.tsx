import { useEffect, useId, useRef } from "react";

interface MarineParticle {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
  color: string;
  glow?: string;
}

const farParticles: MarineParticle[] = [
  { left: "12%", top: "75%", size: 1.5, delay: "-2s", duration: "24s", opacity: 0.28, color: "rgba(34, 211, 238, 0.9)" },
  { left: "28%", top: "30%", size: 1.2, delay: "-6s", duration: "28s", opacity: 0.24, color: "rgba(192, 132, 252, 0.85)" },
  { left: "62%", top: "82%", size: 1.6, delay: "-11s", duration: "32s", opacity: 0.26, color: "rgba(56, 189, 248, 0.9)" },
  { left: "78%", top: "22%", size: 1.2, delay: "-14s", duration: "26s", opacity: 0.28, color: "rgba(244, 114, 182, 0.8)" },
  { left: "88%", top: "68%", size: 1.5, delay: "-4s", duration: "25s", opacity: 0.25, color: "rgba(34, 211, 238, 0.85)" },
  { left: "42%", top: "18%", size: 1.4, delay: "-9s", duration: "30s", opacity: 0.22, color: "rgba(129, 140, 248, 0.85)" },
  { left: "6%", top: "42%", size: 1.2, delay: "-16s", duration: "27s", opacity: 0.26, color: "rgba(192, 132, 252, 0.85)" },
  { left: "94%", top: "15%", size: 1.3, delay: "-19s", duration: "31s", opacity: 0.25, color: "rgba(34, 211, 238, 0.85)" },
];

const midParticles: MarineParticle[] = [
  { left: "8%", top: "78%", size: 2.2, delay: "-3s", duration: "18s", opacity: 0.5, color: "rgba(34, 211, 238, 0.95)", glow: "rgba(34, 211, 238, 0.45)" },
  { left: "83%", top: "38%", size: 2.8, delay: "-5s", duration: "22s", opacity: 0.55, color: "rgba(192, 132, 252, 0.95)", glow: "rgba(192, 132, 252, 0.45)" },
  { left: "15%", top: "25%", size: 2, delay: "-7s", duration: "20s", opacity: 0.45, color: "rgba(56, 189, 248, 0.9)", glow: "rgba(56, 189, 248, 0.4)" },
  { left: "45%", top: "85%", size: 2.5, delay: "-2s", duration: "19s", opacity: 0.58, color: "rgba(244, 114, 182, 0.9)", glow: "rgba(244, 114, 182, 0.4)" },
  { left: "70%", top: "15%", size: 2.1, delay: "-9s", duration: "23s", opacity: 0.48, color: "rgba(129, 140, 248, 0.9)", glow: "rgba(129, 140, 248, 0.4)" },
  { left: "30%", top: "50%", size: 2.6, delay: "-4s", duration: "21s", opacity: 0.52, color: "rgba(34, 211, 238, 0.95)", glow: "rgba(34, 211, 238, 0.45)" },
  { left: "90%", top: "60%", size: 2.2, delay: "-6s", duration: "20s", opacity: 0.45, color: "rgba(192, 132, 252, 0.9)", glow: "rgba(192, 132, 252, 0.4)" },
  { left: "55%", top: "35%", size: 2.3, delay: "-1s", duration: "17s", opacity: 0.52, color: "rgba(56, 189, 248, 0.9)", glow: "rgba(56, 189, 248, 0.4)" },
  { left: "3%", top: "18%", size: 2.4, delay: "-8s", duration: "24s", opacity: 0.48, color: "rgba(192, 132, 252, 0.9)", glow: "rgba(192, 132, 252, 0.4)" },
  { left: "92%", top: "85%", size: 2.1, delay: "-13s", duration: "19s", opacity: 0.5, color: "rgba(34, 211, 238, 0.95)", glow: "rgba(34, 211, 238, 0.45)" },
];

const nearParticles: MarineParticle[] = [
  { left: "22%", top: "65%", size: 3.8, delay: "-1s", duration: "14s", opacity: 0.72, color: "rgba(165, 243, 252, 1)", glow: "rgba(34, 211, 238, 0.65)" },
  { left: "75%", top: "52%", size: 3.5, delay: "-8s", duration: "15s", opacity: 0.68, color: "rgba(233, 213, 255, 1)", glow: "rgba(192, 132, 252, 0.65)" },
  { left: "38%", top: "28%", size: 4, delay: "-12s", duration: "16s", opacity: 0.62, color: "rgba(186, 230, 253, 1)", glow: "rgba(56, 189, 248, 0.6)" },
  { left: "86%", top: "80%", size: 3.2, delay: "-3s", duration: "13s", opacity: 0.78, color: "rgba(251, 207, 232, 1)", glow: "rgba(244, 114, 182, 0.6)" },
  { left: "12%", top: "35%", size: 3.6, delay: "-5s", duration: "14.5s", opacity: 0.68, color: "rgba(192, 132, 252, 1)", glow: "rgba(168, 85, 247, 0.65)" },
  { left: "65%", top: "78%", size: 3.4, delay: "-10s", duration: "15.5s", opacity: 0.72, color: "rgba(103, 232, 249, 1)", glow: "rgba(34, 211, 238, 0.65)" },
];

const fragments = [
  { left: "11%", top: "42%", text: "0x4F · SST RECON", delay: "-2s" },
  { left: "82%", top: "68%", text: "KU-BAND · 13.57 GHz", delay: "-5s" },
  { left: "22%", top: "16%", text: "NODE_IND_4802", delay: "-8s" },
  { left: "74%", top: "24%", text: "SSH RESIDUAL: -0.018m", delay: "-11s" },
  { left: "50%", top: "88%", text: "LATENCY: 42ms · LEO", delay: "-4s" },
];

function Jellyfish({ className }: { className: string }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg className={className} viewBox="0 0 120 160" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${gradientId}-halo`} cx="50%" cy="42%" r="58%">
          <stop offset="0" stopColor="#a855f7" stopOpacity=".4" />
          <stop offset=".48" stopColor="#22d3ee" stopOpacity=".2" />
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gradientId}-bell`} cx="50%" cy="28%" r="76%">
          <stop offset="0" stopColor="#38bdf8" stopOpacity=".65" />
          <stop offset=".42" stopColor="#818cf8" stopOpacity=".35" />
          <stop offset=".82" stopColor="#c084fc" stopOpacity=".12" />
          <stop offset="1" stopColor="#05010e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="marine-jelly-glow">
        <ellipse cx="60" cy="53" rx="52" ry="46" fill={`url(#${gradientId}-halo)`} />
        <path
          d="M20 65C21 36 37 16 60 15c23 1 39 21 40 50-8-5-13 5-20 1-7-5-13 5-20 0-7-5-13 5-20 0-7-4-13 6-20-1Z"
          fill={`url(#${gradientId}-bell)`}
          stroke="currentColor"
          strokeOpacity=".5"
          strokeWidth="1.2"
        />
        <path d="M27 58c8-20 20-31 33-31s26 11 33 31" stroke="currentColor" strokeOpacity=".2" strokeWidth="1" />
        <path d="M22 64c12 6 21-5 29 1 7 5 13-4 20 0 8 5 16-5 27-1" stroke="currentColor" strokeOpacity=".38" strokeWidth="1" />
      </g>

      <g className="marine-tentacles" stroke="currentColor" strokeLinecap="round" fill="none">
        <path d="M29 67c-4 14 8 19 2 31-7 15 4 20-2 35-3 8-2 14 2 20" strokeOpacity=".35" strokeWidth="1.15" />
        <path d="M39 69c7 12-5 22 2 34 8 13-5 21 1 34" strokeOpacity=".5" strokeWidth="1.35" />
        <path d="M50 68c-5 15 8 21 1 36-6 13 8 22 1 45" strokeOpacity=".34" strokeWidth="1" />
        <path d="M61 68c7 13-6 23 1 37 7 13-5 23 1 40" strokeOpacity=".55" strokeWidth="1.35" />
        <path d="M72 68c-5 12 8 20 1 33-8 15 5 23-2 39" strokeOpacity=".38" strokeWidth="1.1" />
        <path d="M83 68c8 12-4 19 2 31 7 14-5 20 1 33" strokeOpacity=".48" strokeWidth="1.25" />
        <path d="M93 66c-5 13 5 18 0 29-5 12 5 18 1 28" strokeOpacity=".28" strokeWidth=".9" />
      </g>
    </svg>
  );
}

function Starfish({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path
        d="m50 9 9 28 29-8-23 20 18 24-28-13-17 25 3-30-29-9 30-6 8-31Z"
        fill="currentColor"
        fillOpacity=".09"
        stroke="currentColor"
        strokeOpacity=".24"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="49" r="3" fill="currentColor" fillOpacity=".18" />
    </svg>
  );
}

function MantaRay({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" aria-hidden="true">
      <path
        d="M100 20 C60 20, 20 50, 10 70 C40 65, 80 50, 100 55 C120 50, 160 65, 190 70 C180 50, 140 20, 100 20 Z"
        fill="currentColor"
        fillOpacity=".05"
        stroke="currentColor"
        strokeOpacity=".15"
      />
      <path d="M100 55 L100 100" stroke="currentColor" strokeOpacity=".1" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function AmbientMarineBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animateParallax = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      container.style.setProperty("--marine-x", currentX.toFixed(3));
      container.style.setProperty("--marine-y", currentY.toFixed(3));
      rafId = requestAnimationFrame(animateParallax);
    };

    rafId = requestAnimationFrame(animateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="marine-ambience pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic sunlight rays streaming from the surface */}
      <div className="sunlight-ray-field pointer-events-none absolute inset-x-0 top-0 h-[65vh] overflow-hidden opacity-30">
        <div className="sunlight-ray-1 absolute -top-12 left-[12%] h-[75vh] w-28 -rotate-12 bg-gradient-to-b from-cyan-200/25 via-teal-300/10 to-transparent blur-xl" />
        <div className="sunlight-ray-2 absolute -top-14 left-[34%] h-[85vh] w-36 -rotate-6 bg-gradient-to-b from-sky-100/30 via-cyan-400/12 to-transparent blur-2xl" />
        <div className="sunlight-ray-1 absolute -top-12 left-[58%] h-[72vh] w-28 rotate-4 bg-gradient-to-b from-cyan-200/20 via-indigo-400/10 to-transparent blur-xl" />
        <div className="sunlight-ray-2 absolute -top-16 left-[80%] h-[80vh] w-32 rotate-12 bg-gradient-to-b from-sky-200/22 via-teal-300/10 to-transparent blur-2xl" />
      </div>

      {/* Dual radial bioluminescent atmospheric auras (Cyan top-left, Deep Violet bottom-right) */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[580px] w-[580px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(34, 211, 238, 0.18), rgba(99, 102, 241, 0.08) 45%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(168, 85, 247, 0.16), rgba(79, 70, 229, 0.08) 50%, transparent 70%)",
        }}
      />

      {/* Mid-ground marine silhouettes with cyan-violet luminescence */}
      <Jellyfish className="marine-jelly marine-jelly-left absolute text-cyan-400/35" />
      <Jellyfish className="marine-jelly marine-jelly-right absolute text-violet-400/30" />
      <Jellyfish className="marine-jelly marine-jelly-top absolute text-indigo-400/25" />

      <MantaRay className="marine-manta absolute text-cyan-400/20" />

      {/* Far particle layer (multi-tone, slow, subtle parallax) */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: "translate3d(calc(var(--marine-x, 0) * -8px), calc(var(--marine-y, 0) * -8px), 0)",
        }}
      >
        {farParticles.map((particle, index) => (
          <span
            className="marine-particle absolute rounded-full"
            key={`far-${index}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              backgroundColor: particle.color,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* Mid particle layer (richer multi-tone glow, moderate parallax) */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: "translate3d(calc(var(--marine-x, 0) * 12px), calc(var(--marine-y, 0) * 12px), 0)",
        }}
      >
        {midParticles.map((particle, index) => (
          <span
            className="marine-particle absolute rounded-full"
            key={`mid-${index}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              backgroundColor: particle.color,
              boxShadow: particle.glow ? `0 0 10px ${particle.glow}` : undefined,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* Near particle layer (brightest bioluminescent specks, strong parallax) */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: "translate3d(calc(var(--marine-x, 0) * 22px), calc(var(--marine-y, 0) * 22px), 0)",
        }}
      >
        {nearParticles.map((particle, index) => (
          <span
            className="marine-particle absolute rounded-full"
            key={`near-${index}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              backgroundColor: particle.color,
              boxShadow: particle.glow ? `0 0 14px ${particle.glow}, 0 0 24px ${particle.glow}` : undefined,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* Floating telemetry fragments */}
      <div className="absolute inset-0">
        {fragments.map((frag, index) => (
          <span
            className="marine-data-fragment absolute font-mono text-[7px] text-cyan-300/40 uppercase tracking-widest"
            key={index}
            style={{
              left: frag.left,
              top: frag.top,
              animationDelay: frag.delay,
            }}
          >
            {frag.text}
          </span>
        ))}
      </div>

      <Starfish className="marine-starfish marine-starfish-left absolute text-cyan-400/25" />
    </div>
  );
}
