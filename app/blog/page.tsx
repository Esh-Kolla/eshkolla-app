import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/post-card";
import NewsletterSignup from "@/components/newsletter-signup";
import { SITE_URL, BIO } from "@/lib/data/bio";

export const metadata = {
  title: "AI/ML Journal",
  description: `Daily thoughts on AI, ML, and building with intelligence by ${BIO.name}.`,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `AI/ML Journal — ${BIO.name}`,
    description: "Daily thoughts on AI, ML, and building with intelligence.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-foreground text-glow text-xl font-bold mb-2">
          <span className="text-accent">$</span> ls ai-journal/
        </h1>
        <p className="text-muted text-sm">
          One AI/ML topic every day. Learning in public.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border border-terminal-border rounded-lg p-8 bg-terminal-bg text-center">
          <p className="text-dim text-sm">
            <span className="text-muted">$</span> ls ai-journal/
          </p>
          <p className="text-muted text-sm mt-2">
            total 0 — first post coming soon...
          </p>
          <p className="text-dim text-xs mt-4 cursor-blink">_</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      )}

      <NewsletterSignup />
    </div>
  );
}
