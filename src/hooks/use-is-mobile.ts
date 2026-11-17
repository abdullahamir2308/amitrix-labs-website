"use client";

import { useMediaQuery } from "./use-media-query";

/** True below `breakpoint` px (default 768, the "lighter effects" threshold). False on the server. */
export function useIsMobile(breakpoint = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 0.02}px)`);
}
