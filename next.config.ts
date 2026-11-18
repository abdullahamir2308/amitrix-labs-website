import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR lets a second production build (e.g. a Lighthouse run) live
  // beside the dev server's output without clobbering it. Defaults to .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // Tailwind v4 runs as a Turbopack loader. CSS Modules must keep their
    // ".module.css" identity (as: "*.module.css"), otherwise Turbopack
    // treats them as global CSS and `import s from "./x.module.css"` is {}.
    rules: {
      "*.css": [
        {
          condition: { path: /\.module\.css$/ },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.module.css",
        },
        {
          condition: { not: { path: /\.module\.css$/ } },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      ],
    },
  },
};

/**
 * Velite (content in /content → typed data in /.velite, imported as "#site/content").
 *
 * Started from here, as Velite's Next.js guide recommends, so `npm run dev` / `npm run build`
 * need no extra process: `next dev` builds once then watches /content; `next build` does a
 * clean, strict build (schema errors fail the build). The env flag stops a second start when
 * Next loads this file more than once in the same process tree.
 */
async function startVelite(dev: boolean) {
  if (process.env.VELITE_STARTED) return;
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  if (dev) {
    try {
      await build({ watch: true, clean: false });
    } catch (error) {
      // Don't take the dev server down for a content typo — log it and keep serving.
      console.error("[velite] content build failed:", error);
    }
  } else {
    await build({ watch: false, clean: true, strict: true });
  }
}

export default async function config(phase: string): Promise<NextConfig> {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    await startVelite(phase === PHASE_DEVELOPMENT_SERVER);
  }
  return nextConfig;
}
