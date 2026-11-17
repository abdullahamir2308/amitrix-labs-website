import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        /** Mono uppercase tag, e.g. tech stack or category. */
        mono: "h-6 rounded-md border-line-strong bg-surface-raised px-2 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase",
        /** Indigo tint. */
        indigo:
          "border-indigo/25 bg-indigo/10 text-highlight",
        /** Cyan tint. */
        cyan: "border-cyan/30 bg-cyan/10 text-signal",
        /** Product status: shipped and running. Pulsing dot. */
        live: "h-6 gap-1.5 rounded-md border-success/30 bg-success/10 px-2 font-mono text-[0.6875rem] tracking-[0.12em] text-success uppercase before:size-1.5 before:rounded-full before:bg-current before:shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_25%,transparent)] before:content-[''] motion-safe:before:animate-pulse",
        /** Product status: usable, still changing. */
        beta: "h-6 gap-1.5 rounded-md border-indigo/30 bg-indigo/10 px-2 font-mono text-[0.6875rem] tracking-[0.12em] text-highlight uppercase before:size-1.5 before:rounded-full before:bg-current before:content-['']",
        /** Product status: announced, not available yet. */
        soon: "h-6 gap-1.5 rounded-md border-dashed border-line-strong px-2 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase before:size-1.5 before:rounded-full before:border before:border-current before:content-['']",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
