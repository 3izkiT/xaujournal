/** User-facing brand — single source of truth for copy and SEO. */
export const BRAND_NAME = "XAURite";
export const BRAND_SLUG = "xaurite";
export const BRAND_TAGLINE = "Your XAUUSD discipline rite — log every trade on purpose";
export const BRAND_SHORT = "Intentional XAUUSD discipline journal";
export const BRAND_FOOTER = "Manual reflection for high-discipline gold trading";

export const DEMO_EMAIL = "demo@xaurite.app";
export const DEMO_PASSWORD = "xaurite2026";

/** localStorage trade cache key prefix */
export function tradesStorageKey(userId: string) {
  return `${BRAND_SLUG}-trades-${userId}`;
}

export const LEGACY_TRADES_KEY_PREFIX = "xaujournal-trades-";
