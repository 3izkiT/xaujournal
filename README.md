# XAURite

Your XAUUSD discipline rite — log every trade on purpose. Manual journal with checklist, emotion, charts. TradingView profit/loss colors, light and dark mode. No MT5 sync.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/dashboard`).

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Recharts for dashboard analytics
- Auth.js (credentials) + PostgreSQL (Prisma)
- 100% manual — no broker API

## Member login

- **Sign in:** `/login`
- **Register:** `/register`
- Demo account: `demo@xaurite.app` / `xaurite2026`

Set in Vercel (required):

- `AUTH_SECRET` — random string (`openssl rand -base64 32`)
- `AUTH_URL` — your production URL (e.g. Vercel deployment URL)
- `DATABASE_URL` — managed Postgres connection string

## Database setup (production-ready)

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Schema: `prisma/schema.prisma`  
Migrations: `prisma/migrations/`  
Seed data: `prisma/seed.ts` (includes demo account and sample trades)

## Brand constants

User-facing name and copy live in `lib/brand.ts` — update there to keep UI, SEO metadata, and demo credentials in sync.

## Domain & SEO (Vercel env)

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
AUTH_URL=https://your-domain.com
```

Early access (default): full features free, payments UI hidden. See `docs/monetization.md`.

## Scale-first checklist

- Use managed Postgres with pooling (Neon/Supabase/RDS + PgBouncer)
- Add read replica when dashboard reads grow
- Keep chart screenshots in object storage (S3/R2/Cloudinary), not DB blobs
- Enable nightly backups + monthly restore drill (see `docs/backup-checklist.md`)

## Deploy

```bash
npx vercel --prod
```
