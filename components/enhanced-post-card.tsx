import Link from "next/link";

export interface EnhancedPostCardProps {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
  productionTested?: boolean;
  codeAvailable?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  learningType?: "implementation" | "war-story" | "research" | "synthesis";
  relatedPosts?: { slug: string; title: string }[];
}

export default function EnhancedPostCard({
  slug,
  title,
  date,
  summary,
  tags,
  readingTime,
  productionTested,
  codeAvailable,
  difficulty,
  learningType,
  relatedPosts,
}: EnhancedPostCardProps) {
  // Format learning type for display
  const learningTypeLabels: Record<string, string> = {
    "implementation": "Tutorial",
    "war-story": "Debugging Story",
    "research": "Research",
    "synthesis": "Founder Notes",
  };

  const learningTypeIcons: Record<string, string> = {
    "implementation": "⚡",
    "war-story": "🔍",
    "research": "📖",
    "synthesis": "💡",
  };

  const resolvedLearningType = learningType || "implementation";
  const displayType = learningTypeLabels[resolvedLearningType] || resolvedLearningType;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Value Signal Header */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 uppercase tracking-wide">
            <span>{learningTypeIcons[resolvedLearningType]}</span>
            <span>{displayType}</span>
          </span>
          <span className="text-sm text-gray-500">{readingTime} read</span>
          {productionTested && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 uppercase tracking-wide"
              title="Tested in production at Alvva"
            >
              <span>✓</span>
              <span>Production-tested</span>
            </span>
          )}
          {codeAvailable && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 uppercase tracking-wide"
              title="Contains runnable code snippets"
            >
              <span>{`</>`}</span>
              <span>Code</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors leading-snug">
          {title}
        </h3>

        {/* Learning Summary - Value Extraction */}
        <p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-3">
          {summary}
        </p>

        {/* Difficulty & Details */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {difficulty && (
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="capitalize">{difficulty}</span>
            </span>
          )}
          <span className="text-xs text-gray-400">{date}</span>
        </div>

        {/* Topics/Tags */}
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts - Crosslinking */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Related:</span>
              <span className="text-teal-700 font-medium group-hover:underline">
                {relatedPosts.map((p, i) => (
                  <span key={p.slug}>
                    {i > 0 && " • "}{p.title.slice(0, 30)}
                    {p.title.length > 30 && "..."}
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
