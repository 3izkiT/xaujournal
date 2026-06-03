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

```text
https://xaurite.vercel.app/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

## Test checklist

- [ ] Register with email + Turnstile
- [ ] Continue with Google (after Turnstile if enabled)
- [ ] Sign in as demo (Turnstile skipped for demo email)

## Common errors

| Symptom | Fix |
|---------|-----|
| `google_failed` | Redirect URI mismatch in Google Cloud |
| `google_config` | Missing `GOOGLE_CLIENT_ID` / `SECRET` on Vercel |
| Security check failed | Wrong Turnstile secret or hostname not listed in Turnstile site |
