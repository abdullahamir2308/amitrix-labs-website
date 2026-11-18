import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single place where GSAP core + ScrollTrigger are registered. Every module that animates
 * with GSAP imports from here (not from "gsap" directly), so registration is guaranteed to
 * run before the first tween — even in child effects that run before the <Providers> effect.
 *
 * This module is in the shared bundle of every page, so it only carries what the site shell
 * needs. Heavier plugins are registered next to their only users (registration is idempotent):
 *   SplitText          → components/motion/text-reveal.tsx
 *   ScrambleTextPlugin → components/motion/decode-text.tsx
 *   DrawSVGPlugin      → sections/home/process/process-line.tsx, sections/about/story-timeline.tsx
 * Use `registerGsapPlugins(Plugin)` for that.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 0.6 });
  registered = true;
}

/** Register extra GSAP plugins from the module that uses them (client only, idempotent). */
export function registerGsapPlugins(...plugins: object[]) {
  if (typeof window === "undefined") return;
  registerGsap();
  gsap.registerPlugin(...plugins);
}

registerGsap();

export { gsap, useGSAP, ScrollTrigger };
