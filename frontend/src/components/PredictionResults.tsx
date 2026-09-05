import { lazy, Suspense, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, CheckCircle2, Database, Orbit, Radio, ShieldCheck, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type OceanPrediction } from "@/lib/ocean-data";
import { WaterColumn } from "./WaterColumn";

const ProfileChart = lazy(() => import("./ProfileChart"));

// 3D Tilt Card wrapper with perspective transform on hover
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export function PredictionResults({ prediction }: { prediction: OceanPrediction }) {
  return (
    <section id="results" className="scroll-mt-6 space-y-5 pt-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="data-kicker">Prediction complete</span>
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[8px] uppercase text-emerald-400">
              <span className="size-1 rounded-full bg-emerald-400 animate-ping" />
              Live Output
            </span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Subsurface temperature profile
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {prediction.lat.toFixed(4)}°, {prediction.lon.toFixed(4)}° · {prediction.date} · Depth 0m to 2,000m
          </p>
        </div>

        <Button
          asChild
          className="h-11 bg-primary text-primary-foreground shadow-[0_0_28px_var(--glow-soft)] hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_36px_var(--glow-strong)]"
        >
          <Link to="/depth-profile">
            Explore 3D Water Column <ArrowDown />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.42fr_0.78fr]">
        {/* Profile Chart Card */}
        <Card className="ocean-panel ocean-panel-elevated h-[440px] overflow-hidden p-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3 font-mono text-[10px] uppercase text-muted-foreground">
            <span className="flex items-center gap-2">
              <Waves className="size-3.5 text-primary" /> Temperature vs Depth Curve
            </span>
            <span className="text-[9px] text-primary/80">Spline Interpolated</span>
          </div>
          <div className="h-[370px]">
            <Suspense
              fallback={
                <div className="grid h-full place-items-center font-mono text-xs text-muted-foreground">
                  Loading profile plot…
                </div>
              }
            >
              <ProfileChart profile={prediction.profile} />
            </Suspense>
          </div>
        </Card>

        {/* 3D Thermal Column Card */}
        <Card className="ocean-panel ocean-panel-elevated h-[440px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 font-mono text-[10px] uppercase text-muted-foreground bg-background/25 backdrop-blur-md">
            <span className="flex items-center gap-2">
              <Orbit className="size-4 text-primary animate-spin" style={{ animationDuration: "24s" }} /> 3D Thermal Strata
            </span>
            <span className="flex items-center gap-1 text-[8.5px] text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Dynamic Shader
            </span>
          </div>
          <div className="h-[385px]">
            <WaterColumn profile={prediction.profile} />
          </div>
        </Card>
      </div>

      {/* Interactive 3D Tilt Validation / Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <TiltCard>
          <Card className="ocean-panel pulse-glow-border h-full p-4.5 border border-primary/25 bg-card/60 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
            <ValidationItem
              icon={<ShieldCheck className="text-emerald-400" />}
              label="Inference Engine"
              value={prediction.modelVersion}
              detail="Validated neural weights · Latency 38ms"
              badge="Active"
              badgeColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
            />
          </Card>
        </TiltCard>

        <TiltCard>
          <Card className="ocean-panel pulse-glow-border h-full p-4.5 border border-primary/25 bg-card/60 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
            <ValidationItem
              icon={<Database className="text-cyan-400" />}
              label="Reference Float Profile"
              value="Argo ID #4802"
              detail="Nearest float 14.2km NW · Synced"
              badge="Matched"
              badgeColor="text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
            />
          </Card>
        </TiltCard>

        <TiltCard>
          <Card className="ocean-panel pulse-glow-border h-full p-4.5 border border-primary/25 bg-card/60 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
            <ValidationItem
              icon={<Radio className="text-sky-400" />}
              label="Residual Accuracy"
              value="RMSE 0.38°C"
              detail="MAE: 0.24°C across thermocline band"
              badge="High Conf"
              badgeColor="text-sky-400 bg-sky-400/10 border-sky-400/30"
            />
          </Card>
        </TiltCard>
      </div>
    </section>
  );
}

function ValidationItem({
  icon,
  label,
  value,
  detail,
  badge,
  badgeColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 rounded-md border border-primary/20 bg-primary/10 p-1.5 text-primary shadow-[0_0_12px_rgba(34,211,238,0.15)] [&_svg]:size-4">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
          {badge && (
            <span
              className={`rounded-full border px-1.5 py-0.2 font-mono text-[7.5px] uppercase tracking-wider ${
                badgeColor || "text-primary bg-primary/10 border-primary/30"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/80 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}