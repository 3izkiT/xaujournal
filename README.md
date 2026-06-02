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

## Member login

- **Sign in:** `/login`
- **Register:** `/register`
- Demo account: `demo@xaujournal.app` / `xaujournal2026`

Set in Vercel (required):

- `AUTH_SECRET` — random string (`openssl rand -base64 32`)
- `AUTH_URL` — e.g. `https://xaujournal-nine.vercel.app`

## Deploy

```bash
npx vercel --prod
```
