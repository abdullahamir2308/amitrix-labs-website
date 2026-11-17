# CLAUDE.md — Amitrix Labs website

This is the brief for every session that works on this repo. Read it first. The full plan and the 12 phase prompts are in `Amitrix Labs Website — Plan & Claude Code Prompt Pack.md` at the project root.

## Company
- Amitrix Labs builds its own software products AND delivers custom software + AI services to clients in every industry.
- Positioning line (draft): "We build software and AI that actually ships."
- Primary CTA everywhere: "Book a call". Secondary: "See our work".
- Domain: amitrixlabs.com

## Audience
- Founders, operators and teams in any industry who need custom software, AI agents and automation, web/SaaS platforms or mobile apps.
- Visitors evaluating our own products.

## Design direction
- Hybrid: light base (Paper #FAFAF9, Ink #0A0A12) for service and company pages; dark "ink" sections for the hero, products and AI work. Dark-mode toggle site-wide.
- Primary Indigo #5B4CF5, signal Cyan #22D3EE, Slate #64748B. Line #E5E7EB (light) / #1F2030 (dark).
- Type: Geist Sans (headlines, body), Geist Mono (uppercase labels, numbers, code).
- Feel: tech, precise, premium, high-end motion. Fine grid background, subtle grain, mono eyebrow labels like "// 01 — SERVICES".
- Quality bar: linear.app, vercel.com, stripe.com.

## Brand
- Chosen (default, applied in Phase 2 while the owner was unavailable): logo concept #1 "Lattice A" + palette "Lab (default)". Review all options at /brand (hidden page, noindex).
- Logo files: public/brand/amitrix-{mark,wordmark,lockup}-{light,dark}.svg. "-light" = for light backgrounds (ink artwork), "-dark" = for dark backgrounds (paper artwork). Wordmarks are outlined Geist paths (no font dependency).
- Icons: src/app/icon.svg (follows prefers-color-scheme), src/app/favicon.ico (16/32/48/64, mark on ink tile), src/app/apple-icon.png (180x180, mark on ink).
- In code: `LatticeMark`, `LatticeWordmark`, `LatticeLockup` from src/components/brand/logos.tsx (currentColor-based). Mark geometry lives in src/components/brand/lattice-mark.json; palettes in src/components/brand/tokens.ts; colour tokens in src/app/globals.css.
- Regenerate exported SVGs/icons and wordmark outlines with `npm run brand:assets` (scripts/brand-assets.mjs).
- To swap, the owner says: "I pick logo concept #n and palette X" (concepts: 1 Lattice A, 2 Grid A, 3 Hex network, 4 Mono AL; palettes: Lab (default), Warm, Electric). Then update the script, public/brand files, icons, globals.css tokens and this section.

## Motion rules
- One hero moment per page; scroll-driven storytelling; 200–600ms, spring/expo easing.
- Libraries: Motion (UI), GSAP + ScrollTrigger + SplitText + DrawSVG (scroll), Lenis (smooth scroll), React Three Fiber (3D hero).
- Always respect prefers-reduced-motion with a static fallback. Lighter effects under 768px. Lazy-load 3D; never block LCP.

## Tech stack
Next.js latest (App Router, TypeScript, src/ dir), Tailwind CSS v4, shadcn/ui, Velite for MDX/JSON content in /content, Resend + React Email for the contact form, Cal.com embed for booking, Vercel Analytics, deploy on Vercel.

## Sitemap
Home, Products (index + [slug]), Services (index + [slug]), Work (index + [slug] case studies), About, Insights (blog index + [slug]), Careers, Contact, Privacy, Terms, 404.

## Content rules
- All content lives in /content, loaded through Velite. Never hard-code copy that belongs in content.
- Until real content exists, use clearly marked placeholders ("[Placeholder] ..."). Never invent client names, metrics or testimonials presented as real.

## Code rules
- Small reusable components: sections in src/components/sections, motion primitives in src/components/motion.
- Accessibility: semantic HTML, keyboard focus states, alt text, WCAG AA contrast.
- Performance budget: Lighthouse 90+ on mobile, LCP < 2.5s, no layout shift from animations.
- After each phase: run build + lint, fix errors, and summarise what changed in plain English.

## Next.js notes
- Next.js 16 with Cache Components + Partial Prefetching enabled (next.config.ts). APIs differ from older versions: read AGENTS.md and the bundled docs in node_modules/next/dist/docs/ before writing Next-specific code.
- Fonts come from the `geist` package (next/font/local, self-hosted), not Google Fonts.

## Environment notes
- Windows 11, Node 24, npm 11, Git 2.53. Shell: PowerShell (Git Bash also available).
- Use npm (not pnpm/yarn).
- Commit to git after each phase with a clear message (local commits only; pushing happens in Phase 12).

## Build progress
Update this list at the end of every phase (one line each: what was done + any decision taken).

- [x] Phase 1 — CLAUDE.md brief written.
- [x] Phase 2 — Brand starter: Next.js 16 + Tailwind v4 + shadcn/ui (base-nova, neutral) scaffolded; hidden /brand page with 4 logo concepts, 3 palettes, type and component samples; default choice applied (concept #1 Lattice A, palette Lab) with logo SVGs, favicons and Lab tokens.
- [x] Phase 3 — Design system + motion foundation: Tailwind v4 tokens (light/dark + .section-dark, fluid clamp type scale, glow shadows, section/gutter spacing), next-themes toggle, Providers (GSAP plugins, Lenis+ScrollTrigger, MotionConfig, Tooltip), 8 motion primitives with reduced-motion fallbacks, Button/Badge/Card/Section/Container/Eyebrow, /playground (noindex). Decision: use cn from @/lib/cn (knows custom type tokens); import gsap from @/lib/gsap (plugins registered there).
- [ ] Phase 4 — Site shell (header, footer, transitions, placeholder routes)
- [ ] Phase 5 — Homepage hero (3D lattice)
- [ ] Phase 6 — Homepage sections A (light)
- [ ] Phase 7 — Homepage sections B (dark + story)
- [x] Phase 8 — Content system (done early, in Wave 1): Velite started from next.config (dev watch / strict build), 8 typed collections, placeholder content + SVGs, src/lib/{content,mdx,site}.ts, content/README.md; images via s.image(absoluteRoot "public"). Pages import only from @/lib/content, @/lib/mdx, @/lib/site.
- [ ] Phase 9 — Products, Services, Work pages
- [ ] Phase 10 — About, Insights, Careers, Contact, legal
- [ ] Phase 11 — SEO, performance, accessibility pass
- [ ] Phase 12 — Launch (needs the owner: GitHub, Vercel, DNS)

## Parallel work rules (multi-agent build)
Several agents work in this repo at the same time. Each agent is given a list of files/folders it OWNS.
- Only create or edit files you own. If you need a change in a file you don't own, don't make it: put it under "Requests for other owners" in your final report.
- Do NOT run `npm install` / `npx shadcn add` / anything that changes package.json or node_modules. All packages are pre-installed (motion, gsap, @gsap/react, lenis, three, @react-three/fiber, @react-three/drei, velite, zod, resend, @react-email/components, @calcom/embed-react, @vercel/analytics, @vercel/speed-insights, next-themes, rehype-pretty-code, shiki, rehype-slug, schema-dts, shadcn ui components in src/components/ui). If something is truly missing, report it.
- Do NOT run `next build`, `npm run build`, or start another `next dev`. A shared dev server runs at http://localhost:3100 (port 3000 is taken by Docker). Test against it with curl / Playwright. If it is down (no response for 30s+), restart it once with `npx next dev -p 3100` in the background.
- Check your work with `npx tsc --noEmit` and `npx eslint <your files>`. Fix errors in YOUR files only; ignore errors in files other agents are still writing.
- Do NOT run git commands that change state (add/commit/checkout/stash/reset). The orchestrator commits after each wave.
- Do not edit CLAUDE.md except where your task says so; report CLAUDE.md updates in your final report instead.
