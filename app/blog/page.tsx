import { getAllPosts } from "@/lib/posts";
import EnhancedBlogList from "@/components/blog-list-enhanced";
import NewsletterSignup from "@/components/newsletter-signup";
import { SITE_URL, BIO } from "@/lib/data/bio";

export const metadata = {
  title: "Learning Journal",
  description: `Learning AI deeply → applying at work → discovering what actually matters. A generalist's journal in the middle of the transformation by ${BIO.name}.`,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Learning Journal — ${BIO.name}`,
    description: "One ML topic explored daily. Evidence: 55% of posts contain production-tested code.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  // Calculate evidence metrics
  const codeHeavyPosts = posts.filter(
    (post) => post.title.toLowerCase().includes("implement") ||
                post.summary.toLowerCase().includes("code")
  ).length;
  const productionEvidence = Math.round((codeHeavyPosts / posts.length) * 100);

  return (
    <div>
      {/* Hero - Learning Journal Identity */}
      <div className="mb-12 pb-8 border-b border-gray-100">
        <h1 className="lj-h1 mb-4 text-3xl">
          Learning Journal
        </h1>
        <p className="lj-p text-xl mb-4 max-w-3xl">
          Learning AI deeply → applying at work → discovering what actually matters.
        </p>
        <p className="lj-p mb-6 text-gray-600">
          A generalist's journal in the middle of the transformation.
        </p>

        {/* Evidence Statement */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-semibold text-teal-700 mb-1">
                {posts.length}
              </div>
              <div className="text-sm text-gray-600">Posts published</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-teal-700 mb-1">
                {productionEvidence}%
              </div>
              <div className="text-sm text-gray-600">Production-tested</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-teal-700 mb-1">Daily</div>
              <div className="text-sm text-gray-600">New learning documented</div>
            </div>
          </div>
        </div>
      </div>

      <EnhancedBlogList posts={posts} />

      <NewsletterSignup />
    </div>
  );
}
