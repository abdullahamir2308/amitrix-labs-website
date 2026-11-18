"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { INTRO, INTRO_LATE_MS } from "./intro";
import styles from "./hero.module.css";

/**
 * Wraps the hero foreground and runs the entrance as one GSAP timeline.
 * Elements opt in with data-hero-step="badge|sub|cta|stat|cue"; the keyword
 * (data-hero-keyword) gets the light sweep. The H1 itself is never hidden —
 * its words decode in place via <DecodeText> on the same schedule (INTRO).
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia(MEDIA.reducedMotion).matches;
      const late = performance.now() > INTRO_LATE_MS;

      if (reduced || late) {
        root.dataset.intro = "done";
        return;
      }

      const rise = { autoAlpha: 0, y: 14 };
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.8 } });
      tl.from(q("[data-hero-step='badge']"), rise, INTRO.badge)
        .from(q("[data-hero-step='sub']"), rise, INTRO.sub)
        .from(q("[data-hero-step='cta']"), { ...rise, stagger: 0.08 }, INTRO.cta)
        .from(q("[data-hero-step='stat']"), { ...rise, y: 10, stagger: 0.07 }, INTRO.stats)
        .from(q("[data-hero-step='cue']"), { autoAlpha: 0, duration: 0.6 }, INTRO.cue);

      const keyword = q("[data-hero-keyword]");
      if (keyword.length) {
        const sweep = { backgroundPosition: "0% 0%, 0% 0%", duration: 1.2, ease: "power2.inOut" };
        tl.fromTo(keyword, { backgroundPosition: "100% 0%, 0% 0%" }, sweep, INTRO.sweep);
        // A quiet repeat every few seconds keeps the word alive.
        gsap.fromTo(
          keyword,
          { backgroundPosition: "100% 0%, 0% 0%" },
          { ...sweep, delay: INTRO.sweep + 7, repeat: -1, repeatDelay: 7 },
        );
      }

      // from() has already applied the hidden state inline, so the CSS pre-state can go.
      root.dataset.intro = "running";
      tl.eventCallback("onComplete", () => {
        root.dataset.intro = "done";
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={cn(styles.intro, className)}>
      {children}
    </div>
  );
}
