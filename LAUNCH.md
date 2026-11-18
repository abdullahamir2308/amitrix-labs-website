# Launch guide — Amitrix Labs website

| What | Where |
| --- | --- |
| Live (preview) site | https://amitrix-labs-website.vercel.app |
| Code | https://github.com/abdullahamir2308/amitrix-labs-website |
| Hosting | Vercel project `amitrix-labs-website` |
| Domain (to connect later) | amitrixlabs.com (registered at Hostinger) |

Every push to `main` on GitHub deploys the site automatically. Pushes to other branches get their own preview link.

## 1. Turn on Analytics and Speed Insights (one-time, 1 minute)

The tracking code is already in the site. You only have to switch them on:

1. Open https://vercel.com, then the **amitrix-labs-website** project.
2. Go to the **Analytics** tab and click **Enable**.
3. Go to the **Speed Insights** tab and click **Enable**.

Data starts showing after the next visits.

## 2. Make the contact form send email (Resend)

Until these keys are set, the live form shows a clear "not configured" message (HTTP 503) instead of failing silently.

1. Create a free account at https://resend.com.
2. Add your domain `amitrixlabs.com` under **Domains** and add the DNS records Resend shows you in Hostinger (same place as step 4). Wait for "Verified".
3. Create an API key under **API Keys**.
4. In Vercel, open the project, go to **Settings → Environment Variables**, and add each variable for Production, Preview and Development:

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | the key from Resend (starts with `re_`) |
| `CONTACT_TO_EMAIL` | the inbox that receives enquiries, e.g. `hello@amitrixlabs.com` |
| `CONTACT_FROM_EMAIL` | a sender on your verified domain, e.g. `Amitrix Labs <hello@amitrixlabs.com>` |
| `NEXT_PUBLIC_CAL_LINK` | your Cal.com booking path, e.g. `amitrix/intro-call` |

5. Redeploy: go to **Deployments**, open the latest deployment's **⋯** menu and click **Redeploy**.
6. Send yourself a test message from `/contact`.

For local testing, put the same names in `.env.local` (never commit it; `.env.example` lists the names).

## 3. Booking (Cal.com)

1. Create an account at https://cal.com and an event type (e.g. "Intro call, 30 min").
2. Its link looks like `cal.com/amitrix/intro-call`. Put `amitrix/intro-call` into `NEXT_PUBLIC_CAL_LINK` (step 2), then redeploy.

The contact page then shows the live booking calendar instead of the placeholder card.

## 4. Connect amitrixlabs.com (Hostinger)

Do this when the real content is in (see the checklist below).

1. In Vercel, open the project and go to **Settings → Domains**. Add `amitrixlabs.com`, then add `www.amitrixlabs.com`. Choose **Redirect www.amitrixlabs.com → amitrixlabs.com**.
2. Vercel then shows the exact DNS records to add. They are normally:

| Type | Name / Host | Value / Points to | TTL |
| --- | --- | --- | --- |
| A | `@` | `76.76.21.21` | 3600 (or default) |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 (or default) |

   **Always use the values Vercel shows on that screen.** Vercel sometimes gives a project-specific value, and it overrides the table above.
3. In Hostinger, open **hPanel → Domains → amitrixlabs.com → DNS / Nameservers → DNS records**:
   - Delete any existing **A** record for `@`, and any **CNAME** or **A** record for `www`, that point elsewhere (e.g. Hostinger's parking page).
   - Add the two records from step 2.
   - Leave MX/TXT records (email, Resend verification) as they are.
4. Wait 5 minutes to a few hours. The Vercel Domains screen turns green ("Valid Configuration"). HTTPS certificates are issued automatically, with nothing to buy or install.
5. Check that `http://amitrixlabs.com`, `https://amitrixlabs.com` and `https://www.amitrixlabs.com` all end up at `https://amitrixlabs.com`.
6. Submit `https://amitrixlabs.com/sitemap.xml` in Google Search Console (Sitemaps). Verify the domain there with a DNS TXT record in Hostinger.

The site already uses `https://amitrixlabs.com` for canonical links, the sitemap and social images, so nothing in the code changes when the domain goes live.

## 5. Pre-launch checklist

- [ ] Every `[Placeholder]` replaced or hidden. Search the code and `/content` for "Placeholder".
- [ ] Real metrics in `src/lib/site.ts` (hero stats, metrics band). They currently show 0.
- [ ] Client logos and testimonials, only with permission.
- [ ] Privacy policy and terms reviewed by a lawyer (`/privacy`, `/terms` are placeholders).
- [ ] Contact form sends to your inbox (step 2) and the booking calendar works (step 3).
- [ ] Logo and palette confirmed at `/brand`. The current default is concept #1 "Lattice A" with the "Lab" palette.
- [ ] Tested on a real phone (Android + iPhone) and in Safari, Chrome and Firefox.
- [ ] "Reduce motion" turned on in the OS settings: the site still reads well.
- [ ] Domain connected with HTTPS, and www redirects (step 4).
- [ ] Shared the link on LinkedIn and WhatsApp: the preview image and title look right.
- [ ] Sitemap submitted in Google Search Console.
- [ ] Analytics and Speed Insights enabled (step 1).
- [ ] 404 page and all nav links work.

## 6. How to update the site

Most updates are content only, with no code. The full guide is in [`content/README.md`](content/README.md).

| To change… | Edit |
| --- | --- |
| A product, service, case study or blog post | the matching file in `content/products/`, `content/services/`, `content/work/` or `content/posts/` (copy an existing file to add a new one) |
| Team, testimonials, client logos, jobs | `content/team.json`, `content/testimonials.json`, `content/clients.json`, `content/jobs.json` |
| Images | `public/` (e.g. `public/placeholders/` → replace with your own and update the path) |
| Homepage text, hero, metrics, nav, footer, contact details, page intros | `src/lib/site.ts` |

To preview and publish:

1. `npm run dev`, then open http://localhost:3000 (or the port shown).
2. `npm run build`. If it fails, the error says which content field is wrong.
3. Commit and push to GitHub. Vercel deploys automatically in about a minute.

In Claude Code you can simply say: *"Read CLAUDE.md. Replace the placeholder case study with this one: …"*. Then say *"commit and push"*.
