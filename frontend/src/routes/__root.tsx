import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PredictionProvider } from "@/lib/prediction-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#050B14" },
      { title: "OceanEmbed — Subsurface Ocean Intelligence" },
      {
        name: "description",
        content:
          "OceanEmbed — Subsurface Ocean Intelligence. Reconstructing Subsurface Ocean Temperature from Satellite Data.",
      },
      { name: "author", content: "OceanEmbed Team" },
      { property: "og:title", content: "OceanEmbed — Subsurface Ocean Intelligence" },
      {
        property: "og:description",
        content:
          "Reconstructing Subsurface Ocean Temperature from Satellite Observations with Graph Machine Learning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "OceanEmbed — Subsurface Ocean Intelligence" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark bg-[#050B14] text-foreground">
      <head>
        <HeadContent />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background-color: #050B14 !important;
                color: #f1f5f9;
                margin: 0;
                padding: 0;
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#050B14] text-foreground min-h-screen antialiased selection:bg-cyan-500/25 selection:text-cyan-200">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <PredictionProvider>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.992 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-screen flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        {/* Global Tasteful Corner Attribution */}
        <footer
          className="pointer-events-none fixed bottom-2.5 right-3 z-50 flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-950/75 px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-cyan-300/80 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          aria-label="Competition attribution"
        >
          <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
          <span>SIH 2026 · PS26066 · OceanEmbed</span>
        </footer>
      </PredictionProvider>
    </QueryClientProvider>
  );
}
