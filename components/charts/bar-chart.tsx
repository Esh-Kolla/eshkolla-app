interface BarChartDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  title?: string;
  unit?: string;
  data: BarChartDataPoint[];
}

/**
 * Terminal-styled horizontal bar chart for blog posts.
 * Usage in MDX:
 *   <BarChart title="Tokens/sec" unit="tok/s" data={[{ label: "A100", value: 3120 }]} />
 */
export default function BarChart({ title, unit, data }: BarChartProps) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value));
  const labelWidth = Math.max(...data.map((d) => d.label.length));

  return (
    <figure className="my-8 rounded border border-terminal-border bg-black/30 p-4 overflow-x-auto">
      {title && (
        <figcaption className="text-xs text-dim mb-3 font-mono">
          <span className="text-accent">$</span> {title}
          {unit ? ` (${unit})` : ""}
        </figcaption>
      )}
      <div className="font-mono text-xs leading-6 whitespace-pre">
        {data.map((d) => {
          const barLen = Math.max(1, Math.round((d.value / max) * 40));
          return (
            <div key={d.label} className="flex items-center gap-2">
              <span className="text-dim text-right" style={{ width: `${labelWidth}ch` }}>
                {d.label}
              </span>
              <span className="text-accent">{"█".repeat(barLen)}</span>
              <span className="text-muted">
                {d.value.toLocaleString()}
                {unit ? ` ${unit}` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
