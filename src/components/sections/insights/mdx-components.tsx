import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { Hash, Info, Lightbulb, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/** h2/h3/h4 with a hover/focus "#" anchor link (ids come from rehype-slug). */
function anchored(Tag: "h2" | "h3" | "h4") {
  function AnchoredHeading({ id, children, className, ...props }: ComponentProps<"h2">) {
    if (!id) return <Tag className={className} {...props}>{children}</Tag>;
    return (
      <Tag id={id} className={cn("group/heading relative", className)} {...props}>
        {children}
        <a
          href={`#${id}`}
          data-heading-anchor=""
          className="ml-2 inline-flex translate-y-[-0.08em] items-center align-middle text-muted-foreground opacity-0 transition-opacity duration-200 group-hover/heading:opacity-100 hover:text-highlight focus-visible:opacity-100 [@media(hover:none)]:hidden"
        >
          <Hash aria-hidden="true" className="size-[0.75em]" />
          <span className="sr-only">Link to this section</span>
        </a>
      </Tag>
    );
  }
  return AnchoredHeading;
}

/** Markdown images → next/image (local files in /public). Optional title becomes a caption. */
function MdxImage({ src, alt = "", title, width, height }: ComponentProps<"img">) {
  if (typeof src !== "string" || !src) return null;
  const w = Number(width) || 1200;
  const h = Number(height) || 675;
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes="(min-width: 768px) 68ch, 100vw"
        className="h-auto w-full rounded-xl border border-line"
      />
      {title ? <figcaption className="mt-3 text-center text-caption text-muted-foreground">{title}</figcaption> : null}
    </figure>
  );
}

const CALLOUTS: Record<string, { icon: LucideIcon; label: string; className: string }> = {
  note: { icon: Info, label: "Note", className: "border-indigo/30 bg-indigo/[0.06] [--callout:var(--highlight)]" },
  tip: { icon: Lightbulb, label: "Tip", className: "border-cyan/35 bg-cyan/[0.07] [--callout:var(--signal)]" },
  warning: { icon: TriangleAlert, label: "Warning", className: "border-warning/35 bg-warning/[0.07] [--callout:var(--warning)]" },
};

/** <Callout type="note|tip|warning" title="…">…</Callout> in MDX. */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "tip" | "warning";
  title?: string;
  children: ReactNode;
}) {
  const c = CALLOUTS[type] ?? CALLOUTS.note;
  const Icon = c.icon;
  return (
    <aside className={cn("my-8 flex gap-4 rounded-xl border p-5 text-[0.95em] leading-relaxed", c.className)}>
      <Icon aria-hidden="true" className="mt-1 size-4.5 shrink-0 text-(--callout)" />
      <div className="min-w-0 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        <p className="mb-1 font-mono text-label text-(--callout)">{title ?? c.label}</p>
        {children}
      </div>
    </aside>
  );
}

export const articleMdxComponents: MDXComponents = {
  h2: anchored("h2"),
  h3: anchored("h3"),
  h4: anchored("h4"),
  img: MdxImage,
  Callout,
  Image,
};
