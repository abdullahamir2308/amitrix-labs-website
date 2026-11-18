# Wave 2 — shared brief for all parallel agents

Six agents build Phases 4, 5, 6, 7, 9 and 10 at the same time in this repo. Read this file, CLAUDE.md
(especially "Parallel work rules", "Brand", "Next.js notes" and the Build progress decisions), your phase prompt in
"Amitrix Labs Website — Plan & Claude Code Prompt Pack.md", and docs/design-references/README.md (open the
screenshots it cites for your sections in docs/design-references/shots/ with the Read tool). Treat the references
as inspiration: borrow patterns, never copy layouts/copy/assets one-to-one. Work autonomously; never ask questions.

## What already exists (read the source before using)
- Motion primitives: `@/components/motion` — Reveal, TextReveal, DecodeText, Magnetic, Counter, Marquee, SpotlightCard, CustomCursor.
- UI: `@/components/ui/*` — Button (variants primary/secondary/inverse/ghost/outline/link, withArrow, href), Badge (mono, indigo, cyan, live, beta, soon), Card, Section (tone light|dark, eyebrow, index, title, intro, id…), Container, Eyebrow, plus shadcn accordion, dialog, sheet, navigation-menu, input, textarea, select, label, tabs, tooltip, separator, checkbox.
- `cn` from `@/lib/cn` (knows the fluid type tokens). GSAP: import `gsap`, `ScrollTrigger`, etc. from `@/lib/gsap` (plugins registered there; Lenis is already synced with ScrollTrigger in the providers). Hooks: `src/hooks/` (useReducedMotion, useIsMobile, useMediaQuery).
- Content (server-only): `@/lib/content` (getProducts, getServices, getWork, getFeaturedWork, getPosts, getTestimonials, getClients, getTeam, getJobs, … see file). `@/lib/site` (site config: hero, metrics, why, process, techStack, terminal lines, finalCta, nav, footer, socials, contact). `@/lib/mdx` (<MDXContent code components/>). Images are velite image objects `{src,width,height,blurDataURL}` — spread into next/image.
- Tokens/utilities in globals.css: paper/ink/indigo/cyan/slate/line colours, `.section-dark` (forces ink palette inside a block), `text-display-2xl … text-label` fluid type, `.bg-grid`, `.grain`, `.eyebrow`, glow shadows.
- Logos: `LatticeMark`, `LatticeWordmark`, `LatticeLockup` from `@/components/brand/logos`.

## Shared stubs (typed props already fixed — the owner fills them in; others import them as-is)
- `@/components/sections/page-header` → `PageHeader` — owned by Phase 4.
- `@/components/sections/cta-panel` → `CtaPanel` — owned by Phase 7.
- `@/components/brand/lattice-motif` → `LatticeMotif` — owned by Phase 5.
- Homepage `src/app/page.tsx` is owned by the orchestrator and already composes the section files in
  `src/components/sections/home/*.tsx` (stubs returning null). Replace the stubs you own, keep the export names.

## Conventions
- The root layout (Phase 4) renders `<main id="main">` around page content. Pages must NOT render their own `<main>`.
- Dark sections: wrap in `Section tone="dark"` or add `.section-dark`. Header must stay legible over dark heroes.
- Next 16 + `cacheComponents: true`: read node_modules/next/dist/docs/ (Cache Components, generateStaticParams,
  params as Promise, `use cache`). Don't call `new Date()`/`Math.random()` in server components during prerender
  without the documented pattern. Dynamic `[slug]` routes need `generateStaticParams` + `notFound()`.
- Every animation: reduced-motion fallback, lighter/no pinning under 768px, no layout shift, text present in SSR HTML.
- Need page-specific CSS that Tailwind can't express? Use a CSS module inside your own folder. Don't edit globals.css
  unless you own it (Phase 4 does); request global changes in your report.
- Never invent real-looking clients, metrics or quotes; keep "[Placeholder]" markers from content.

## Testing (do it — screenshots are how you judge quality)
- Shared dev server: http://localhost:3100 (don't start another; restart once with `npx next dev -p 3100` in the background only if it's dead for 30s+).
- DO NOT use the Playwright MCP browser tools (one shared browser — six agents would collide). Use the private
  screenshot script instead, which launches its own headless browser:
  `node "C:\Users\Amir\AppData\Local\Temp\claude\2856c2cc36e73012\327fc112-890b-4cb1-aefb-9db4043f3660\scratchpad\tools\shot.mjs" <url> <out.png> [--width=390] [--dark] [--reduced] [--full] [--scroll=<px>] [--wait=<ms>] [--hover=<selector>]`
  It prints HTTP status, console errors/warnings and horizontal overflow. Save screenshots ONLY under
  `C:\Users\Amir\AppData\Local\Temp\claude\2856c2cc36e73012\327fc112-890b-4cb1-aefb-9db4043f3660\scratchpad\<your phase, e.g. p6>\` and look at them with the Read tool.
  Check: 1440px and 390px, light and dark (`--dark`), reduced motion (`--reduced`), after scrolling (`--scroll`). Zero console errors and zero horizontal overflow.
- `npx tsc --noEmit` and `npx eslint <your paths>`; fix errors in your files only. No `next build`, no npm install, no git.
- Other agents' sections may still be stubs or half-built while you test; that's expected.

## Final report (under 350 words)
Files created/changed; what each piece does; test results (which screenshots you checked, console/overflow results);
decisions; the one-line text to tick your phase in CLAUDE.md "Build progress"; "Requests for other owners".
