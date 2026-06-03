# Google + Turnstile setup (XAURite)

## After adding env on Vercel

1. **Redeploy** the project (required for new env vars).
2. Run DB migration on production:

```powershell
$env:DATABASE_URL = "postgresql://..."
npm run db:migrate
npm run db:seed
```

## Google redirect URI (must match exactly)

Add **every** URL users open (Google compares character-by-character):

```text
https://xaurite.vercel.app/api/auth/google/callback
https://xaujournal-nine.vercel.app/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

**Authorized JavaScript origins** (same hosts, no path):

```text
https://xaurite.vercel.app
https://xaujournal-nine.vercel.app
http://localhost:3000
```

`Error 400: redirect_uri_mismatch` = this list is missing the exact callback URL the app sends. The app now uses the **same host as your browser** (fixes wrong `AUTH_URL` on Vercel).

Set on Vercel: `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` = `https://xaurite.vercel.app` (your main URL).

## Test checklist

- [ ] Register with email + Turnstile
- [ ] Continue with Google (after Turnstile if enabled)
- [ ] Sign in as demo (Turnstile skipped for demo email)

## Common errors

| Symptom | Fix |
|---------|-----|
| `google_failed` | State/cookie issue or token exchange failed — check Vercel logs |
| `redirect_uri_mismatch` (Google page) | Add callback URL above for the host you use in the browser |
| `google_config` | Missing `GOOGLE_CLIENT_ID` / `SECRET` on Vercel |
| Security check failed | Wrong Turnstile secret or hostname not listed in Turnstile site |
