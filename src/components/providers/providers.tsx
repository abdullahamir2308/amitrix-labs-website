"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
// Importing the module registers ScrollTrigger, SplitText, DrawSVG and ScrambleText once.
import "@/lib/gsap";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";
import { SmoothScroll } from "./smooth-scroll";

/** All client-side app providers. Used once, in src/app/layout.tsx. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delay={200}>
          <SmoothScroll />
          {children}
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
