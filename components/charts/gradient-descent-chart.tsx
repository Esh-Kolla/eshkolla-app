"use client";

import { useEffect, useRef } from "react";

// Synthetic dataset: spending vs sales (normalized 0-1)
const POINTS: [number, number][] = [
  [0.08, 0.14], [0.14, 0.2], [0.2, 0.16], [0.24, 0.3], [0.3, 0.28],
  [0.36, 0.42], [0.4, 0.36], [0.46, 0.5], [0.52, 0.46], [0.56, 0.6],
  [0.62, 0.56], [0.66, 0.7], [0.72, 0.66], [0.78, 0.8], [0.84, 0.74],
  [0.9, 0.88], [0.94, 0.84],
];

const GREEN = "#00ff41";
const CYAN = "#00d4ff";
const DIM = "#888888";
const GRID = "#1c1c1c";
const W = 640;
const H = 340;
const PAD = { top: 40, right: 24, bottom: 44, left: 52 };

function mse(w: number, b: number) {
  return POINTS.reduce((s, [x, y]) => s + (y - (w * x + b)) ** 2, 0) / POINTS.length;
}

/** Animated gradient descent: the regression line converging live. */
export default function GradientDescentChart() {
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

    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const X = (v: number) => PAD.left + v * plotW;
    const Y = (v: number) => PAD.top + plotH - v * plotH;

    let w = 0;
    let b = 0;
    const lr = 0.6;
    let epoch = 0;
    const maxEpochs = 120;
    let raf: number;
    let last = 0;

    const draw = (t: number) => {
      // ~30 epochs/sec
      if (t - last > 33 && epoch < maxEpochs) {
        last = t;
        // numerical gradients of MSE
        let dw = 0;
        let db = 0;
        for (const [x, y] of POINTS) {
          dw += -2 * x * (y - (w * x + b));
          db += -2 * (y - (w * x + b));
        }
        dw /= POINTS.length;
        db /= POINTS.length;
        w -= lr * dw * 0.1;
        b -= lr * db * 0.1;
        epoch++;
      }

      ctx.clearRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = GRID;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 8; i++) {
        const gx = PAD.left + (i / 8) * plotW;
        const gy = PAD.top + (i / 8) * plotH;
        ctx.beginPath(); ctx.moveTo(gx, PAD.top); ctx.lineTo(gx, PAD.top + plotH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PAD.left, gy); ctx.lineTo(PAD.left + plotW, gy); ctx.stroke();
      }

      // residual lines (data point -> regression line)
      ctx.strokeStyle = "rgba(0, 212, 255, 0.25)";
      ctx.lineWidth = 1;
      for (const [x, y] of POINTS) {
        ctx.beginPath();
        ctx.moveTo(X(x), Y(y));
        ctx.lineTo(X(x), Y(w * x + b));
        ctx.stroke();
      }

      // regression line
      ctx.strokeStyle = GREEN;
      ctx.lineWidth = 2;
      ctx.shadowColor = GREEN;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(X(0), Y(b));
      ctx.lineTo(X(1), Y(w + b));
      ctx.stroke();
      ctx.shadowBlur = 0;

      // data points
      ctx.fillStyle = CYAN;
      for (const [x, y] of POINTS) {
        ctx.beginPath();
        ctx.arc(X(x), Y(y), 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // HUD
      ctx.font = "12px ui-monospace, monospace";
      ctx.fillStyle = DIM;
      ctx.textAlign = "left";
      ctx.fillText(`$ gradient descent — epoch ${epoch}`, PAD.left, 20);
      ctx.textAlign = "right";
      ctx.fillStyle = GREEN;
      ctx.fillText(`w=${w.toFixed(3)}  b=${b.toFixed(3)}  mse=${mse(w, b).toFixed(4)}`, W - PAD.right, 20);

      // axis labels
      ctx.fillStyle = DIM;
      ctx.textAlign = "center";
      ctx.fillText("spending →", PAD.left + plotW / 2, H - 12);
      ctx.save();
      ctx.translate(14, PAD.top + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("sales →", 0, 0);
      ctx.restore();

      if (epoch < maxEpochs) raf = requestAnimationFrame(draw);
      else {
        // hold final frame, restart after pause
        setTimeout(() => {
          w = 0; b = 0; epoch = 0;
          raf = requestAnimationFrame(draw);
        }, 4000);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <figure className="my-8 rounded border border-terminal-border bg-black/30 p-4">
      <canvas ref={ref} style={{ width: "100%", height: "auto", aspectRatio: `${W}/${H}` }} />
      <figcaption className="text-xs text-dim font-mono mt-2">
        Live: line starts flat, gradient descent walks it to the best fit. Cyan whiskers are the errors being minimized.
      </figcaption>
    </figure>
  );
}
