"use client";

import { useState, useEffect } from "react";

export default function TypingEffect({
  text,
  speed = 50,
  delay = 0,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onDone?.();
      return;
    }
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed, onDone]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span className="cursor-blink" />
      )}
    </span>
  );
}
