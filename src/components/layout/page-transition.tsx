"use client";

import { ViewTransition, useEffect, useRef, type ReactNode } from "react";
import { animate } from "motion/react";
import { EASE, MEDIA } from "@/lib/motion";

/** False until the first page has mounted, so the initial load never animates. */
let hasMounted = false;

/**
 * Route transition, mounted by app/template.tsx (which remounts per top-level route).
 * Browsers with the View Transitions API get a React <ViewTransition> enter/exit
 * (CSS in globals.css: quick fade + slight upward slide). Others get the same motion
 * from Motion on the incoming page. Inline styles are cleared afterwards so no
 * transform is left on the wrapper (it would break position:fixed / GSAP pinning).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!hasMounted) {
      hasMounted = true;
      return;
    }
    const el = ref.current;
    if (!el || "startViewTransition" in document || window.matchMedia(MEDIA.reducedMotion).matches) return;
    const controls = animate(el, { opacity: [0, 1], y: [14, 0] }, { duration: 0.45, ease: EASE.expoOut });
    controls.then(() => {
      el.style.removeProperty("opacity");
      el.style.removeProperty("transform");
    });
    return () => controls.stop();
  }, []);

  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div ref={ref} data-page="" className="flex flex-1 flex-col">
        {children}
      </div>
    </ViewTransition>
  );
}
