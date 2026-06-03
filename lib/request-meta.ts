export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function clientUserAgent(request: Request): string {
  const ua = request.headers.get("user-agent")?.trim();
  if (!ua) return "Unknown device";
  return ua.length > 180 ? `${ua.slice(0, 177)}…` : ua;
}

export function loginTimeUtc() {
  return new Date().toUTCString();
}
