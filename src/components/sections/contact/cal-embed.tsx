"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The embed script + iframe are heavy: load them only once the booking panel nears the viewport.
const Cal = dynamic(() => import("@calcom/embed-react"), { ssr: false });

/** Cal.com inline booking embed (lazy). Only rendered when the link isn't a placeholder. */
export function CalEmbed({ calLink }: { calLink: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[38rem] w-full overflow-hidden rounded-xl" data-lenis-prevent>
      {visible ? (
        <Cal
          calLink={calLink}
          style={{ width: "100%", height: "100%", minHeight: "38rem", overflow: "auto" }}
          config={{ layout: "month_view" }}
        />
      ) : (
        <div className="flex min-h-[38rem] items-center justify-center font-mono text-label text-muted-foreground">
          Loading calendar…
        </div>
      )}
    </div>
  );
}
