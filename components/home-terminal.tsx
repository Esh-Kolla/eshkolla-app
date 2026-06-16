"use client";

import { useState } from "react";
import TerminalWindow from "@/components/terminal-window";
import TypingEffect from "@/components/typing-effect";
import CommandInput from "@/components/command-input";
import { BIO } from "@/lib/data/bio";

const ASCII_NAME = ` _____ ____  _   ___        ___    ____
| ____/ ___|| | | \\ \\      / / \\  |  _ \\
|  _| \\___ \\| |_| |\\ \\ /\\ / / _ \\ | |_) |
| |___ ___) |  _  | \\ V  V / ___ \\|  _ <
|_____|____/|_| |_|  \\_/\\_/_/   \\_\\_| \\_\\`;

/** Shared inner content used by both HomeTerminal and HomeTerminalContent */
function TerminalInner({
  step,
  setStep,
}: {
  step: number;
  setStep: (s: number | ((prev: number) => number)) => void;
}) {
  return (
    <>
      <div className="glitch mb-6" data-text={ASCII_NAME}>
        <pre className="text-foreground text-glow text-xs leading-tight">
          {ASCII_NAME}
        </pre>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-accent">$</span>{" "}
          <TypingEffect
            text="whoami"
            speed={80}
            onDone={() => setStep(1)}
          />
        </div>

        {step >= 1 && (
          <div className="ml-4 text-[#cccccc]">
            <p>
              <strong className="text-foreground">{BIO.name}</strong>{" "}
              <span className="text-sm">🇮🇳 🇺🇸</span> — {BIO.title} at{" "}
              <a
                href={BIO.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-glow-accent underline underline-offset-2"
              >
                {BIO.company}
              </a>
              .
            </p>
            <p className="text-muted mt-1">
              {BIO.tagline}
            </p>
          </div>
        )}

        {step >= 1 && (
          <div>
            <span className="text-accent">$</span>{" "}
            <TypingEffect
              text="cat journey.txt"
              speed={60}
              delay={300}
              onDone={() => setStep(2)}
            />
          </div>
        )}

        {step >= 2 && (
          <div className="ml-4 text-[#cccccc] space-y-2">
            <p>
              Deloitte Consulting in Bangalore → Swastiks Food ($300M
              revenue, built predictive models with 92% forecast accuracy) →
              Chapman University MBA ($40K fellowship) → founded{" "}
              <span className="text-foreground">Karma Koins</span>{" "}
              (raised $200K seed, 0 to 10K users in 7 months).
            </p>
            <p>
              Product at Prudential (robo advisor, 33% satisfaction increase)
              &amp; Poly ($4B global sales org, ML-powered quota accuracy to
              85%, employee retention up 60%).
            </p>
            <p>
              Co-founded{" "}
              <span className="text-foreground">Foresee Health</span> — Gen
              AI healthcare platform, $3M+ in transactions within 4 months,
              boosted client payments by 30%.{" "}
              <span className="text-foreground">
                Sold it to private equity.
              </span>
            </p>
            <p>
              Then co-founded{" "}
              <span className="text-foreground">Alchemy Tech Labs</span> —
              AI frameworks for enterprise data extraction &amp; autonomous
              agent platform. 5 enterprise design partners.
            </p>
            <p className="text-dim italic">
              Now Cofounder &amp; CTO at Alvva, building AlvvaOS — an AI
              operating system for immigration law firms. Pursuing MS in Data
              Science &amp; ML at Harrisburg University.
            </p>
          </div>
        )}

        {step >= 2 && (
          <div>
            <span className="text-accent">$</span>{" "}
            <TypingEffect
              text="ls building/"
              speed={60}
              delay={300}
              onDone={() => setStep(3)}
            />
          </div>
        )}

        {step >= 3 && (
          <div className="ml-4 mt-1 space-y-3">
            {BIO.projects.map((project) => (
              <div key={project.name} className="border border-terminal-border rounded p-3 bg-[#0d0d0d]">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-glow-accent font-semibold"
                >
                  {project.name}
                </a>
                <p className="text-muted text-xs mt-1">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {step >= 3 && (
          <div className="mt-4">
            <span className="text-accent">$</span>{" "}
            <TypingEffect
              text="ls skills/"
              speed={60}
              delay={300}
              onDone={() => setStep(4)}
            />
          </div>
        )}

        {step >= 4 && (
          <div className="ml-4 mt-1 space-y-3">
            {BIO.skills.map((cat) => (
              <div key={cat.label}>
                <span className="text-dim text-xs">{cat.label}/</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {cat.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded border border-terminal-border text-foreground hover:text-glow transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step >= 4 && (
          <div className="mt-4">
            <span className="text-accent">$</span>{" "}
            <TypingEffect
              text="tail -f ai-journal.log"
              speed={60}
              delay={300}
              onDone={() => setStep(5)}
            />
          </div>
        )}

        {step >= 5 && (
          <div className="ml-4 mt-2">
            <p className="text-muted text-sm mb-3">
              I write about one AI/ML topic every day →{" "}
              <a
                href="/blog"
                className="text-accent hover:text-glow-accent underline underline-offset-2"
              >
                /blog
              </a>
            </p>
          </div>
        )}

        {step >= 5 && (
          <div className="mt-2">
            <span className="text-accent">$</span>{" "}
            <span className="cursor-blink" />
          </div>
        )}
      </div>
    </>
  );
}

export default function HomeTerminal() {
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-6 relative z-10">
      <TerminalWindow title="eshwar@kolla: ~">
        <TerminalInner step={step} setStep={setStep} />
      </TerminalWindow>

      {step >= 5 && (
        <>
          <CommandInput />

          <div className="flex gap-4 text-sm">
            <a
              href={BIO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              github
            </a>
            <a
              href={BIO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              linkedin
            </a>
            <a
              href={BIO.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              x.com
            </a>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Desktop-window variant: same terminal content but without the
 * TerminalWindow chrome (the desktop Window provides that) and without the
 * social links (the dock handles those).  Includes CommandInput at the bottom.
 */
export function HomeTerminalContent() {
  const [step, setStep] = useState(0);

  return (
    <div className="p-5 font-mono text-sm leading-relaxed">
      <TerminalInner step={step} setStep={setStep} />
      {step >= 5 && (
        <div className="mt-6">
          <CommandInput />
        </div>
      )}
    </div>
  );
}
