import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#131722",
          color: "#d1d4dc",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "rgba(212, 175, 55, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 700,
              color: "#d4af37",
            }}
          >
            Au
          </div>
          <span style={{ fontSize: 64, fontWeight: 700, color: "#d4af37" }}>{BRAND_NAME}</span>
        </div>
        <p style={{ fontSize: 32, maxWidth: 900, lineHeight: 1.35, color: "#787b86" }}>{BRAND_TAGLINE}</p>
        <p style={{ fontSize: 24, marginTop: 24, color: "#089981" }}>XAUUSD · Manual journal · No MT5 sync</p>
      </div>
    ),
    { ...size }
  );
}
