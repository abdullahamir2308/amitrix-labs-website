"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
// Importing the module registers ScrollTrigger once (SplitText / DrawSVG / ScrambleText are
// registered by the few components that use them, so they stay out of the shared bundle).
import "@/lib/gsap";
import { ThemeProvider } from "./theme-provider";
import { SmoothScroll } from "./smooth-scroll";

/**
 * All client-side app providers. Used once, in src/app/layout.tsx.
 * No global TooltipProvider: nothing uses tooltips yet, and Base UI's tooltip + Floating UI
 * would ship on every page. Wrap the subtree in <TooltipProvider> where tooltips are added.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
