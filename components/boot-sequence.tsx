"use client";

import { useState, useEffect, useCallback } from "react";

const BOOT_LINES = [
  { text: "[BIOS] Eshwar Kolla Personal System v2.0", color: "text-foreground" },
  { text: "[OK] Loading kernel modules...", color: "text-muted" },
  { text: "[OK] Initializing neural networks...", color: "text-muted" },
  { text: "[OK] Mounting /dev/ambition...", color: "text-muted" },
  { text: "[OK] Starting AI/ML subsystems...", color: "text-muted" },
  { text: "[OK] Validating 3 degrees...", color: "text-muted" },
  { text: "[OK] Connecting to alvva.co...", color: "text-muted" },
  { text: "[OK] Loading 12+ years of experience...", color: "text-muted" },
  { text: "", color: "" },
  { text: "[READY] System online. Welcome.", color: "text-foreground text-glow" },
];

export default function BootSequence({
  children,
}: {
  children: React.ReactNode;
}) {
  const [booting, setBooting] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("ek-booted");
    if (hasBooted) {
      setDone(true);
      setBooting(false);
      return;
    }
    setDone(false);
    setBooting(true);
  }, []);

  const finishBoot = useCallback(() => {
    setFadeOut(true);
    sessionStorage.setItem("ek-booted", "1");
    setTimeout(() => {
      setBooting(false);
      setDone(true);
    }, 600);
  }, []);

  useEffect(() => {
    if (!booting) return;

    if (visibleLines < BOOT_LINES.length) {
      const delay = visibleLines === 0 ? 300 : 200 + Math.random() * 200;
      const timeout = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(finishBoot, 800);
      return () => clearTimeout(timeout);
    }
  }, [booting, visibleLines, finishBoot]);

  if (done && !booting) return <>{children}</>;

  if (booting) {
    return (
      <div
        className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="font-mono text-sm space-y-1 max-w-xl px-6">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={line.color}>
              {line.text === "" ? <br /> : line.text}
            </div>
          ))}
          {visibleLines < BOOT_LINES.length && (
            <span className="cursor-blink" />
          )}
        </div>
      </div>
    );
  }

  return null;
}
