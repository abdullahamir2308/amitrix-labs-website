# Design references: patterns to borrow

Captured 2026-11-17 from 10 sites: linear.app, vercel.com, stripe.com, raycast.com, resend.com, supabase.com, cursor.com, framer.com, basement.studio, lusion.co.
Captures are at 1440×900 desktop (`<site>_dNN.jpg`, one per 800px of scroll) and 390px mobile (`<site>_m00/m01.jpg`). There are contact sheets per site (`sheet_d_<site>.jpg`, plus `sheet_m_ALL.jpg` for mobile) and scroll recordings in `shots/videos/*.webm`.
**Use these for inspiration only.** Borrow the pattern and the level of craft, and build it with our own lattice, indigo/cyan, Geist and mono-label language. Never copy a layout, copy, logo or asset one-to-one. The `shots/` folder is third-party material and must stay out of git.

## Measured baselines (computed styles)

| | Linear | Vercel | Resend | Stripe | Raycast | Supabase |
|---|---|---|---|---|---|---|
| H1 | 64px / 510 / -0.022em / lh 1.0 | 64px / 400 / **-0.06em** (Geist) | 96px serif / 400 | 48px / 300 | 64px / 600 | 46px / 500 |
| H2 | 48px / -0.022em | 56px / 450 / -0.06em | 56px / -0.05em / lh 1.2 | 32–56px / 300 | — | — |
| Header height | 73px, transparent + `backdrop-filter: blur(20px)` | 64px | 58px | 76px | — | — |
| Primary button | — | 40px high, radius 8, padding 0 14, 150ms `cubic-bezier(.4,0,.2,1)` | — | 48px, radius 4, 300ms `cubic-bezier(.25,1,.5,1)` | 36px, radius 8 | 38px, radius 9, 200ms `cubic-bezier(.22,1,.36,1)` |
| Section padding | 128px top and bottom | — | 96px top and bottom | — | — | — |
| Content width | ~1280px | ~1390px | ~1230px | ~1020px | — | ~1090px |

**What this means for us:**
- **Headings:** Geist display at weight 400–500 with negative tracking. Use -0.04em for display-2xl/xl, -0.03em for H2 and -0.01em for body-lg. Line-height 1.0–1.05 for display, 1.1 for H2.
- **Section rhythm:** 128px on desktop, 96px on tablet, 64–72px on mobile.
- **Container:** 1200–1280px.
- **Buttons:** 40px high (44px for the hero), radius 8–10px.
- **Default UI easing:** `cubic-bezier(.22,1,.36,1)` (expo-out), at 150–200ms for hovers and 300–600ms for reveals.

## By section

### Header, nav and mega menu
- **Glass-on-scroll bar** (`linear_app_d01`–`d12`): transparent over the hero, then `background: color-mix(in oklab, var(--ink) 70%, transparent)` with `backdrop-filter: blur(20px) saturate(140%)` and a 1px bottom hairline once scrolled. Nav links are 13–14px in muted tone, turning to full foreground on hover with no underline. The "Sign up" pill is small: 32px, inverted colours.
- **Compact right cluster** (`vercel_com_d00`, `resend_com_d00`): ghost link + small solid button. For us: theme toggle (icon only), "Book a call" magnetic, 36–40px.
- **Mega menu** (behaviour inferred from Stripe's and Resend's chevron menus): one shared panel that animates its height and width between items, so separate dropdowns don't pop in and out. Content cross-fades in 150ms. Each item gets an icon tile, a title and one muted description line, plus one featured card on the right.
- **Mobile:** full-screen sheet with large 28–32px links, staggered 40ms apart, and the CTA pinned at the bottom.

### Hero (dark, lattice)
- **Left-aligned headline over a quiet field** (`linear_app_d00`, `framer_com_d00`, `resend_com_d00`): 64–80px headline in 2–3 short lines, a 16–18px muted sub-line at most 52ch wide, and two buttons. Contrast comes from a single luminous object (Resend's 3D cube at right, Raycast's red glass streaks in `raycast_com_d00`). For us, the lattice should *be* that object: dense near the right or centre, fading to ink at the edges with a radial mask, so the headline sits on calm ink.
- **Small pill above the headline** (`resend_com_d00` "What you missed at…", `framer_com_d00`): 28px high, 1px border at white/10, 12px mono text and an arrow. Matches our `// NEW —` badge.
- **Product glimpse below the fold line** (`linear_app_d00`, `cursor_com_d00`): the top of a UI frame peeks in at the bottom of the viewport, inviting the scroll. We can do this with the stats strip.
- **Mobile** (`sheet_m_ALL`: linear/raycast/resend m00): the headline drops to 40–44px, the CTA goes full width, and the 3D becomes a cropped still. Raycast keeps its hero art on mobile as a static image, which supports our 2D-canvas/WebP fallback.

