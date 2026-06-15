"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const fontSize = 14;
    let columns: number;
    let drops: number[];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      columns = Math.floor(canvas!.width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.random() * -100
      );
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx!.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < columns; i++) {
        if (drops[i] < 0) {
          drops[i] += 0.5;
          continue;
        }

        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character is brighter
        ctx!.fillStyle = "rgba(0, 255, 65, 0.8)";
        ctx!.font = `${fontSize}px monospace`;
        ctx!.fillText(char, x, y);

        // Trail characters are dimmer
        if (drops[i] > 1) {
          const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx!.fillStyle = "rgba(0, 255, 65, 0.15)";
          ctx!.fillText(trailChar, x, y - fontSize);
        }

        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
        }

        drops[i] += 0.5 + Math.random() * 0.5;
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.15 }}
    />
  );
}
