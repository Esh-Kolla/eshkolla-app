"use client";

interface PipelineProps {
  title?: string;
}

const NODES = [
  { label: "intake", sub: "whatsapp" },
  { label: "extract", sub: "vision models" },
  { label: "draft", sub: "I-485 / I-130" },
  { label: "assemble", sub: "exhibits" },
  { label: "sign-off", sub: "attorney" },
];

const GREEN = "#00ff41";
const CYAN = "#00d4ff";
const DIM = "#888888";
const GRID = "#141414";

/** AlvvaOS case pipeline diagram — no props needed in MDX. */
export default function PipelineDiagram({ title = "alvvaos case pipeline" }: PipelineProps) {
  const nodeW = 150;
  const nodeH = 56;
  const gap = 46;
  const padX = 24;
  const padTop = 46;
  const W = padX * 2 + NODES.length * nodeW + (NODES.length - 1) * gap;
  const H = padTop + nodeH + 20;

  return (
    <figure className="my-8 rounded border border-terminal-border bg-black/30 p-4 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }} role="img" aria-label={title}>
        <defs>
          <pattern id="pipegrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={GRID} strokeWidth="0.5" />
          </pattern>
          <marker id="pipearrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="none" stroke={CYAN} strokeWidth="1.5" />
          </marker>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#pipegrid)" rx="6" />
        <text x={padX} y={26} fill={DIM} fontSize="12" fontFamily="ui-monospace, monospace">
          <tspan fill={CYAN}>$</tspan> {title}
        </text>
        {NODES.slice(0, -1).map((_, i) => {
          const x1 = padX + (i + 1) * nodeW + i * gap;
          const y = padTop + nodeH / 2;
          return <line key={i} x1={x1 + 6} y1={y} x2={x1 + gap - 8} y2={y} stroke={CYAN} strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#pipearrow)" />;
        })}
        {NODES.map((n, i) => {
          const x = padX + i * (nodeW + gap);
          return (
            <g key={n.label}>
              <rect x={x} y={padTop} width={nodeW} height={nodeH} rx="6" fill="#0a0a0a" />
              <rect x={x} y={padTop} width={nodeW} height={nodeH} rx="6" fill="rgba(0,255,65,0.05)" stroke={GREEN} strokeWidth="1.2" />
              <text x={x + nodeW / 2} y={padTop + 24} textAnchor="middle" fill={GREEN} fontSize="13" fontFamily="ui-monospace, monospace">{n.label}</text>
              <text x={x + nodeW / 2} y={padTop + 42} textAnchor="middle" fill={DIM} fontSize="10" fontFamily="ui-monospace, monospace">{n.sub}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
