import { getGeminiModel } from "@/lib/gemini";

export async function POST(request: Request) {
  const { message, history } = await request.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const model = getGeminiModel();

  const chat = model.startChat({
    history: (history || []).map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    })),
  });

  const result = await chat.sendMessageStream(message);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
