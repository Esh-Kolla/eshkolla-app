import { BIO } from "@/lib/data/bio";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Eshwar Kolla's personal AI assistant on his portfolio website eshwarkolla.com.
You speak in a concise, technical, friendly tone — like a senior engineer in a casual conversation.
You know Eshwar's full career, resume, projects, and blog content.
Answer questions about him, his work, AI/ML topics, or his journey.
Stay in character. If asked something you don't know about Eshwar, say so honestly.
Keep responses short (2-4 sentences) unless asked for detail.
Use plain text — no markdown formatting, no bullet points, no headers.
You're being displayed in a terminal, so keep it clean and concise.

RESUME DATA:
Name: ${BIO.name}
Title: ${BIO.title} at ${BIO.company}
Location: ${BIO.location} (from ${BIO.from})
Email: ${BIO.email}
Tagline: ${BIO.tagline}

Education:
${BIO.education.map((e) => `- ${e.school}: ${e.degree}${"year" in e ? ` (${e.year})` : ""}${"note" in e ? ` — ${e.note}` : ""}`).join("\n")}

Career Journey:
${BIO.journey.join("\n\n")}

Current Projects:
${BIO.projects.map((p) => `- ${p.name} (${p.url}): ${p.description}`).join("\n")}

Skills:
${BIO.skills.map((cat) => `${cat.label}: ${cat.items.join(", ")}`).join("\n")}

Social:
- GitHub: ${BIO.social.github}
- LinkedIn: ${BIO.social.linkedin}
- X: ${BIO.social.x}`;

// Local Hermes proxy (OpenAI-compatible, backed by Nous OAuth) running on the
// host machine. In Docker the container reaches it via host.docker.internal
// (mapped in docker-compose.yml); in local dev it's plain localhost.
const CHAT_BACKEND =
  process.env.CHAT_BACKEND_URL ??
  (process.env.NODE_ENV === "production"
    ? "http://host.docker.internal:8645/v1/chat/completions"
    : "http://127.0.0.1:8645/v1/chat/completions");
const CHAT_MODEL = process.env.CHAT_MODEL ?? "z-ai/glm-5.2";

export async function POST(request: Request) {
  const { message, history } = await request.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(Array.isArray(history) ? history : []).map(
      (h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.content,
      })
    ),
    { role: "user", content: message },
  ];

  const upstream = await fetch(CHAT_BACKEND, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer local",
    },
    body: JSON.stringify({ model: CHAT_MODEL, messages, stream: true }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return Response.json(
      { error: `Chat backend error (${upstream.status})`, detail: detail.slice(0, 200) },
      { status: 502 }
    );
  }

  // Convert upstream SSE stream into a plain text stream for the client.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        } catch {
          // partial JSON chunk; skip
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
