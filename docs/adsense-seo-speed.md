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

Optional Search Console:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

Then add property `https://xaurite.vercel.app` and submit `https://xaurite.vercel.app/sitemap.xml`.

## Speed

- Landing JS loads via `dynamic()` (smaller first paint)
- Geist font `display: swap`
- AdSense deferred (`lazyOnload`)
- `compress` + no `X-Powered-By` header

Measure: PageSpeed Insights on `https://xaurite.vercel.app` after deploy.
