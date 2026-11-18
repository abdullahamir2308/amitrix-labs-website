"use client";

import { scrollToTarget } from "@/lib/motion";

/** First focusable element on every page: jumps keyboard users past the header to <main>. */
export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        const main = document.getElementById("main");
        if (!main) return;
        event.preventDefault();
        scrollToTarget(main, { immediate: true });
        main.focus({ preventScroll: true });
      }}
      className="fixed top-3 left-3 z-[80] -translate-y-[200%] rounded-lg bg-indigo px-4 py-2.5 text-sm font-medium text-white shadow-glow-indigo transition-transform duration-200 focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
