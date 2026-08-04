"use client";

import { AgCharts } from "ag-charts-react";

interface ChartProps {
  title?: string;
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  yName?: string;
  type?: "bar" | "line" | "area";
}

/**
 * Data chart for blog posts, themed to match the terminal aesthetic.
 * Usage in MDX:
 *   <Chart title="Throughput" type="bar" xKey="model" yKey="tok"
 *     yName="tok/s" data={[{ model: "7B", tok: 68 }]} />
 */
export default function Chart({
  title,
  data,
  xKey,
  yKey,
  yName,
  type = "bar",
}: ChartProps) {
  if (!data || data.length === 0) return null;

  const series =
    type === "bar"
      ? [{ type: "bar" as const, xKey, yKey, yName: yName ?? yKey, fill: "#4ade80" }]
      : type === "line"
        ? [{ type: "line" as const, xKey, yKey, yName: yName ?? yKey, stroke: "#4ade80", marker: { fill: "#4ade80" } }]
        : [{ type: "area" as const, xKey, yKey, yName: yName ?? yKey, fill: "#4ade8033", stroke: "#4ade80" }];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    data,
    series,
    title: title
      ? { text: title, color: "#a1a1aa", fontSize: 13, fontFamily: "monospace" }
      : undefined,
    background: { fill: "transparent" },
    axes: [
      {
        type: type === "bar" ? "category" : "category",
        position: "bottom",
        label: { color: "#71717a", fontFamily: "monospace", fontSize: 11 },
        line: { stroke: "#3f3f46" },
        gridLine: { enabled: false },
      },
      {
        type: "number",
        position: "left",
        label: { color: "#71717a", fontFamily: "monospace", fontSize: 11 },
        line: { stroke: "#3f3f46" },
        gridLine: { style: [{ stroke: "#27272a", lineDash: [3, 3] }] },
      },
    ],
    legend: { enabled: false },
    padding: { top: 10, right: 10, bottom: 10, left: 10 },
  };

  return (
    <figure className="my-8 rounded border border-terminal-border bg-black/30 p-4">
      <div style={{ height: 300 }}>
        <AgCharts options={options} />
      </div>
    </figure>
  );
}
