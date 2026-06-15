import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import TerminalWindow from "@/components/terminal-window";
import JsonLd from "@/components/json-ld";
import { SITE_URL, BIO } from "@/lib/data/bio";
import Link from "next/link";

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
    description: post.summary || `${post.title} — AI/ML thoughts by ${BIO.name}`,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary || `${post.title} — AI/ML thoughts by ${BIO.name}`,
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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
      <JsonLd data={postLd} />
      <Link
        href="/blog"
        className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-block"
      >
        <span className="text-accent">$</span> cd ../
      </Link>

      <TerminalWindow title={`cat ${slug}.mdx`}>
        <div className="mb-6">
          <h1 className="text-foreground text-glow text-xl font-bold mb-2">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-dim">
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded border border-terminal-border text-dim"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="prose-terminal">
          <MDXRemote source={post.content} />
        </div>
      </TerminalWindow>
    </div>
  );
}
