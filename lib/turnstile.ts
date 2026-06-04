export function isTurnstileConfigured() {
  if (typeof window !== "undefined") {
    return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  }
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string | null
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Security check is not configured on the server." };
    }
    return { ok: true };
  }

  if (!token?.trim()) {
    return { ok: false, error: "Please complete the security check." };
  }

  const body = new URLSearchParams({
    secret,
    response: token.trim(),
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true };
    return { ok: false, error: "Security check failed. Please try again." };
  } catch {
    return { ok: false, error: "Could not verify security check." };
  }
}
