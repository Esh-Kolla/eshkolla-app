import { ReactNode } from "react";

/**
 * Styled terminal session block for blog posts.
 * Usage in MDX:
 *   <Terminal title="case intake">
 *     $ alvva intake --case I-485
 *     ✓ passport scanned (MRZ parsed)
 *   </Terminal>
 */
export default function Terminal({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-8 rounded-lg border border-terminal-border overflow-hidden bg-[#0a0a0a]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-terminal-border bg-black/40">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        {title && (
          <span className="ml-2 text-xs text-dim font-mono">{title}</span>
        )}
      </div>
      <div className="p-4 font-mono text-xs md:text-sm leading-6 text-foreground whitespace-pre-wrap">
        {children}
      </div>
    </figure>
  );
}
