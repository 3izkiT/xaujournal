import { ADSENSE_CLIENT_ID } from "@/lib/monetization";

/** AdSense active when publisher ID is set (unless explicitly disabled). */
export function isAdSenseLive() {
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "false") return false;
  return Boolean(ADSENSE_CLIENT_ID?.startsWith("ca-pub-"));
}

export function adsensePublisherId() {
  const client = ADSENSE_CLIENT_ID;
  if (!client?.startsWith("ca-pub-")) return null;
  return client.replace("ca-pub-", "");
}

export const AD_SLOTS = {
  homeTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP ?? "",
  homeMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID ?? "",
  homeBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM ?? "",
} as const;
