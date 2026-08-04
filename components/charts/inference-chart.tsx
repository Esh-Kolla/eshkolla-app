"use client";

import { useEffect, useRef, useState } from "react";

const DATA = [
  { model: "7B", tok: 68 },
  { model: "13B", tok: 41 },
  { model: "34B", tok: 17 },
  { model: "70B", tok: 6 },
];

const W = 640;
const H = 300;
const PAD = { top: 36, right: 16, bottom: 40, left: 48 };
const GREEN = "#4ade80";
const DIM = "#71717a";
const GRID = "#27272a";

export default function InferenceChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const max = Math.max(...DATA.map((d) => d.tok));

    ctx.font = "11px ui-monospace, monospace";

    // gridlines + y labels
    for (let i = 0; i <= 4; i++) {
      const v = Math.round((max / 4) * i);
      const y = PAD.top + plotH - (i / 4) * plotH;
      ctx.strokeStyle = GRID;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + plotW, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = DIM;
      ctx.textAlign = "right";
      ctx.fillText(String(v), PAD.left - 8, y + 4);
    }

    // bars (animated height)
    const bw = plotW / DATA.length;
    DATA.forEach((d, i) => {
      const h = (d.tok / max) * plotH * progress;
      const x = PAD.left + i * bw + bw * 0.2;
      const y = PAD.top + plotH - h;
      ctx.fillStyle = GREEN;
      ctx.fillRect(x, y, bw * 0.6, h);
      // value label
      ctx.fillStyle = DIM;
      ctx.textAlign = "center";
      if (progress > 0.95) ctx.fillText(`${d.tok}`, x + bw * 0.3, y - 6);
      // x label
      ctx.fillText(d.model, x + bw * 0.3, PAD.top + plotH + 20);
    });

    // title
    ctx.fillStyle = DIM;
    ctx.textAlign = "left";
    ctx.fillText("$ llama.cpp throughput, M4 Pro, Q4_K_M (tok/s)", PAD.left, 20);
  }, [progress]);

  return (
    <figure className="my-8 rounded border border-terminal-border bg-black/30 p-4">
      <canvas ref={ref} style={{ width: "100%", height: "auto", aspectRatio: `${W}/${H}` }} />
    </figure>
  );
}
