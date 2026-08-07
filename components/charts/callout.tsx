import { ReactNode } from "react";

/**
 * Designed callout / pull-quote block for blog posts.
 * Usage in MDX:
 *   <Callout label="the bottleneck">15-25 paralegal hours per case.</Callout>
 */
export default function Callout({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-8 border-l-2 border-accent bg-black/30 rounded-r px-5 py-4">
      {label && (
        <div className="text-xs font-mono text-accent mb-1">
          <span className="text-dim">//</span> {label}
        </div>
      )}
      <div className="text-foreground text-base md:text-lg leading-relaxed">
        {children}
      </div>
    </aside>
  );
}
