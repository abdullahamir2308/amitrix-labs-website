import type Lenis from "lenis";

/**
 * Shared motion constants. Keep durations in the 200–600ms band
 * (CLAUDE.md > Motion rules); long-form reveals may go to ~1s.
 */

/** Cubic-bezier tuples for Motion (`transition.ease`). Mirrors the --ease-* CSS tokens. */
export const EASE = {
  expoOut: [0.16, 1, 0.3, 1],
  quartOut: [0.25, 1, 0.5, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** GSAP ease names matching the tuples above. */
export const GSAP_EASE = {
  expoOut: "expo.out",
  quartOut: "power4.out",
  inOut: "power3.inOut",
} as const;

/** Durations in seconds. */
export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  reveal: 0.9,
} as const;

/** Default spring for cursor-follow / magnetic effects (Motion). */
export const SPRING = { stiffness: 220, damping: 18, mass: 0.4 } as const;

/** Viewport trigger used by reveal-style primitives. */
export const REVEAL_START = "top 85%";

/** Characters used by <DecodeText>. Mono-friendly, no ambiguous whitespace. */
export const DECODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]{}#*+=-_";

export const MEDIA = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
  /** Primary input can hover precisely (mouse / trackpad). */
  finePointer: "(hover: hover) and (pointer: fine)",
  mobile: "(max-width: 767.98px)",
} as const;

// ---------------------------------------------------------------------------
// Lenis singleton (set by <SmoothScroll>, read by anything that needs scrollTo)
// ---------------------------------------------------------------------------

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** The active Lenis instance, or null when smooth scroll is off (reduced motion / touch / SSR). */
export function getLenis() {
  return lenis;
}

/** Scroll to an element, selector or y offset; falls back to native scrolling without Lenis. */
export function scrollToTarget(
  target: string | number | HTMLElement,
  options: { offset?: number; immediate?: boolean } = {},
) {
  if (lenis) {
    lenis.scrollTo(target, { offset: options.offset ?? 0, immediate: options.immediate });
    return;
  }
  if (typeof window === "undefined") return;
  const behavior: ScrollBehavior = options.immediate ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target + (options.offset ?? 0), behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0);
  window.scrollTo({ top, behavior });
}
