import type { ReactNode } from "react"
import Link from "next/link"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/cn"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium tracking-[-0.005em] whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-expo-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** Indigo, the main call to action ("Book a call"). */
        primary:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] hover:shadow-glow-indigo",
        /** Kept for shadcn internals; identical to primary. */
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] hover:shadow-glow-indigo",
        /** Quiet bordered surface ("See our work"). */
        secondary:
          "border-line-strong bg-surface-raised text-foreground shadow-soft hover:border-foreground/25 hover:bg-surface aria-expanded:bg-surface",
        /** Solid ink on paper / paper on ink. */
        inverse:
          "bg-foreground text-background hover:bg-foreground/85",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/60",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "h-auto! px-0! text-highlight underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8125rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        lg: "h-12 gap-2 rounded-xl px-5 text-[0.9375rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xl: "h-14 gap-2.5 rounded-xl px-7 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** Two stacked arrows: the first slides out to the right, the second slides in from the left. */
function ButtonArrow() {
  return (
    <span
      data-icon="inline-end"
      aria-hidden="true"
      className="relative inline-flex size-4 shrink-0 overflow-hidden"
    >
      <ArrowRight className="absolute inset-0 size-4 transition-transform duration-500 ease-expo-out group-hover/button:translate-x-full motion-reduce:transition-none" />
      <ArrowRight className="absolute inset-0 size-4 -translate-x-full transition-transform duration-500 ease-expo-out group-hover/button:translate-x-0 motion-reduce:transition-none" />
    </span>
  )
}

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Append an arrow that slides on hover. */
    withArrow?: boolean
    /** Shortcut: render as a Next.js <Link>. For other elements use `render`. */
    href?: string
    children?: ReactNode
  }

/**
 * Button. As a link: `<Button href="/contact">` or
 * `<Button render={<a href="…" />} nativeButton={false}>`.
 */
function Button({
  className,
  variant = "default",
  size = "default",
  withArrow = false,
  href,
  render,
  nativeButton,
  children,
  ...props
}: ButtonProps) {
  const isLink = href !== undefined
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={isLink ? <Link href={href} /> : render}
      nativeButton={isLink ? false : nativeButton}
      {...props}
    >
      {children}
      {withArrow ? <ButtonArrow /> : null}
    </ButtonPrimitive>
  )
}

export { Button, ButtonArrow, buttonVariants }
export type { ButtonProps }
