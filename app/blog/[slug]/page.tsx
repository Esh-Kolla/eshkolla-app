import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getPostBySlug,
  getAllSlugs,
  type Post,
} from "@/lib/posts";
import BarChart from "@/components/charts/bar-chart";
import Chart from "@/components/charts/chart";
import InferenceChart from "@/components/charts/inference-chart";
import FlowDiagram from "@/components/charts/flow-diagram";
import Terminal from "@/components/charts/terminal";
import Callout from "@/components/charts/callout";
import PipelineDiagram from "@/components/charts/pipeline-diagram";
import GradientDescentChart from "@/components/charts/gradient-descent-chart";
import PerceptronChart from "@/components/charts/perceptron-chart";
import ReadingProgress from "@/components/reading-progress";
import TableOfContents from "@/components/table-of-contents";
import RelatedPosts from "@/components/related-posts";
import JsonLd from "@/components/json-ld";
import PostValueHeader from "@/components/post-value-header";
import ReadingModeToggle from "@/components/reading-mode-toggle";
import { SITE_URL, BIO } from "@/lib/data/bio";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description:
      post.summary || `${post.title} — AI/ML thoughts by ${BIO.name}`,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description:
        post.summary || `${post.title} — AI/ML thoughts by ${BIO.name}`,
      type: "article",
      publishedTime: post.date,
      authors: [BIO.name],
      url: `${SITE_URL}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || post.title,
    },
  };
}

// Analyze post content to detect value signals
function analyzePostValueSignals(post: Post) {
  const content = post.content;

  return {
    warStory: /debugging|bug|problem|experienc|stuck|friday night|11 pm|production/i.test(content),
    codeAvailable: /```python|```javascript|```typescript|```bash/i.test(content),
    mentalModelShift: /changed my thinking|shifted my|mental model|realized/i.test(content),
    productionTested: /production|alvva|deployed|shipped|we implemented/i.test(content),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const valueSignals = analyzePostValueSignals(post);

  const postLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: BIO.name,
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${slug}`,
    keywords: post.tags,
  };

  return (
    <div>
      <ReadingProgress />
      <JsonLd data={postLd} />

      {/* Navigation */}
      <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <Link
          href="/blog"
          className="text-sm text-gray-600 hover:text-teal-700 transition-colors font-medium"
        >
          ← Back to Learning Journal
        </Link>
        <ReadingModeToggle />
      </div>

      {/* Post Header */}
      <div className="mb-8">
        <h1 className="lj-h1 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>

        {/* Learning Type Badge */}
        <div className="mb-6">
          {valueSignals.warStory && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 uppercase tracking-wide mb-3 block w-fit">
              <span>🔍</span>
              <span>Debugging War Story</span>
            </span>
          )}
          {valueSignals.mentalModelShift && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 uppercase tracking-wide mb-3 block w-fit">
              <span>🧠</span>
              <span>This Changed My Thinking</span>
            </span>
          )}
        </div>

        {/* Value Signals */}
        <PostValueHeader
          productionTested={valueSignals.productionTested}
          codeAvailable={valueSignals.codeAvailable}
          warStory={valueSignals.warStory}
          mentalModelShift={valueSignals.mentalModelShift}
          readingTime={post.readingTime}
        />
      </div>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="lj-reading-width">
            <article>
              <MDXRemote
                source={post.content}
                components={{
                  BarChart,
                  Chart,
                  InferenceChart,
                  FlowDiagram,
                  Terminal,
                  Callout,
                  PipelineDiagram,
                  GradientDescentChart,
                  PerceptronChart,
                }}
              />
            </article>
          </div>

          <RelatedPosts currentSlug={slug} currentTags={post.tags} />
        </div>

        {/* Sidebar - Table of Contents */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}
