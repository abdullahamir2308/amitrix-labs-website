import Link from "next/link";
import { cn } from "@/lib/cn";

/** "● Booking open" lab-status pill (links to /contact). */
export function BookingStatus({ className }: { className?: string }) {
  return (
    <Link
      href="/contact"
      className={cn(
        "group/status inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface-raised/60 px-3 font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-muted-foreground uppercase transition-colors duration-200 hover:text-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-success opacity-60 motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-success" />
      </span>
      Booking open
    </Link>
  );
}
