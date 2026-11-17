import { ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Magnetic } from "@/components/motion";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/cn";

/** One panel of base UI. Rendered twice: following the site theme, and forced dark. */
export function ComponentPanel({ tone }: { tone: "light" | "dark" }) {
  return (
    <div
      data-theme-section={tone === "dark" ? "dark" : undefined}
      className={cn(
        "relative flex flex-col gap-10 overflow-hidden rounded-3xl border border-line p-6 sm:p-10",
        tone === "light" && "bg-background",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-label text-muted-foreground">
          {tone === "dark" ? "tone=dark · forced ink" : "tone=light · follows theme"}
        </span>
        <ThemeToggle />
      </div>

      <Group title="Buttons · variants">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md">
            Primary
          </Button>
          <Button variant="secondary" size="md">
            Secondary
          </Button>
          <Button variant="ghost" size="md">
            Ghost
          </Button>
          <Button variant="inverse" size="md">
            Inverse
          </Button>
          <Button variant="outline" size="md">
            Outline
          </Button>
          <Button variant="link">Link</Button>
        </div>
      </Group>

      <Group title="Buttons · sizes, arrow, as link">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" withArrow>
            Small
          </Button>
          <Button variant="primary" size="md" withArrow>
            Medium
          </Button>
          <Button variant="primary" size="lg" withArrow>
            Large
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Magnetic>
            <Button href="/playground#motion" variant="primary" size="xl" withArrow>
              Book a call
            </Button>
          </Magnetic>
          <Button href="/playground#components" variant="secondary" size="xl" withArrow>
            See our work
          </Button>
          <Button variant="secondary" size="icon-lg" aria-label="Sparkle">
            <Sparkles />
          </Button>
          <Button variant="primary" size="md" disabled>
            Disabled
          </Button>
        </div>
      </Group>

      <Group title="Badges">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="live">Live</Badge>
          <Badge variant="beta">Beta</Badge>
          <Badge variant="soon">Soon</Badge>
          <Badge variant="mono">Next.js</Badge>
          <Badge variant="mono">AI agents</Badge>
          <Badge variant="indigo">Indigo</Badge>
          <Badge variant="cyan">Cyan</Badge>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Group>

      <Group title="Cards">
        <div className="grid gap-4 md:grid-cols-2">
          <Card size="lg" interactive>
            <CardHeader>
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="beta">Beta</Badge>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-500 ease-expo-out group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
              </div>
              <CardTitle>[Placeholder] Product name</CardTitle>
              <CardDescription>
                One-line description of what the product does and who it is for.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              <Badge variant="mono">TypeScript</Badge>
              <Badge variant="mono">LLM</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Eyebrow index="02">Service</Eyebrow>
              <CardTitle className="mt-2">Default card</CardTitle>
              <CardDescription>Stock shadcn/ui card on the new tokens.</CardDescription>
            </CardHeader>
            <CardContent className="text-body-sm text-muted-foreground">
              Ring uses <code className="font-mono text-foreground">--line</code>, surface uses{" "}
              <code className="font-mono text-foreground">--card</code>.
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-label text-muted-foreground">Footer</span>
              <Button variant="ghost" size="sm" withArrow>
                Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Group>
    </div>
  );
}

export function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-label text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
