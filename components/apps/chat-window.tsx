"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isThinking?: boolean;
}

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiHistory, setAiHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setInput("");
    setIsStreaming(true);

    // Add user message and a thinking placeholder for the assistant
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "", isThinking: true },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: aiHistory }),
      });

      if (!response.ok || !response.body) {
        throw new Error("AI request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        const currentText = fullText;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: currentText,
            isThinking: false,
          };
          return updated;
        });
      }

      // Update AI conversation history (cap at 20 messages)
      setAiHistory((prev) => {
        const updated = [
          ...prev,
          { role: "user" as const, content: text },
          { role: "assistant" as const, content: fullText },
        ];
        return updated.slice(-20);
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "AI systems offline. Please try again later.",
          isThinking: false,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend();
  }

  return (
    <div className="p-5 font-mono text-sm flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 mb-4">
        {messages.length === 0 && (
          <div className="text-dim text-center py-8">
            <p className="mb-2">Ask me anything about Eshwar,</p>
            <p>his work, or AI/ML topics.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              <div>
                <span className="text-accent">&gt; </span>
                <span className="text-foreground">{msg.content}</span>
              </div>
            ) : (
              <div className="ml-2">
                {msg.isThinking ? (
                  <span className="text-dim">
                    [thinking...]
                    <span className="cursor-blink" />
                  </span>
                ) : (
                  <pre className="text-muted whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-terminal-border pt-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-accent">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-foreground outline-none caret-foreground placeholder:text-dim disabled:opacity-50"
            autoComplete="off"
            spellCheck={false}
            disabled={isStreaming}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="text-accent hover:text-glow-accent disabled:text-dim disabled:cursor-not-allowed transition-colors px-2"
            aria-label="Send message"
          >
            &crarr;
          </button>
        </form>
      </div>
    </div>
  );
}
