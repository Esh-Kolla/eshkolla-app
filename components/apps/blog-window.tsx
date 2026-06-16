"use client";

import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

interface BlogWindowProps {
  posts: BlogPost[];
}

export default function BlogWindow({ posts }: BlogWindowProps) {
  return (
    <div className="p-5 font-mono text-sm">
      <div className="mb-6">
        <h2 className="text-foreground text-glow text-base font-bold mb-1">
          <span className="text-accent">$</span> ls ai-journal/
        </h2>
        <p className="text-muted text-xs">
          One AI/ML topic every day. Learning in public.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border border-terminal-border rounded-lg p-6 bg-[#0d0d0d] text-center">
          <p className="text-dim text-sm">
            <span className="text-muted">$</span> ls ai-journal/
          </p>
          <p className="text-muted text-sm mt-2">
            total 0 — first post coming soon...
          </p>
          <p className="text-dim text-xs mt-4 cursor-blink">_</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group border border-terminal-border rounded-lg p-4 bg-[#0d0d0d] hover:border-dim transition-colors"
            >
              <div className="flex items-center gap-3 text-xs text-dim mb-2">
                <span className="text-foreground">$</span>
                <span>cat {post.slug}.mdx</span>
                <span className="ml-auto">{post.date}</span>
              </div>
              <h3 className="text-foreground text-glow group-hover:text-glow text-sm font-semibold mb-1">
                {post.title}
              </h3>
              <p className="text-muted text-xs leading-relaxed mb-2">
                {post.summary}
              </p>
              {post.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded border border-terminal-border text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-terminal-border">
        <Link
          href="/blog"
          className="text-accent hover:text-glow-accent underline underline-offset-2 text-sm"
        >
          View all posts &rarr;
        </Link>
      </div>
    </div>
  );
}
