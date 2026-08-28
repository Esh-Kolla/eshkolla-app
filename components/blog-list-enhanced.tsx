"use client";

import { useState, useMemo } from "react";
import EnhancedPostCard, {
  type EnhancedPostCardProps,
} from "@/components/enhanced-post-card";
import BlogSearch from "@/components/blog-search";
import type { PostMeta } from "@/lib/posts";

interface EnhancedBlogListProps {
  posts: PostMeta[];
}

// Helper to infer post characteristics for enhanced display
function inferPostCharacteristics(post: PostMeta): EnhancedPostCardProps {
  // Try to infer learning type from tags
  const tags = post.tags || [];
  const learningType: EnhancedPostCardProps["learningType"] =
    tags.includes("debugging") || tags.includes("bug")
      ? "war-story"
      : tags.includes("founder-notes") || tags.includes("startups")
        ? "synthesis"
        : tags.includes("research") || tags.includes("papers")
          ? "research"
          : tags.includes("tutorial") || tags.includes("code") ||
              tags.includes("implementation")
            ? "implementation"
            : undefined;

  // Access summary content to detect signals (summary is most readily available)
  const summary = post.summary || "";

  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    summary: summary,
    tags: tags,
    readingTime: post.readingTime,
    learningType,
    // These would ideally come from post metadata or full content analysis
    productionTested: summary.toLowerCase().includes("production") ||
      summary.toLowerCase().includes("alvva"),
    codeAvailable: summary.toLowerCase().includes("code") ||
      summary.toLowerCase().includes("implement") ||
      summary.toLowerCase().includes("build"),
    difficulty: summary.toLowerCase().includes("step-by-step") ||
      summary.toLowerCase().includes("walkthrough")
      ? "intermediate"
      : summary.toLowerCase().includes("advanced") ||
          summary.toLowerCase().includes("deep dive")
        ? "advanced"
        : "beginner",
  };
}

export default function EnhancedBlogList({ posts }: EnhancedBlogListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "implementation" | "war-story" | "research" | "synthesis">("all");

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Apply text search
    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(lower) ||
          post.summary.toLowerCase().includes(lower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lower))
      );
    }

    // Apply learning type filter
    if (filter !== "all") {
      const mapping = {
        "implementation": ["tutorial", "code", "implementation"],
        "war-story": ["debugging", "bug"],
        "research": ["research", "papers"],
        "synthesis": ["founder-notes", "startups"],
      };
      const filterTags = mapping[filter] || [];
      result = result.filter((post) =>
        post.tags.some((tag) => filterTags.includes(tag))
      );
    }

    return result;
  }, [posts, query, filter]);

  const enhancedPosts: EnhancedPostCardProps[] = filteredPosts.map(inferPostCharacteristics);

  return (
    <div>
      <div className="mb-8 space-y-4">
        <BlogSearch onSearch={setQuery} />

        {/* Learning Type Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Posts ({posts.length})
          </button>
          <button
            onClick={() => setFilter("implementation")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "implementation"
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⚡ Implement Tonight
          </button>
          <button
            onClick={() => setFilter("war-story")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "war-story"
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🔍 War Stories
          </button>
          <button
            onClick={() => setFilter("research")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "research"
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📖 Research Deep Dives
          </button>
          <button
            onClick={() => setFilter("synthesis")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "synthesis"
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            💡 Founder Notes
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-600 text-lg mb-2">
            {query ? `No posts found for "${query}"` : "No posts available yet."}
          </p>
          <p className="text-gray-500 text-sm">
            {query ? "Try a different search term or filter." : "Check back soon for new entries."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {enhancedPosts.map((post) => (
            <EnhancedPostCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
