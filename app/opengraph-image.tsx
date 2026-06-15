import { ImageResponse } from "next/og";

export const alt = "Eshwar Kolla — Cofounder & CTO at Alvva";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "monospace",
        }}
      >
        <div style={{ color: "#00ff41", fontSize: 64, fontWeight: 700, display: "flex" }}>
          Eshwar Kolla
        </div>
        <div style={{ color: "#00d4ff", fontSize: 28, marginTop: 16, display: "flex" }}>
          Cofounder &amp; CTO at Alvva
        </div>
        <div style={{ color: "#888888", fontSize: 20, marginTop: 24, display: "flex" }}>
          AI/ML Builder • 12+ Years • eshwarkolla.com
        </div>
      </div>
    ),
    { ...size }
  );
}
