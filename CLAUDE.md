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

## Environment notes
- Windows 11, Node 24, npm 11, Git 2.53. Shell: PowerShell (Git Bash also available).
- Use npm (not pnpm/yarn).
- Commit to git after each phase with a clear message (local commits only; pushing happens in Phase 12).

## Build progress
Update this list at the end of every phase (one line each: what was done + any decision taken).

- [x] Phase 1 — CLAUDE.md brief written.
- [ ] Phase 2 — Brand starter (/brand page, logo concepts, palettes)
- [ ] Phase 3 — Design system + motion foundation (/playground)
- [ ] Phase 4 — Site shell (header, footer, transitions, placeholder routes)
- [ ] Phase 5 — Homepage hero (3D lattice)
- [ ] Phase 6 — Homepage sections A (light)
- [ ] Phase 7 — Homepage sections B (dark + story)
- [ ] Phase 8 — Content system (Velite)
- [ ] Phase 9 — Products, Services, Work pages
- [ ] Phase 10 — About, Insights, Careers, Contact, legal
- [ ] Phase 11 — SEO, performance, accessibility pass
- [ ] Phase 12 — Launch (needs the owner: GitHub, Vercel, DNS)
