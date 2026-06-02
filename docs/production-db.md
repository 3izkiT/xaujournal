# Production database (Postgres)

XAUJournal needs **`DATABASE_URL`** on Vercel before login, trades, and analytics persist.

## What I can do vs what you provide

| Step | Who |
|------|-----|
| Prisma schema, migrations, seed, API guards | Done in repo |
| Create Neon/Supabase project | **You** (free tier is enough) |
| Paste connection string here or in Vercel | **You** |
| Run `migrate deploy` + `db seed` against prod | **Agent** once `DATABASE_URL` is in `.env.local` or you paste the string |

## 1. Create Postgres (Neon recommended)

1. [neon.tech](https://neon.tech) → New project → copy **pooled** connection string  
   Format: `postgresql://user:pass@host/db?sslmode=require`
2. Vercel → Project **xaujournal** → Settings → Environment Variables:
   - `DATABASE_URL` = connection string (Production + Preview)
   - `AUTH_SECRET` = already set
   - `AUTH_URL` = `https://xaujournal-nine.vercel.app`

## 2. Migrate production

From your machine with `DATABASE_URL` set:

```powershell
cd D:\XAUJournal
$env:DATABASE_URL = "postgresql://..."
npm run db:migrate
npm run db:seed
```

Seed creates demo user: `demo@xaujournal.app` / `xaujournal2026`

## 3. Verify end-to-end

1. Register new user on production  
2. Journal Entry → save trade (notes required, 3+ chars each)  
3. Dashboard → rule-break chart, heatmap, recent trades  
4. Free user: 11th trade must return **403** `TRADE_LIMIT_REACHED`

## 4. Optional: upgrade test user to Premium

```sql
UPDATE "User" SET plan = 'PREMIUM_GOLD' WHERE email = 'you@example.com';
```

---

Send the **pooled** `DATABASE_URL` in chat (or add to `.env.local` locally) and we can run migrate + confirm production in one pass.
