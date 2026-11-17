import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

/**
 * Single place where GSAP plugins are registered. Every module that animates
 * with GSAP imports from here (not from "gsap" directly), so registration is
 * guaranteed to run before the first tween — even in child effects that run
 * before the <Providers> effect.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin);
  gsap.defaults({ ease: "expo.out", duration: 0.6 });
  registered = true;
}

registerGsap();

export { gsap, useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin };
