#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import Database from "better-sqlite3";

// ─── Configuration ───────────────────────────────────────────────────────────
const FROM_ADDRESS = "Eshwar Kolla <newsletter@eshwarkolla.com>";
const SITE_URL = "https://eshwarkolla.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// ─── Paths ───────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const DB_PATH = path.join(ROOT, "data", "analytics.db");

// ─── Parse CLI args ─────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  let slug = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--slug" && args[i + 1]) {
      slug = args[i + 1];
      i++;
    }
  }

  return { slug };
}

// ─── Find the post ──────────────────────────────────────────────────────────
function findPost(slug) {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  if (files.length === 0) {
    console.error("\x1b[31mNo posts found in content/posts/\x1b[0m");
    process.exit(1);
  }

  if (slug) {
    const match = files.find((f) => f.includes(slug));
    if (!match) {
      console.error(`\x1b[31mNo post found matching slug: ${slug}\x1b[0m`);
      process.exit(1);
    }
    return match;
  }

  // Latest post (last alphabetically, since filenames are date-prefixed)
  return files[files.length - 1];
}

// ─── Extract post data ─────────────────────────────────────────────────────
function readPost(filename) {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  // Derive slug from filename: strip date prefix and .mdx extension
  // e.g. "2026-06-15-why-attention-is-all-you-need.mdx" -> "why-attention-is-all-you-need"
  const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");

  return {
    title: data.title || "Untitled",
    date: data.date || "",
    summary: data.summary || "",
    slug,
  };
}

// ─── Get active subscribers from SQLite ─────────────────────────────────────
function getActiveSubscribers() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  const rows = db
    .prepare("SELECT email FROM subscribers WHERE unsubscribed_at IS NULL ORDER BY created_at")
    .all();
  db.close();
  return rows.map((r) => r.email);
}

// ─── Build email HTML ───────────────────────────────────────────────────────
function buildEmailHtml(post, email) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0; padding:0; background:#0a0a0a; color:#e0e0e0; font-family:'Courier New',Courier,monospace;">
  <div style="max-width:600px; margin:0 auto; padding:2rem 1.5rem;">

    <div style="border-bottom:1px solid #22c55e; padding-bottom:1rem; margin-bottom:1.5rem;">
      <h2 style="margin:0; color:#22c55e; font-size:0.9rem; letter-spacing:0.1em;">
        AI/ML JOURNAL
      </h2>
    </div>

    <h1 style="color:#ffffff; font-size:1.4rem; margin:0 0 0.5rem 0;">
      ${post.title}
    </h1>

    <p style="color:#888; font-size:0.85rem; margin:0 0 1.5rem 0;">
      ${post.date}
    </p>

    <p style="color:#d0d0d0; font-size:1rem; line-height:1.7; margin:0 0 1.5rem 0;">
      ${post.summary}
    </p>

    <a href="${postUrl}" style="display:inline-block; background:#22c55e; color:#0a0a0a; text-decoration:none; padding:0.6rem 1.5rem; font-family:'Courier New',Courier,monospace; font-weight:bold; font-size:0.9rem; border-radius:2px;">
      Read full post &rarr;
    </a>

    <div style="border-top:1px solid #333; margin-top:2.5rem; padding-top:1rem;">
      <p style="color:#666; font-size:0.75rem; margin:0;">
        You received this because you subscribed to eshwarkolla.com.<br/>
        <a href="${unsubscribeUrl}" style="color:#666; text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Send a single email via Resend ─────────────────────────────────────────
async function sendEmail(to, subject, html) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }

  return res.json();
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  // Validate API key
  if (!RESEND_API_KEY) {
    console.error("\x1b[31mMissing RESEND_API_KEY environment variable.\x1b[0m");
    process.exit(1);
  }

  const { slug } = parseArgs();

  // Find and read the post
  const filename = findPost(slug);
  const post = readPost(filename);

  console.log(`\x1b[32m--- Newsletter Send ---\x1b[0m`);
  console.log(`Post:  ${post.title}`);
  console.log(`File:  ${filename}`);
  console.log(`Slug:  ${post.slug}`);
  console.log();

  // Get subscribers
  const subscribers = getActiveSubscribers();

  if (subscribers.length === 0) {
    console.log("\x1b[33mNo active subscribers found. Nothing to send.\x1b[0m");
    process.exit(0);
  }

  console.log(`Subscribers: ${subscribers.length}`);
  console.log();

  const subject = `[AI/ML Journal] ${post.title}`;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < subscribers.length; i++) {
    const email = subscribers[i];
    process.stdout.write(`Sending to subscriber ${i + 1}/${subscribers.length}... `);

    try {
      await sendEmail(email, subject, buildEmailHtml(post, email));
      console.log("\x1b[32mdone\x1b[0m");
      sent++;
    } catch (err) {
      console.log(`\x1b[31mfailed\x1b[0m - ${err.message}`);
      failed++;
    }
  }

  console.log();
  console.log(`\x1b[32m--- Complete ---\x1b[0m`);
  console.log(`Sent: ${sent}  Failed: ${failed}`);
}

main();
