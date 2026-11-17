"use client";

import { MEDIA } from "@/lib/motion";
import { useMediaQuery } from "./use-media-query";

/** True when the user asked the OS for reduced motion. False on the server. */
export function useReducedMotion(): boolean {
  return useMediaQuery(MEDIA.reducedMotion);
}

/** True when the primary pointer is a precise, hover-capable device (mouse/trackpad). */
export function useFinePointer(): boolean {
  return useMediaQuery(MEDIA.finePointer);
}
