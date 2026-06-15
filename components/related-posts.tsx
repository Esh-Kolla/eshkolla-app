import Link from "next/link";
import { getAllPosts, type PostMeta } from "@/lib/posts";

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
}

export default function RelatedPosts({
  currentSlug,
  currentTags,
}: RelatedPostsProps) {
  const allPosts = getAllPosts();

  // Filter out current post and score by shared tags
  const related = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const overlap = post.tags.filter((tag) =>
        currentTags.includes(tag)
      ).length;
      return { ...post, overlap };
    })
    .filter((post) => post.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-10 rounded-lg border border-terminal-border bg-terminal-bg p-5">
      <div className="text-xs text-dim mb-4">
        <span className="text-muted">$</span> find . -related
      </div>

      <div className="space-y-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <div className="flex items-start gap-3">
              <span className="text-dim text-xs shrink-0 mt-0.5">
                &gt;
              </span>
              <div>
                <h4 className="text-sm text-foreground group-hover:text-glow transition-all">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-dim">{post.date}</span>
                  <span className="text-xs text-dim">
                    {post.readingTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
