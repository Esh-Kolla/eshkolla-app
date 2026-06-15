"use client";

import { useState, useMemo } from "react";
import BlogSearch from "@/components/blog-search";
import PostCard from "@/components/post-card";
import type { PostMeta } from "@/lib/posts";

interface BlogListProps {
  posts: PostMeta[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;

    const lower = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lower) ||
        post.summary.toLowerCase().includes(lower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lower))
    );
  }, [posts, query]);

  return (
    <div>
      <BlogSearch onSearch={setQuery} />

      {filteredPosts.length === 0 ? (
        <div className="border border-terminal-border rounded-lg p-8 bg-terminal-bg text-center">
          <p className="text-dim text-sm">
            <span className="text-muted">$</span> grep -i &quot;{query}&quot;
            posts/
          </p>
          <p className="text-muted text-sm mt-2">No matches found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
