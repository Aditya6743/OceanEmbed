import { ArrowDownRight } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type OceanButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function OceanButton({ children, className = "", ...props }: OceanButtonProps) {
  return (
    <button
      className={`group relative inline-flex h-12 items-center justify-center gap-3 rounded-md border border-cyan-400/45 bg-gradient-to-r from-cyan-950/60 via-slate-950/70 to-violet-950/60 px-6 font-mono text-xs font-semibold uppercase text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.25),0_0_45px_rgba(168,85,247,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-violet-400/75 hover:shadow-[0_0_42px_rgba(34,211,238,0.45),0_0_65px_rgba(168,85,247,0.35)] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <ArrowDownRight
          className="size-4 text-cyan-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-violet-300"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}