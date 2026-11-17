import Link from "next/link";
import { LatticeLockup } from "@/components/brand/logos";

// Temporary placeholder — the real homepage is built in Phases 5–7.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <LatticeLockup className="h-10 w-auto" />
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Amitrix Labs — coming soon
      </h1>
      <Link
        href="/brand"
        className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {"// View brand starter →"}
      </Link>
    </main>
  );
}
