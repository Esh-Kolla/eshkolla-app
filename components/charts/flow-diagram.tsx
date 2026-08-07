interface FlowNode {
  label: string;
  sub?: string;
}

interface FlowDiagramProps {
  title?: string;
  nodes: FlowNode[];
}

const GREEN = "#00ff41";
const CYAN = "#00d4ff";
const DIM = "#888888";
const BORDER = "#1a1a1a";
const GRID = "#141414";

/**
 * Terminal-styled SVG pipeline diagram for blog posts.
 * Usage in MDX:
 *   <FlowDiagram title="case pipeline" nodes={[
 *     { label: "intake", sub: "whatsapp" },
 *     { label: "extract", sub: "vision model" },
 *   ]} />
 */
export default function FlowDiagram({ title, nodes }: FlowDiagramProps) {
  if (!nodes || nodes.length === 0) return null;

  const nodeW = 150;
  const nodeH = 56;
  const gap = 46;
  const padX = 24;
  const padTop = title ? 46 : 24;
  const padBottom = 20;
  const W = padX * 2 + nodes.length * nodeW + (nodes.length - 1) * gap;
  const H = padTop + nodeH + padBottom;

  return (
    <figure className="my-8 rounded border border-terminal-border bg-black/30 p-4 overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }}
        role="img"
        aria-label={title ?? "pipeline diagram"}
      >
        <defs>
          <pattern id="flowgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={GRID} strokeWidth="0.5" />
          </pattern>
          <marker id="flowarrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="none" stroke={CYAN} strokeWidth="1.5" />
          </marker>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#flowgrid)" rx="6" />

        {title && (
          <text x={padX} y={26} fill={DIM} fontSize="12" fontFamily="ui-monospace, monospace">
            <tspan fill={CYAN}>$</tspan> {title}
          </text>
        )}

        {/* arrows first so they sit behind nodes */}
        {nodes.slice(0, -1).map((_, i) => {
          const x1 = padX + (i + 1) * nodeW + i * gap;
          const y = padTop + nodeH / 2;
          return (
            <line
              key={`a-${i}`}
              x1={x1 + 6}
              y1={y}
              x2={x1 + gap - 8}
              y2={y}
              stroke={CYAN}
              strokeWidth="1.5"
              strokeDasharray="5 4"
              markerEnd="url(#flowarrow)"
            />
          );
        })}

        {nodes.map((n, i) => {
          const x = padX + i * (nodeW + gap);
          const y = padTop;
          return (
            <g key={n.label}>
              {/* opaque base so the arrow never shows through */}
              <rect x={x} y={y} width={nodeW} height={nodeH} rx="6" fill="#0a0a0a" />
              <rect
                x={x}
                y={y}
                width={nodeW}
                height={nodeH}
                rx="6"
                fill="rgba(0,255,65,0.05)"
                stroke={GREEN}
                strokeWidth="1.2"
              />
              <text
                x={x + nodeW / 2}
                y={y + (n.sub ? 24 : nodeH / 2 + 4)}
                textAnchor="middle"
                fill={GREEN}
                fontSize="13"
                fontFamily="ui-monospace, monospace"
              >
                {n.label}
              </text>
              {n.sub && (
                <text
                  x={x + nodeW / 2}
                  y={y + 42}
                  textAnchor="middle"
                  fill={DIM}
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                >
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
