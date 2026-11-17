# Editing website content

All the words and pictures for products, services, case studies, blog posts, the team,
testimonials, client logos and job openings live in this `content` folder. You can change them
without touching any code. The website reads these files automatically.

Short site-wide text (the homepage headline, numbers, menu links, footer, email address, social
links) lives in a different file: `src/lib/site.ts`. It's plain text inside quotes, so you can
edit it the same way, carefully.

---

## 1. Preview your changes

1. Open a terminal in the project folder.
2. Run `npm run dev`.
3. Open http://localhost:3000 in your browser (or the port the terminal shows).
4. Save a file in `content/` and the page updates within a second or two.

If something is wrong in a file (a missing field, a typo in a date), the terminal shows a
yellow `[VELITE]` message naming the file and the field. Fix it and save again.

Before publishing you can run `npm run content:build`. It checks every file strictly and stops
with an error if anything is wrong.

---

## 2. How the files work

There are two kinds of files.

**`.mdx` files** (products, services, case studies, blog posts). Each one has two parts:

```
---
title: My title          ← the "frontmatter": labelled fields between two --- lines
slug: my-title
---

## A heading             ← the "body": normal text written in Markdown

A paragraph of text. **Bold**, _italic_, [a link](/contact).
```

**`.json` files** (team, testimonials, clients, jobs). Each one is a list. Every entry sits
between `{ }` and entries are separated by commas.

Rules that prevent most errors:

- Put text that contains a colon `:`, starts with `[` or has quotes inside `"double quotes"`.
- Keep the two-space indentation in the frontmatter, and the dash `-` in front of list items.
- In JSON, every line inside `{ }` except the last one ends with a comma.
- **slug** is the web address of the page: lowercase letters, numbers and dashes only, e.g.
  `ai-agents-automation` → `amitrixlabs.com/services/ai-agents-automation`. Every slug in a
  folder must be different.
- **order** is a number. Lower numbers appear first.
- **Dates** are written `YYYY-MM-DD`, e.g. `2026-11-17`.
- **Icons** are names from https://lucide.dev/icons written in PascalCase, e.g. `Zap`,
  `ShieldCheck`, `ChartLine`.
- To hide something without deleting it, add `draft: true` (products, services, case studies
  and posts). Drafts show while previewing but not on the live site.
- Files whose names start with `_` are ignored, which is handy for templates.

---

## 3. Images

1. Put the image in the `public` folder, for example `public/images/work/my-project-cover.webp`.
2. In the content file, write the path **without** `public`, starting with `/`:
   `coverImage: /images/work/my-project-cover.webp`

The site reads each image's size automatically and creates a blurred preview while it loads,
so you don't need to enter widths or heights.

Recommended sizes:

| Image | Shape | Suggested size |
| --- | --- | --- |
| Product screenshots and hero | 16:10 | 1600 × 1000 |
| Case study cover and gallery | 16:10 | 1600 × 1000 |
| Blog post cover | 16:9 | 1600 × 900 |
| Service image | 4:3 | 1200 × 900 |
| Product logo, team photo, testimonial photo | square | 400 × 400 |
| Client logo | wide, transparent background | SVG preferred, or PNG about 400 × 160 |

