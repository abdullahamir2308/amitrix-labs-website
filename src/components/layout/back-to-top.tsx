"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/lib/motion";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTarget(0, { immediate: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className="group/top inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      Back to top
      <ArrowUp
        aria-hidden="true"
        className="size-3.5 transition-transform duration-300 ease-expo-out group-hover/top:-translate-y-0.5"
      />
    </button>
  );
}
