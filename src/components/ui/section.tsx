import { useId, type ComponentProps, type ReactNode } from "react"
import { cn } from "@/lib/cn"
import { Container, type ContainerSize } from "./container"
import { Eyebrow } from "./eyebrow"

const SPACING = {
  sm: "py-section-sm",
  default: "py-section",
  lg: "py-section-lg",
  none: "",
} as const

type SectionProps = Omit<ComponentProps<"section">, "title"> & {
  /** "light" follows the site theme; "dark" forces the ink palette (hybrid look). */
  tone?: "light" | "dark"
  /** Eyebrow label text, e.g. "Services". */
  eyebrow?: ReactNode
  /** Eyebrow number, e.g. "01". */
  index?: string | number
  title?: ReactNode
  intro?: ReactNode
  /** Heading level for the title. Default h2. */
  headingAs?: "h1" | "h2" | "h3"
  align?: "start" | "center"
  /** Vertical rhythm. */
  spacing?: keyof typeof SPACING
  /** Container width; `false` renders children without a Container. */
  container?: ContainerSize | false
  /** Fine grid background, faded at the edges. */
  grid?: boolean
  /** Slot rendered to the right of the header on wide screens (e.g. a CTA). */
  actions?: ReactNode
  headerClassName?: string
}

/**
 * Page section with consistent rhythm and an optional header
 * (eyebrow, title, intro). Server component.
 */
function Section({
  tone = "light",
  eyebrow,
  index,
  title,
  intro,
  headingAs: Heading = "h2",
  align = "start",
  spacing = "default",
  container = "default",
  grid = false,
  actions,
  id,
  className,
  headerClassName,
  children,
  ...props
}: SectionProps) {
  const autoId = useId()
  const headingId = title ? `${id ?? autoId}-title` : undefined
  const hasHeader = Boolean(eyebrow || title || intro || actions)
  const centered = align === "center"

  const header = hasHeader ? (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        centered && "items-center text-center md:flex-col md:items-center",
        children ? "mb-12 md:mb-16" : undefined,
        headerClassName
      )}
    >
      <div className={cn("flex max-w-3xl flex-col gap-5", centered && "items-center")}>
        {eyebrow ? <Eyebrow index={index}>{eyebrow}</Eyebrow> : null}
        {title ? (
          <Heading id={headingId} className="text-display-md text-foreground">
            {title}
          </Heading>
        ) : null}
        {intro ? (
          <div className="max-w-2xl text-body-lg text-muted-foreground">{intro}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-3">{actions}</div> : null}
    </div>
  ) : null

  const body = (
    <>
      {header}
      {children}
    </>
  )

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-slot="section"
      data-tone={tone}
      className={cn(
        "relative isolate",
        tone === "dark" ? "section-dark" : "bg-background text-foreground",
        SPACING[spacing],
        className
      )}
      {...props}
    >
      {grid ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial"
        />
      ) : null}
      {container === false ? body : <Container size={container}>{body}</Container>}
    </section>
  )
}

export { Section }
export type { SectionProps }
