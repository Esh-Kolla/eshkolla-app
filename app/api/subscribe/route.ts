import { addSubscriber } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    const result = addSubscriber(email.trim().toLowerCase());

    if (result.success) {
      return Response.json({ ok: true, message: "Subscribed successfully" });
    } else {
      return Response.json({ ok: false, error: result.error }, { status: 409 });
    }
  } catch {
    return Response.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
