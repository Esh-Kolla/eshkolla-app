import Link from "next/link";

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

export default function PostCard({ slug, title, date, summary, tags }: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="block group border border-terminal-border rounded-lg p-5 bg-terminal-bg hover:border-dim transition-colors"
    >
      <div className="flex items-center gap-3 text-xs text-dim mb-2">
        <span className="text-foreground">$</span>
        <span>cat {slug}.mdx</span>
        <span className="ml-auto">{date}</span>
      </div>
      <h3 className="text-foreground text-glow group-hover:text-glow text-base font-semibold mb-1">
        {title}
      </h3>
      <p className="text-muted text-sm leading-relaxed mb-3">{summary}</p>
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded border border-terminal-border text-dim"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
