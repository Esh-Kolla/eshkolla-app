"use client";

import { useState, useRef, useEffect } from "react";

const NEOFETCH = `
  ┌───────────────────────────────────┐
  │  eshwar@kolla                     │
  │  ─────────────                    │
  │  OS: Builder Linux 3.0            │
  │  Role: Cofounder & CTO @ Alvva    │
  │  Location: Palo Alto, CA 🇺🇸       │
  │  From: India 🇮🇳                   │
  │  Uptime: 12+ years               │
  │  Education: Harrisburg (MS DS&ML) │
  │  Shell: /bin/build                │
  │  Exit: Sold Foresee Health to PE  │
  │  Hobbies: Cycling, Pickle Ball    │
  └───────────────────────────────────┘`;

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  about        — who is eshwar?
  experience   — full career timeline
  education    — degrees & certifications
  skills       — technical skills by category
  highlights   — key numbers & impact
  building     — what I'm building now
  neofetch     — system info
  contact      — get in touch
  blog         — read my AI/ML journal
  resume       — view LinkedIn
  sudo hire-me — try it ;)
  clear        — clear terminal

Or just ask me anything — I have AI superpowers.`,

  about: `Eshwar Kolla — Cofounder & CTO at Alvva.

12+ years driving SaaS & B2B success in fintech,
AI, ML, and data. Co-founded an AI-powered healthcare
platform (sold to PE). Built sales analytics tools
for 1000+ managers at a $4B global sales org.

Currently building legal tech at Alvva — AI that
helps immigrants navigate their American dream.
Pursuing MS in Data Science & ML at Harrisburg.`,

  experience: `  Deloitte Consulting    2013-2014  Project Controller
                                        $400M project audit
  Swastiks Food          2014-2016  Product Lead
                                        $300M rev, 92% forecast accuracy
  Chapman University     2015-2018  MBA + Instructor
                                        Stats, Finance, R Statistics
  Karma Koins            2017-2020  Founder & CEO
                                        $200K seed, 0→10K users in 7mo
  Prudential             2018-2019  Product Manager
                                        Robo advisor, 33% satisfaction↑
  Poly                   2019-2022  Product Manager
                                        $4B sales org, 85% quota accuracy
  Foresee Health         2022-2025  Cofounder, Product
                                        Gen AI healthcare, sold to PE
  Alchemy Tech Labs      2024-now   Cofounder, Engineering
                                        AI frameworks, 5 enterprise partners
  Alvva                  current    Cofounder & CTO
                                        Legal tech, immigration AI`,

  education: `  Jain University          B.Com Finance & Capital Markets
  Chapman University       MBA (2015-2017)
                           $40K Graduate Fellowship
                           Supplemental Instructor
  Harrisburg University    MS Data Science & ML
                           Expected May 2026`,

  skills: `  ai-ml/
    python  pytorch  scikit-learn  hugging-face
    llms  nlp  nltk  spacy  pinecone

  data/
    sql  pandas  numpy  snowflake  databricks
    bigquery  powerbi  tableau  plotly  matplotlib
    seaborn  dax  alteryx

  cloud/
    aws  gcp  docker  salesforce  oracle-db

  frontend/
    react  next.js  typescript  node.js  jest
    html  css  javascript

  product/
    agile  scrum  jira  confluence  figma
    a-b-testing  gtm-strategy  roadmapping
    product-lifecycle  stakeholder-mgmt

  languages/
    python  r  sql  typescript  javascript`,

  highlights: `  $200K    seed funding raised (Karma Koins)
  10,000   users acquired in 7 months (Karma Koins)
  $4B      global sales org managed (Poly)
  $3M+     transactions in 4 months (Foresee Health)
  $300M    revenue managed (Swastiks Food)
  92%      forecast accuracy, ARIMA models
  85%      quota accuracy via ML (Poly)
  60%      employee retention increase (Poly)
  45%      patient inquiries reduced via Gen AI
  30%      client payment increase (Foresee Health)
  500%     infrastructure scalability gain (AWS)
  1        exit — sold Foresee Health to PE`,

  building: `Currently building:

  alvva.co     — Immigration tech platform.
                 Helps immigrants file USCIS applications
                 at 1/10th the cost of attorneys.
                 99.7% approval rate.
                 Backed by Google, AWS, Berkeley SkyDeck.

  alvvaos.com  — AI Operating System for immigration
                 law firms. Agentic AI fine-tuned on
                 thousands of real USCIS filings.
                 White-label platform with unified
                 messaging (SMS, email, WhatsApp).`,

  neofetch: NEOFETCH,

  contact: `  github    → github.com/eshwarkolla
  linkedin  → linkedin.com/in/eshwarkolla
  x/twitter → x.com/eshwarkolla
  email     → eshwar.kolla@outlook.com`,

  resume: `Opening LinkedIn...
