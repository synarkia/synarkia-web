import { ImageResponse } from "next/og";

export const alt = "Syndao — Venture Lab & Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#060608",
          color: "#F4F1E9",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* concentric instrument rings */}
        <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", border: "1px solid rgba(244,241,233,0.10)", display: "flex" }} />
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", border: "1px solid rgba(244,241,233,0.14)", display: "flex" }} />
        <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(244,241,233,0.18)", display: "flex" }} />

        <div style={{ display: "flex", fontSize: 20, letterSpacing: 14, color: "#74726D", textTransform: "uppercase", marginBottom: 28 }}>
          Venture Lab &amp; Studio
        </div>
        <div style={{ display: "flex", fontSize: 132, letterSpacing: -2, lineHeight: 1 }}>Syndao</div>
        <div style={{ display: "flex", fontSize: 28, color: "#B6B3AB", marginTop: 32, maxWidth: 820, textAlign: "center" }}>
          Brands, websites, and automated systems for founders and small teams.
        </div>
      </div>
    ),
    { ...size }
  );
}
