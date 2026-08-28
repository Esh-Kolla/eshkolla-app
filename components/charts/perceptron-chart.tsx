"use client";

import { useEffect, useRef } from "react";

const GREEN = "#00ff41";
const CYAN = "#00d4ff";
const DIM = "#888888";
const GRID = "#1c1c1c";
const W = 640;
const H = 360;
const PAD = 42;

const POINTS: Array<[number, number, number]> = [
  [0.14, 0.23, -1], [0.20, 0.38, -1], [0.29, 0.18, -1],
  [0.34, 0.42, -1], [0.40, 0.28, -1], [0.47, 0.20, -1],
  [0.53, 0.66, 1], [0.60, 0.78, 1], [0.67, 0.58, 1],
  [0.72, 0.84, 1], [0.79, 0.67, 1], [0.87, 0.76, 1],
];

export default function PerceptronChart() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const plotW = W - PAD * 2;
    const plotH = H - PAD * 2;
    const X = (v: number) => PAD + v * plotW;
    const Y = (v: number) => H - PAD - v * plotH;

    let weights = [0.2, -0.1];
    let bias = -0.05;
    let step = 0;
    let mistakes = 0;
    let last = 0;
    let raf = 0;
    let restartTimer: ReturnType<typeof setTimeout> | undefined;

    const reset = () => {
      weights = [0.2, -0.1];
      bias = -0.05;
      step = 0;
      mistakes = 0;
      raf = requestAnimationFrame(draw);
    };

    const draw = (time: number) => {
      if (time - last > 460 && step < POINTS.length * 4) {
        last = time;
        const [x1, x2, label] = POINTS[step % POINTS.length];
        const prediction = weights[0] * x1 + weights[1] * x2 + bias >= 0 ? 1 : -1;
        if (prediction !== label) {
          weights[0] += 0.45 * label * x1;
          weights[1] += 0.45 * label * x2;
          bias += 0.45 * label;
          mistakes++;
        }
        step++;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = GRID;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = PAD + (i / 10) * plotW;
        const y = PAD + (i / 10) * plotH;
        ctx.beginPath(); ctx.moveTo(x, PAD); ctx.lineTo(x, H - PAD); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
      }

      const yAt = (x: number) => -(weights[0] * x + bias) / (weights[1] || 0.0001);
      ctx.strokeStyle = GREEN;
      ctx.shadowColor = GREEN;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(X(0), Y(yAt(0)));
      ctx.lineTo(X(1), Y(yAt(1)));
      ctx.stroke();
      ctx.shadowBlur = 0;

      const active = step === 0 ? -1 : (step - 1) % POINTS.length;
      POINTS.forEach(([x, y, label], index) => {
        ctx.beginPath();
        ctx.arc(X(x), Y(y), index === active ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = label === 1 ? CYAN : DIM;
        ctx.fill();
        if (index === active) {
          ctx.strokeStyle = GREEN;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      ctx.font = "12px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = DIM;
      ctx.fillText(`$ perceptron.fit — sample ${Math.min(step, POINTS.length * 4)}/${POINTS.length * 4}`, PAD, 22);
      ctx.textAlign = "right";
      ctx.fillStyle = GREEN;
      ctx.fillText(`updates=${mistakes}  boundary: ${weights[0].toFixed(2)}x₁ + ${weights[1].toFixed(2)}x₂ + ${bias.toFixed(2)} = 0`, W - PAD, 22);

      ctx.textAlign = "left";
      ctx.fillStyle = DIM;
      ctx.fillText("dim = class -1", PAD, H - 14);
      ctx.textAlign = "right";
      ctx.fillStyle = CYAN;
      ctx.fillText("cyan = class +1", W - PAD, H - 14);

      if (step < POINTS.length * 4) raf = requestAnimationFrame(draw);
      else restartTimer = setTimeout(reset, 3500);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      if (restartTimer) clearTimeout(restartTimer);
    };
  }, []);

  return (
    <figure data-visual="perceptron-training" className="my-8 rounded border border-terminal-border bg-black/30 p-4">
      <canvas
        ref={ref}
        aria-label="Animated perceptron learning a decision boundary between two classes"
        style={{ width: "100%", height: "auto", aspectRatio: `${W}/${H}` }}
      />
      <figcaption className="mt-2 font-mono text-xs text-dim">
        Each highlighted sample is classified once. The green boundary moves only after a mistake.
      </figcaption>
    </figure>
  );
}
