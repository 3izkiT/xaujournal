# AdSense + homepage SEO + speed

## AdSense (turn on in Vercel)

Minimum:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

Optional ad unit slots (create units in AdSense → Ads → By ad unit):

```env
NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID=1234567891
NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM=1234567892
```

- Script loads **lazy** (after page interactive) for speed.
- `https://xaurite.vercel.app/ads.txt` is generated from your `ca-pub-` ID.
- To disable ads: `NEXT_PUBLIC_ADSENSE_ENABLED=false`

**Approval tips:** Privacy + Terms live, real content on homepage, 1–3 ad units max until approved.

## Homepage SEO

Already wired:

- Title/description/keywords on `/`
- Canonical + Open Graph + Twitter card
- FAQ + WebSite + SoftwareApplication JSON-LD
- Keyword-rich `<h1>` on hero

### Search Console (xaurite.vercel.app)

**DNS TXT does not work** on `*.vercel.app` — you do not control Vercel’s DNS zone.

Use **HTML tag** in Search Console instead:

1. Property URL: `https://xaurite.vercel.app`
2. Verification method: **HTML tag** (not DNS)
3. Deploy — meta tag is already in the site (`lib/google-verification.ts`)

Verification (pick **one** method in Search Console):

1. **HTML file** — `https://xaurite.vercel.app/googleff0d26e06bfa3e67.html` (in `/public`)
2. **HTML meta tag** — `k9MTRy1E07AzN-DpNy8UvRHtmR5vQ-ETMKJua-dPbdA` in `<head>`
3. **Google Analytics** (optional) — set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX` (same Google account as Search Console)

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=k9MTRy1E07AzN-DpNy8UvRHtmR5vQ-ETMKJua-dPbdA
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
```

After verified, submit sitemap: `https://xaurite.vercel.app/sitemap.xml`

When you buy a **custom domain**, DNS TXT verification will work on that domain’s registrar.

## Speed

- Landing JS loads via `dynamic()` (smaller first paint)
- Geist font `display: swap`
- AdSense deferred (`lazyOnload`)
- `compress` + no `X-Powered-By` header

Measure: PageSpeed Insights on `https://xaurite.vercel.app` after deploy.
