"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/cn";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const item =
  "inline-flex size-9 items-center justify-center rounded-lg border border-line-strong bg-surface-raised text-muted-foreground transition-colors duration-200 hover:border-foreground/30 hover:text-foreground";

/** Share on X / LinkedIn + copy link. `url` is the absolute canonical URL (no window needed for SSR). */
export function ShareLinks({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const enc = encodeURIComponent;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="font-mono text-label text-muted-foreground">Share</p>
      <ul className="flex gap-2">
        <li>
          <a className={item} href={`https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer">
            <XIcon />
            <span className="sr-only">Share on X</span>
          </a>
        </li>
        <li>
          <a
            className={item}
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            <span className="sr-only">Share on LinkedIn</span>
          </a>
        </li>
        <li>
          <button type="button" onClick={copy} className={cn(item, copied && "border-success/40 text-success hover:text-success")}>
            {copied ? <Check aria-hidden="true" className="size-4" /> : <Link2 aria-hidden="true" className="size-4" />}
            <span className="sr-only">{copied ? "Link copied" : "Copy link"}</span>
          </button>
        </li>
      </ul>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
