# XAUJournal

Premium XAUUSD trading journal and discipline tracker — light theme, manual trade logs, pastel analytics.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/dashboard`).

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Recharts for dashboard analytics
- 100% manual — no broker API

## Deploy

Connect this repository to a **new** Vercel project (separate from Gold IQ).

```bash
npx vercel --prod
```
