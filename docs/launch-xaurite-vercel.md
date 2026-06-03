# Launch on xaurite.vercel.app (validate before custom domain)

Use the Vercel URL to test real interest. When metrics look good, buy a domain and only change env + OAuth redirect — no code rewrite.

## 1. Vercel project

1. Import repo → deploy `main`
2. Confirm production URL: **https://xaurite.vercel.app** (Project → Settings → Domains)
3. Each deploy runs `prisma migrate deploy` (see `vercel.json`) — if register returns **Registration failed**, open the deploy log and confirm migrations applied, or run locally: `DATABASE_URL="..." npm run db:migrate`

## 2. Environment variables (Production + Preview)

```env
NEXT_PUBLIC_SITE_URL=https://xaurite.vercel.app
AUTH_URL=https://xaurite.vercel.app
AUTH_SECRET=<openssl rand -base64 32>
DATABASE_URL=<Neon pooled URL>

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

NEXT_PUBLIC_OPEN_ACCESS_MODE=true
NEXT_PUBLIC_PAYMENTS_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP=
NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID=
NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=k9MTRy1E07AzN-DpNy8UvRHtmR5vQ-ETMKJua-dPbdA
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-4NN8W5FDRK

# Auth: Google-only by default (no email/password sign-up, no Resend required)
# NEXT_PUBLIC_EMAIL_AUTH_ENABLED=true
# NEXT_PUBLIC_DEMO_AUTH_ENABLED=true

# Optional — only if NEXT_PUBLIC_EMAIL_AUTH_ENABLED=true
# RESEND_API_KEY=
# EMAIL_FROM=onboarding@resend.dev
```

**Sign-up:** Users use **Continue with Google** only unless you set `NEXT_PUBLIC_EMAIL_AUTH_ENABLED=true`.

See `docs/adsense-seo-speed.md` for AdSense approval and SEO checklist.

Redeploy after saving env.

## 3. Google OAuth redirect (must match exactly)

**Authorized JavaScript origins**

```text
https://xaurite.vercel.app
http://localhost:3000
```

**Authorized redirect URIs**

```text
https://xaurite.vercel.app/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

## 4. Cloudflare Turnstile hostnames

Add: `xaurite.vercel.app` and `localhost`

## 5. Database

```powershell
$env:DATABASE_URL = "postgresql://..."
npm run db:migrate
npm run db:seed
```

Demo: `demo@xaurite.app` / `xaurite2026`

## 6. Smoke test

- [ ] https://xaurite.vercel.app loads, favicon shows
- [ ] Register (email + confirm password + Turnstile)
- [ ] Google sign-in
- [ ] Save a trade → dashboard
- [ ] `/sitemap.xml` uses `xaurite.vercel.app` URLs

## 7. Measure interest (before buying a domain)

| Tool | What to watch |
|------|----------------|
| **Vercel Analytics** | Project → Analytics → enable (free tier) — visits, top pages |
| **Google Search Console** | Add property `https://xaurite.vercel.app`, submit sitemap `/sitemap.xml` |
| **Registrations** | Neon / Prisma: count rows in `User` over time |
| **Manual** | Ask 5–10 traders to try demo + one real log |

Rough signal to buy a domain: steady weekly sign-ups or returning users logging trades, not just one-day spikes.

## 8. Later: custom domain (e.g. xaurite.app)

1. Buy domain → Vercel → Add domain → DNS
2. Update env: `NEXT_PUBLIC_SITE_URL` + `AUTH_URL` to `https://yourdomain.com`
3. Add same URLs in Google OAuth + Turnstile
4. Redeploy — old `xaurite.vercel.app` can stay as redirect alias in Vercel
