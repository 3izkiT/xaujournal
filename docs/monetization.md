# Monetization & growth settings (XAURite)

## Default (growth phase)

| Env | Value | Effect |
|-----|-------|--------|
| `NEXT_PUBLIC_OPEN_ACCESS_MODE` | unset or `true` | Unlimited logs + full analytics for everyone |
| `NEXT_PUBLIC_PAYMENTS_ENABLED` | unset or `false` | Hides “Upgrade / Plans” links; `/pricing` shows early-access message |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | `false` | No ad scripts |

## When ready to charge

1. Set `NEXT_PUBLIC_PAYMENTS_ENABLED=true`
2. Set `NEXT_PUBLIC_OPEN_ACCESS_MODE=false` (optional — enforces 10-log free tier again)
3. Wire Stripe (not implemented yet) — `PricingPlans` UI is ready

## When AdSense is approved

1. Set `NEXT_PUBLIC_ADSENSE_ENABLED=true`
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXX`
3. Add real line to `public/ads.txt`
4. Place ad slots: `AdSlot` with slot IDs from AdSense dashboard

## Canonical domain (SEO)

Set on Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
AUTH_URL=https://your-domain.com
```
