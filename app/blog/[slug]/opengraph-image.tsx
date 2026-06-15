import { ImageResponse } from "next/og";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";

export const alt = "Blog post preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title || slug;
  const date = post?.date || "";

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
          padding: "60px 80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ color: "#00ff41", fontSize: 24, marginBottom: 20, display: "flex" }}>
          $ cat ai-journal/{slug}.mdx
        </div>
        <div style={{ color: "#00ff41", fontSize: 48, fontWeight: 700, lineHeight: 1.2, display: "flex" }}>
          {title}
        </div>
        <div style={{ color: "#888888", fontSize: 20, marginTop: 20, display: "flex" }}>
          {date} • eshwarkolla.com
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            color: "#00d4ff",
            fontSize: 18,
            display: "flex",
          }}
        >
          Eshwar Kolla — AI/ML Builder
        </div>
      </div>
    ),
    { ...size }
  );
}
