import { SITE_URL } from "@/lib/site";

/** Public origin for the current request (fixes redirect_uri_mismatch when AUTH_URL ≠ browser host). */
export function resolveRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost?.split(",")[0]?.trim() || request.headers.get("host")?.trim();
  if (!host) {
    return SITE_URL.replace(/\/$/, "");
  }

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol =
    forwardedProto ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${protocol}://${host}`;
}

export function googleCallbackUrl(origin: string) {
  return `${origin.replace(/\/$/, "")}/api/auth/google/callback`;
}