### Trust marquee
- **Muted monochrome logos, one row, generous air** (`linear_app_d01`, `vercel_com_d00`, `stripe_com_d00`): logos at about 60% opacity, 24–28px cap height, with a tiny mono caption under or over the row (Linear: "POWERING THE COMPANIES BUILDING THE FUTURE" in 10px mono). We can use the same caption device with our eyebrow style.
- **Hairline grid cells** (`basement_studio_d01`, `cursor_com_d01`): each logo sits in a cell with 1px borders, which is very "lab". Use this as the static or reduced-motion fallback, and for mobile (a 2×4 grid).
- **Edge fade:** the marquee should fade out at both ends with a mask (`mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)`).

### Services bento
- **Bordered tiles with live UI inside** (`supabase_com_d00`–`d01`, `framer_com_d08`, `resend_com_d04`): each tile has a top-left icon and title, a 2-line muted description, and a small real-looking UI fragment or diagram that fills the lower half (Supabase's elephant line icon, globe wireframe, cube vector). Tiles use 1px `--line` borders, radius 12–16px, 24–32px padding and no heavy shadows.
- **Mixed sizes:** a 6-column grid with spans of 4/2, 2/2/2 and 3/3. Supabase leads with one tall "hero" tile (Postgres).
- **Isometric line drawings** (`linear_app_d02`, `raycast_com_d14`): thin 1px line-art illustrations in muted grey with a single accent. Ideal for our micro-animations: animate the stroke or one moving accent, not the whole tile.
- **Hover:** border brightens and a spotlight follows the cursor (our `SpotlightCard`); the inner fragment animates. 200ms.

### Metrics band
- **Stripe's stat row** (`stripe_com_d04`, `stripe_com_d13`): 4 columns, 40–48px light-weight numbers, 12–13px muted 2-line labels, separated by 1px vertical hairlines, with a heading centred above. On dark (`d13`) the numbers sit over a glowing line-wave graphic.
- **Raycast's inline values** (`raycast_com_d03`): "Reliable. 99.8% crash-free rate." puts the bold keyword and the muted explanation in one line, which works for "Why Amitrix".
- For us: numbers in Geist Mono tabular figures (`font-variant-numeric: tabular-nums`) so counters never shift the layout.

### Products showcase (dark, pinned)
- **Real product UI in a framed window** (`linear_app_d01`, `d03`, `d08`; `resend_com_d05`; `framer_com_d02`): screenshots sit in a 1px-bordered, 12px-radius frame with a soft top highlight (`inset 0 1px 0 rgb(255 255 255 / .06)`) and a large, very low-opacity glow beneath. Linear tilts its frame in 3D at the hero (`d01`, perspective plus a slight rotateX), which matches our "scales up as you enter".
- **Section header pattern** (`linear_app_d03`, `d04`, `d06`): a 2-word title on the left (40–48px) and a 3-line description plus "Learn more →" on the right, then a full-width visual below. Feature links run as mono-ish small lists under it. Good for each product step.
- **Tab or segmented switcher** (`supabase_com_d02` Table Editor/SQL/RLS, `raycast_com_d04` Productivity/Engineering…): useful as the mobile replacement for pinning, using stacked cards with a segmented control.

### Featured work (horizontal scroll)
- **Basement's project list** (`basement_studio_d03`–`d05`): a large image on the left, client name right-aligned in 20px, a 4-line description, and a mono tag ("Websites & Features"). The cards are big, in editorial style.
- **Stripe's story cards** (`stripe_com_d08`): tall cards with full-bleed image, logo bottom-left, a 2-line result and "Read story →". The carousel arrows top-right are 32px circular ghost buttons. This is the mobile-carousel model for us.
- **Framer's showcase mosaic** (`framer_com_d10`): mixed-ratio tiles. Use it on the /work index, not on the home page.

### How we work (process line)
- **Linear's changelog timeline** (`linear_app_d09`): a horizontal hairline with small dots, a mono date, a title and a 2-line description per node, with the active node in accent. For us: 4 nodes. The line draws in with DrawSVG, and each node's dot fills indigo and its text turns from muted to foreground when the line reaches it.
- **Stripe's node diagram** (`stripe_com_d12`): small labelled pills joined by 1px connector lines on a dark navy background. Good inspiration for the Build step's visual.

### Tech stack (terminal)
- **Code panels** (`resend_com_d02`–`d03`, `supabase_com_d03`, `linear_app_d08`): ink panel, 1px border, a tab row (language or file tabs), line numbers in muted mono, and accent colours for strings and keywords. Resend puts a row of 13 SDK icon tiles (40px squares, 1px border, active one with an accent ring) above the code. That suits our tilting logo grid.
- **HTTP log lines** (`resend_com_d04`): `HTTP 200: { "id": … }` lines that fade with each new line. Copy the *idea* for our `amitrix deploy --prod` output: each new line pushes up, and older lines drop to 40% opacity.

### Testimonials
- **Linear's two-card quote** (`linear_app_d10`): one quote in a large 24px serif-less display, with a person and company at the bottom; two different card colours side by side. Bold, few quotes.
- **Resend's rolling row** (`resend_com_d13`): 4 bordered cards (quote 14px, avatar + name + role), edge-faded, auto-sliding. This is closer to our brief. Keep every quote marked `[Placeholder]` until real ones exist.
- **Raycast's mixed layout** (`raycast_com_d08`): names in a row and a single large quote. A nice alternative if there are only 1–2 real quotes.

### Final CTA
- **Big centred statement + 2 buttons on ink** (`linear_app_d11`, `resend_com_d14`, `cursor_com_d09`, `supabase_com_d07`): 56–72px headline in 2 lines and two small buttons, with huge vertical padding (200px+). Nothing else. Our lattice motif can glow faintly behind it, centred and masked.

### Footer
- **Giant wordmark** (`resend_com_d14` shows the faint "Resend" outline behind the CTA and footer; `basement_studio_d07`–`d08` "BSMNT.26" fills the width): our rising AMITRIX wordmark is in good company. Make it fill 100% of the container width (fit-text via SVG `viewBox`), in 5–8% opacity ink-on-ink or with a gradient stroke, clipped at the bottom so it "rises".
- **Columns:** 5–6 columns of 13px links with 12px muted headers (`linear_app_d12`, `vercel_com_d06`, `supabase_com_d08`). Supabase's left block has logo, socials and a newsletter input. Resend adds an "All systems operational" status dot, a nice lab detail ("● Booking open").

### Inner pages (article, contact, 404)
- **Article:** Cursor's blog and changelog rows (`cursor_com_d07`–`d08`): mono date · category, title, author avatar and read time. Use this for /insights cards. Body text 17–18px with line-height 1.7, max 68ch.
- **Contact:** use the split CTA pattern of Supabase's "Start your project / Request a demo" (`supabase_com_d00`). Primary is the booking embed and secondary is the form. Basement's footer contact (`basement_studio_d06`) uses a huge email link, so we can make our email a 32–40px link.
- **404:** our lattice plus a decoding headline. Lusion (`lusion_co_d00`) shows how a minimal loader-style "100" counter works as a full-screen moment.

## Global craft details
- **Hairlines everywhere:** 1px `--line` borders on cards, grid cells and code panels. On dark, use `rgb(255 255 255 / .08)`, never solid grey.
- **Inner top highlight** on dark cards and frames: `box-shadow: inset 0 1px 0 rgb(255 255 255 / .06)`.
- **Glows are rare and soft:** radial-gradient at 10–20% opacity, 600–900px radius, behind *one* element per section (Resend `d02`, `d07`; Framer `d00`).
- **Muted-then-bright text:** headings in full foreground with descriptions at about 60% (Linear `d02`: "A new species of product tool. *Purpose-built for…*" uses two tones in one paragraph). Use it in section intros.
- **Mono micro-labels:** 10–12px, uppercase, tracking +0.08em, muted (Linear `d01`, Raycast `d14` "FIG.01"). Our `// 01 — LABEL` eyebrow is exactly this. Also use mono for figure captions, dates and tags.
- **Grid and noise:** keep the background grid at 4–6% opacity with a radial mask so it fades at the edges (Raycast `d13`–`d14` lab grid with corner labels). Grain at 3–4% opacity.
- **Focus states:** 2px indigo ring with a 2px offset, visible on dark and light. None of the references hide focus. Match that.
- **Gradients** only on accent words or a single object. Stripe's huge gradient fields (`stripe_com_d00`, `d10`) are their brand, not ours.

## Do not do
- No full-page scroll-jacking. Lusion's page measured 900px tall because it hijacks scroll. Pin only specific sections.
- No cookie-banner-style overlays covering the hero (Cursor's and Framer's banners cover 15% of the mobile screen).
- No more than one glowing hero object per viewport, and no rainbow gradients.
- No heavy drop shadows, no glassmorphism cards stacked on glass, no bounce easing.
- No logos or testimonials presented as real until we have permission. Use neutral placeholders.
- Don't let motion delay reading. Every reference shows the headline instantly, and decoration animates around it.
