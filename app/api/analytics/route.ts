import { trackPageView } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { path, referrer } = await request.json();

    if (!path || typeof path !== "string") {
      return Response.json({ error: "Path is required" }, { status: 400 });
    }

    trackPageView(path, referrer);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to track" }, { status: 500 });
  }
}
