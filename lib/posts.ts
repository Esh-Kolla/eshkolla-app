import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDir = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const filePath = path.join(postsDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");

    return {
      slug,
      title: data.title || slug,
      date: data.date || filename.slice(0, 10),
      summary: data.summary || "",
      tags: data.tags || [],
      readingTime: readingTime(content).text,
    };
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDir)) return null;

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  const file = files.find((f) =>
    f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "") === slug
  );

  if (!file) return null;

  const filePath = path.join(postsDir, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    date: data.date || file.slice(0, 10),
    summary: data.summary || "",
    tags: data.tags || [],
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];

  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, ""));
}
