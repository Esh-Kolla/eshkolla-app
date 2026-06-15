"use client";

import { useState, FormEvent } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Subscription confirmed. Welcome aboard.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="mt-12 rounded-lg border border-terminal-border bg-terminal-bg p-5">
      <div className="text-xs text-dim mb-3">
        <span className="text-muted">$</span> cat subscribe.txt
      </div>
      <p className="text-sm text-muted mb-4">
        Get notified when new AI/ML posts drop. No spam. Unsubscribe anytime.
      </p>

      {status === "success" ? (
        <div className="text-sm">
          <span className="text-foreground">&gt; </span>
          <span className="text-accent">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-muted text-sm shrink-0">$ subscribe</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="your@email.com"
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-dim caret-foreground"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="text-sm text-accent hover:text-foreground transition-colors disabled:text-dim cursor-pointer"
          >
            {status === "loading" ? "..." : "[enter]"}
          </button>
        </form>
      )}

      {status === "error" && (
        <div className="text-sm mt-2">
          <span className="text-[#ff5f57]">error: </span>
          <span className="text-muted">{message}</span>
        </div>
      )}
    </div>
  );
}
