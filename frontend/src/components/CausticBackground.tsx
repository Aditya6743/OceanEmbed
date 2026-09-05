import { useEffect, useRef } from "react";

interface CausticBackgroundProps {
  className?: string;
  opacity?: number;
}

export function CausticBackground({ className = "", opacity = 0.08 }: CausticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Mouse coordinates with smoothing
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 40;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const resize = () => {
      // Use half resolution for high performance while maintaining silky smooth visual look with blur
      const scale = window.devicePixelRatio > 1 ? 0.75 : 0.6;
      width = Math.ceil(window.innerWidth * scale);
      height = Math.ceil(window.innerHeight * scale);
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Caustic rendering loop using dual wave interference
    const render = () => {
      time += 0.007;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // We draw caustics with multiple organic sine bands in cyan/teal
      const step = 6;
      const nx = Math.floor(width / step);
      const ny = Math.floor(height / step);

      ctx.fillStyle = "rgba(34, 211, 238, 0.45)"; // cyan-400
      ctx.beginPath();

      const offsetX = mouseX * 0.5;
      const offsetY = mouseY * 0.5;

      // Draw caustic wave ribbons
      for (let y = 0; y < ny; y += 2) {
        const py = y * step;
        const wave1 = Math.sin(py * 0.02 + time * 1.2) * 18;
        const wave2 = Math.cos(py * 0.015 - time * 0.9) * 14;

        for (let x = 0; x < nx; x += 3) {
          const px = x * step;
          const val =
            Math.sin(px * 0.025 + wave1 * 0.08 + time * 0.8 + offsetX * 0.02) *
            Math.cos(py * 0.025 + wave2 * 0.08 - time * 0.7 + offsetY * 0.02) *
            Math.sin((px + py) * 0.015 + time);

          if (val > 0.42) {
            const intensity = (val - 0.42) / 0.58;
            const r = step * (0.8 + intensity * 1.4);
            ctx.moveTo(px + r, py);
            ctx.arc(px, py, r, 0, Math.PI * 2);
          }
        }
      }

      ctx.fill();

      // Second layer: softer larger ambient light spots
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)"; // sky-400
      ctx.beginPath();
      for (let y = 1; y < ny; y += 4) {
        const py = y * step;
        for (let x = 1; x < nx; x += 5) {
          const px = x * step;
          const val2 =
            Math.cos(px * 0.018 - time * 0.6 + offsetX * 0.03) *
            Math.sin(py * 0.018 + time * 0.7 + offsetY * 0.03);

          if (val2 > 0.5) {
            const r = step * 1.8;
            ctx.moveTo(px + r, py);
            ctx.arc(px, py, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full filter blur-[14px]"
        style={{
          transform: "scale(1.08)",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
