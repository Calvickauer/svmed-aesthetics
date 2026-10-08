# Salinas Valley Medical Aesthetics: static site (Astro)

This is a faithful, fixed-up static rebuild of https://svmedaesthetics.com for **Salinas Valley Medical Aesthetics** (30 Central Avenue, Salinas, CA 93901 · 831-975-4175).

- **Preview:** https://calvickauer.github.io/svmed-aesthetics/. GitHub Pages deploys it from `main` through `.github/workflows/deploy.yml`.
- **Production domain (canonical):** https://svmedaesthetics.com. The live WordPress site and DNS are **not** touched by this repo.

## Develop

```bash
npm ci
npm run dev        # http://localhost:4321/svmed-aesthetics/  (runs the image pipeline first)
npm run build      # -> dist/
npm run preview
```

Node 20.3+ works; CI uses Node 22. Astro is pinned to v5.

## How it's organized

| Path | What |
|---|---|
| `src/lib/site.ts` | **Single source of truth** for business facts: name, phone, email, address, hours, booking/financing links, nav, team, testimonials, Google review snapshot, Instagram grid |
| `src/content/pages/*.md` | 25 service / skin-care brand / team bio pages (markdown + frontmatter). Images use `img:YYYY/MM/file.ext` keys |
| `src/pages/` | Home and the bespoke pages (about, services, skin care, financing, Cherry, booking, testimonials, before/after, promotions, contact), redirect stubs, `sitemap.xml`, `robots.txt` |
| `src/components/` | Header, footer, banner, hero slider, carousels, cards, CTA blocks |
| `src/styles/global.css` | Design tokens and global styles |
| `src/scripts/main.ts` | Sticky header, mobile menu, reveal-on-scroll, carousels, lazy GA4 and Cherry |
| `images/` | Original photos, kept in their WordPress `YYYY/MM` paths |
| `scripts/images.mjs` | Builds responsive AVIF and WebP (360–2560 w) into `public/_img/`, plus a manifest at `src/data/images.json`. It is incremental and cached in CI |
| `scripts/icons.mjs` | Favicon set built from the 3200px logo (outputs committed in `public/`) |

## Environment variables

| Var | Default | Purpose |
|---|---|---|
| `SITE_URL` | `https://calvickauer.github.io` | Astro `site` (absolute OG URLs) |
| `BASE_PATH` | `/svmed-aesthetics` | Astro `base`. Set to `/` when the site moves to its own domain |
| `PUBLIC_CANONICAL_ORIGIN` | `https://svmedaesthetics.com` | Canonical, sitemap and JSON-LD origin |
| `PUBLIC_NOINDEX` | unset (CI sets `true`) | Adds `noindex` and a disallow-all robots.txt, so the preview stays out of search results |

## Notes

- **Contact form:** not connected (preview). It has no action endpoint, and submitting shows a "please call 831-975-4175" message. Do not wire an email or form service without the practice's approval.
- **GA4 (`G-8ZDFZM1P1M`):** loads lazily and only on the `svmedaesthetics.com` hostname, so preview traffic never reaches the practice's analytics.
- **Square Appointments, Cherry, CareCredit and Google Maps:** each loads lazily or only on its own page.
- **Google reviews and Instagram:** static snapshots. Update them in `src/lib/site.ts`, and never invent reviews.