Use `.webp`, `.jpg`, `.png` or `.svg`. Keep photos under about 300 KB. Squoosh
(https://squoosh.app) can shrink them.

The current images in `public/placeholders/` are generated stand-ins. Replace them with real
images, then delete the folder once nothing points at it. (To regenerate the stand-ins, run
`npm run content:placeholders`.)

---

## 4. Add or change each kind of content

The easiest way is always the same: **copy an existing file, rename it and edit it.**

### A product → `content/products/`

Copy `agent-studio.mdx` and rename it after the product (e.g. `my-product.mdx`).

| Field | What to write |
| --- | --- |
| `name` | Product name |
| `slug` | Web address, e.g. `my-product` |
| `tagline` | One sentence pitch |
| `status` | `live`, `beta` or `coming-soon` |
| `category` | Short label, e.g. `Automation` |
| `logo`, `heroImage` | Image paths (see section 3) |
| `screenshots` | List of `image` + `alt` (a short description of the picture for people who can't see it) |
| `features` | List of `title`, `description`, `icon` |
| `pricingNote` | Optional, e.g. `Free during beta` |
| `ctaUrl`, `ctaLabel` | Where the main button goes and what it says |
| `faqs` | Optional list of `q` (question) and `a` (answer) |
| `order` | Position in lists |

The body (below the second `---`) is the longer product story.

### A service → `content/services/`

Copy `custom-software.mdx`.

| Field | What to write |
| --- | --- |
| `title` | Service name (this is the page's main heading, so include the keyword people search for) |
| `shortTitle` | Optional shorter name for menus |
| `slug`, `summary`, `icon`, `image` | As above |
| `problems` | List of problems this service solves |
| `deliverables` | List of what the client receives |
| `process` | List of steps, each with `title` and `description` |
| `techStack` | List of technologies |
| `faqs` | List of `q` and `a` (these also appear in Google results) |
| `relatedWork` | List of case study slugs to show on the page |
| `order` | Position in lists |

### A case study → `content/work/`

Copy `logistics-dispatch-agent.mdx`. **Only name a client if you have their written permission.**

| Field | What to write |
| --- | --- |
| `title`, `slug`, `summary` | As above |
| `client` | Client name (or a description like "A European logistics company") |
| `industry` | e.g. `Healthcare`. Use the same spelling every time, because it powers the filter on the Work page |
| `services` | List of service slugs, e.g. `ai-agents-automation` |
| `year` | e.g. `2026` |
| `coverImage`, `gallery` | Image path, and a list of `image` + `alt` |
| `challenge`, `approach` | A paragraph each |
| `results` | List of `metric` (e.g. `40%`, `3x`, `2 min`) and `label`. Numbers animate on the page. Only use real, verifiable numbers |
| `stack` | Technologies used |
| `testimonialId` | Optional: the `id` of a quote in `testimonials.json` |
| `featured` | `true` to show it on the homepage |
| `order` | Position in lists |

### A blog post → `content/posts/`

Copy `our-process-discovery-to-launch.mdx`.

| Field | What to write |
| --- | --- |
| `title`, `slug`, `excerpt` | As above (`excerpt` is the one or two sentence preview) |
| `date` | Publish date, `YYYY-MM-DD` |
| `author` | The `id` of a person in `team.json`, e.g. `founder` |
| `tags` | List of topics, e.g. `AI agents` |
| `cover` | Image path |
| `featured` | `true` to make it the big post at the top of Insights |

Reading time and the table of contents are worked out automatically from the headings
(`##` and `###`) in the body. To show code, wrap it in three backticks with the language name:

````
```ts
const hello = "world";
```
````

### A team member → `content/team.json`

Copy one `{ ... }` block. Fields: `id` (short unique name such as `jane-doe`, used as a post
`author`), `name`, `role`, `bio`, `avatar` (image path), and optional `linkedin`, `x`,
`github` (full web addresses starting with `https://`), plus `order`.

### A testimonial → `content/testimonials.json`

Copy one block. Fields: `id` (e.g. `testimonial-04`), `quote`, `name`, `role`, `company`,
optional `avatar`, optional `workSlug` (the case study it belongs to) and `order`. **Only
publish real quotes, with permission.**

### A client logo → `content/clients.json`

1. Save the logo in `public/images/clients/` (SVG with a transparent background is best).
2. Copy one block and set `id` (e.g. `acme`), `name`, `logo` (the image path), optional `url`,
   optional `industry` and `order`.

**Only show logos of clients who have agreed to it.**

### A job opening → `content/jobs.json`

Copy one block. Fields: `slug`, `title`, `department`, `location`, `type` (`full-time`,
`part-time`, `contract` or `internship`), `summary`, `responsibilities`, `requirements`,
`niceToHave` (lists), `applyUrl` (a web address or `mailto:` email link), `posted` (date) and
`open`. Set `open` to `false` to close a role. With no open roles, the Careers page shows
"always looking for great people" instead.

---

## 5. Removing the `[Placeholder]` markers

Everything that is not real yet is marked `[Placeholder]` so nothing fake goes live by
accident. Before launch:

1. Search the project for `[Placeholder]` (in VS Code: Ctrl+Shift+F) and also for
   `placeholder: true` and `[your location]`.
2. Replace each marked text with real content, or delete the entry (for example, delete a
   placeholder case study file entirely rather than leaving it half-filled).
3. In each file, delete the comment line at the top that starts with `#` and says
   "[Placeholder]" or "DRAFT COPY" once you've reviewed it.
4. Point image fields away from `/placeholders/...` to your real images.
5. The homepage numbers in `src/lib/site.ts` are `0` with "[Placeholder]" labels. Put in the
   real numbers and labels.
6. Run `npm run content:build`. It should finish with no warnings.
