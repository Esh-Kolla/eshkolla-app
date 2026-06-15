"use client";

export default function TerminalWindow({
  title = "terminal",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-terminal-border bg-terminal-bg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-terminal-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-muted ml-2">{title}</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}
