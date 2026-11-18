/**
 * Entrance schedule (seconds from hydration), shared by the GSAP timeline in
 * <HeroIntro> and the delays passed to <DecodeText> / <Counter>, so the whole
 * sequence reads as one ~1.6s timeline:
 * grid fades in (CSS) → lattice draws (its own 1.5s draw-in) → badge →
 * headline decodes → sub-line + buttons rise → stats count up → keyword sweep.
 */
export const INTRO = {
  badge: 0.1,
  headline: 0.22,
  wordStagger: 0.055,
  wordDuration: 0.7,
  sub: 0.7,
  cta: 0.8,
  stats: 1.0,
  counter: 1.05,
  sweep: 1.25,
  cue: 1.4,
} as const;

/** If hydration happens later than this (ms after navigation start), skip the rise animations. */
export const INTRO_LATE_MS = 2400;
