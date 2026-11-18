import type { ReactNode } from "react";
import { PageTransition } from "@/components/layout/page-transition";

// Remounts on every top-level route change, which drives the page transition.
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
