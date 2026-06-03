import { adsensePublisherId, isAdSenseLive } from "@/lib/adsense";

export function GET() {
  const pub = adsensePublisherId();
  if (!isAdSenseLive() || !pub) {
    return new Response("# AdSense: set NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXX\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const body = `google.com, pub-${pub}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
