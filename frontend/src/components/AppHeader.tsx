import { Link } from "@tanstack/react-router";
import { ArrowLeft, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AppHeader({ backToGlobe = true }: { backToGlobe?: boolean }) {
  return (
    <header className="dashboard-header flex min-h-16 items-center justify-between gap-4 border-b border-border/70 px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        {backToGlobe && (
          <Button asChild variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary">
            <Link to="/" aria-label="Back to globe"><ArrowLeft /></Link>
          </Button>
        )}
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="OceanEmbed home">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/35 bg-primary/10 text-primary shadow-[0_0_18px_var(--glow-soft)]"><Waves className="size-4" /></span>
          <span className="truncate font-display text-base font-semibold">Ocean<span className="text-primary">Embed</span></span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 font-mono text-[9px] uppercase text-muted-foreground sm:flex">
          <span className="size-1.5 rounded-full bg-status shadow-[0_0_9px_var(--status)]" /> Model {"v1.0"} · Ready
        </div>
        <Badge variant="outline" className="rounded-sm border-border/80 bg-card/45 font-mono text-[9px] font-normal text-muted-foreground">SIH 2026 · PS26066</Badge>
      </div>
    </header>
  );
}