→ linkedin.com/in/eshwarkolla`,

  "sudo hire-me": `[sudo] password for visitor: ********
Permission granted.

  ╔═══════════════════════════════════╗
  ║  Let's build something together.  ║
  ║  Reach out on LinkedIn or X.      ║
  ╚═══════════════════════════════════╝`,
};

interface HistoryEntry {
  command: string;
  output: string;
  isThinking?: boolean;
}

export default function CommandInput() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [aiHistory, setAiHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  async function handleAIChat(message: string) {
    setIsStreaming(true);

    // Add user message with a thinking indicator
    setHistory((prev) => [
      ...prev,
      { command: message, output: "", isThinking: true },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: aiHistory }),
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
        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            command: message,
            output: currentText,
            isThinking: false,
          };
          return updated;
        });
      }

      // Add to AI conversation history (cap at 20 turns)
      setAiHistory((prev) => {
        const updated = [
          ...prev,
          { role: "user" as const, content: message },
          { role: "assistant" as const, content: fullText },
        ];
        return updated.slice(-20);
      });
    } catch {
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          command: message,
          output:
            "AI systems offline. Try a built-in command — type 'help' for the list.",
          isThinking: false,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      // Re-focus the input after streaming completes
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isStreaming) return;

    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (cmd === "blog") {
      setHistory((prev) => [
        ...prev,
        { command: cmd, output: "Redirecting to /blog..." },
      ]);
      setInput("");
      window.location.href = "/blog";
      return;
    }

    if (cmd === "resume") {
      setHistory((prev) => [
        ...prev,
        { command: cmd, output: COMMANDS.resume },
      ]);
      setInput("");
      window.open("https://linkedin.com/in/eshwarkolla", "_blank");
      return;
    }

    // Check if it's a built-in command
    if (COMMANDS[cmd]) {
      setHistory((prev) => [...prev, { command: cmd, output: COMMANDS[cmd] }]);
      setInput("");
      return;
    }

    // Unknown command — send to AI chatbot
    setInput("");
    handleAIChat(cmd);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  }

  return (
    <div
      className="border border-terminal-border rounded-lg bg-terminal-bg overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-terminal-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-muted ml-2">
          interactive — type &apos;help&apos;
        </span>
      </div>

      <div ref={containerRef} className="p-4 max-h-80 overflow-y-auto font-mono text-sm">
        {history.map((entry, i) => (
          <div key={i} className="mb-3">
            <div>
              <span className="text-accent">$</span>{" "}
              <span className="text-foreground">{entry.command}</span>
            </div>
            {entry.isThinking ? (
              <pre className="text-muted whitespace-pre-wrap mt-1 text-xs leading-relaxed">
                <span className="text-dim">[thinking...]</span>
                <span className="cursor-blink" />
              </pre>
            ) : (
              <pre className="text-muted whitespace-pre-wrap mt-1 text-xs leading-relaxed">
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-accent mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground outline-none caret-foreground disabled:opacity-50"
            autoComplete="off"
            spellCheck={false}
            disabled={isStreaming}
            aria-label="Terminal command input"
          />
        </form>
      </div>
    </div>
  );
}
