/**
 * Tiny client-side event hub for the site shell: the progress bar listens for
 * navigation start/end, and the header re-reads its tone after a route change.
 */

export const ROUTE_CHANGE_EVENT = "amitrix:route-change";

type ProgressListener = (state: "start" | "done") => void;
const listeners = new Set<ProgressListener>();

export function onProgress(listener: ProgressListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function startProgress() {
  listeners.forEach((l) => l("start"));
}

export function doneProgress() {
  listeners.forEach((l) => l("done"));
}

/** Locks page scroll (Lenis + native) and returns the unlock function. */
export function lockScroll(lenis: { stop(): void; start(): void } | null) {
  const html = document.documentElement;
  const prevOverflow = html.style.overflow;
  const scrollbar = window.innerWidth - html.clientWidth;
  const prevPadding = document.body.style.paddingRight;
  lenis?.stop();
  html.style.overflow = "hidden";
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  return () => {
    html.style.overflow = prevOverflow;
    document.body.style.paddingRight = prevPadding;
    lenis?.start();
  };
}
