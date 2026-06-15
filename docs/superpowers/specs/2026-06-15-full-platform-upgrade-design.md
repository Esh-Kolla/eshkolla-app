# eshwarkolla.com Full Platform Upgrade — Design Spec

## Overview

Transform eshwarkolla.com from a static personal site into a full AI-powered platform with a Gemini chatbot, smart blog, SEO engine, self-hosted analytics, newsletter, and Docker deployment on Mac Mini.

## System Architecture

Six systems, built in phases:

1. AI Chatbot (Gemini)
2. Smart Blog (search, summaries, related posts)
3. SEO Engine (SSR, structured data, OG images, sitemap)
4. Analytics (self-hosted, SQLite, no cookies)
5. Newsletter + RSS
6. Social Identity (flags, share cards)

**Stack:** Next.js 16 (App Router), Tailwind v4, GCP Gemini 2.0 Flash, SQLite (via better-sqlite3), Resend (email), Docker + Coolify, Caddy, GoDaddy DNS.

---

## 1. AI Chatbot

### Behavior

The existing `CommandInput` component becomes a hybrid terminal:
- Built-in commands (`help`, `experience`, `skills`, etc.) work exactly as they do now
- Any unrecognized input is sent to Gemini instead of returning "command not found"
- AI responses stream character-by-character in the terminal, matching the typing aesthetic
- A subtle indicator shows when the AI is "thinking" (e.g., blinking cursor with `[thinking...]`)

### API Route

`app/api/chat/route.ts`
- Accepts POST with `{ message: string, history: Array<{role, content}> }`
- System prompt contains: full resume, career arc, personality instructions, latest 20 blog post summaries
- Uses `@google/generative-ai` SDK with Gemini 2.0 Flash
- Streams response via ReadableStream (Server-Sent Events pattern)
- No rate limiting (per user request)

### System Prompt Strategy

```
You are Eshwar Kolla's personal AI assistant on his portfolio website.
You speak in a concise, technical, friendly tone — like a senior engineer
in a casual conversation. You know Eshwar's full career, resume, projects,
and blog content. Answer questions about him, his work, AI/ML topics,
or his journey. Stay in character. If asked something you don't know
about Eshwar, say so honestly.

[RESUME DATA INJECTED HERE]
[BLOG SUMMARIES INJECTED HERE]
```

### Context Management

- Resume data: static JSON file at `lib/context/resume.json`
- Blog intelligence: generated at build time, stored at `lib/context/blog-intelligence.json` (summaries, tags, related posts — single source of truth)
- Both injected into system prompt at request time
- Conversation history: kept client-side in state (max 20 turns, then truncate oldest)

### Environment Variables

```
GEMINI_API_KEY=<key>
```

---

## 2. Smart Blog

### Build-time Intelligence

Script `scripts/generate-blog-intelligence.mjs`:
- Reads all MDX posts
- For each post, calls Gemini to generate: 1-line summary, 3 keyword tags, related post slugs
- Outputs `lib/context/blog-intelligence.json`
- Run as part of `npm run build` (prebuild script)

### Semantic Search

- At build time, generate Gemini text embeddings for each post (title + first 500 chars)
- Store embeddings in `lib/context/blog-embeddings.json`
- Search API route `app/api/search/route.ts`: accepts query, generates embedding, cosine similarity against stored embeddings, returns ranked results
- Search bar on `/blog` page — terminal-styled input: `$ grep -r "<query>" ai-journal/`

### Blog Post Enhancements

Each post page (`app/blog/[slug]/page.tsx`) adds:
- AI-generated summary at the top (from blog-intelligence.json)
- Related posts section at the bottom
- Prev/next navigation between posts

---

## 3. SEO Engine

### Server-Side Rendering

Convert home page from fully client-rendered to hybrid:
- Bio text, career arc, skills, and links rendered in the SSR HTML (visible to crawlers)
- Client-side: animations (typing, glitch, matrix rain, boot sequence) hydrate on top
- Implementation: move bio data to a shared constant, render it in the server component, animate it in the client wrapper

### Structured Data (JSON-LD)

Home page — `Person` schema:
```json
{
  "@type": "Person",
  "name": "Eshwar Kolla",
  "jobTitle": "Cofounder & CTO",
  "worksFor": { "@type": "Organization", "name": "Alvva" },
  "url": "https://eshwarkolla.com",
  "sameAs": ["https://linkedin.com/in/eshwarkolla", "https://github.com/eshwarkolla", "https://x.com/eshwarkolla"],
  "alumniOf": ["Jain University", "Chapman University", "Harrisburg University"]
}
```

Blog posts — `BlogPosting` schema with author, datePublished, description.

### Dynamic Sitemap & Robots

- `app/sitemap.ts` — generates sitemap from all blog post slugs + static pages
- `app/robots.ts` — allows all crawlers, points to sitemap

### Open Graph Images

- `app/blog/[slug]/opengraph-image.tsx` — uses `next/og` (ImageResponse API)
- Terminal-styled card: dark bg, green monospace text, post title, date, "eshwarkolla.com"
- Auto-generated per post, cached at build time

### Meta Tags

Every page gets: title, description, canonical URL, Open Graph (title, description, image, type), Twitter Card (large image summary).

---

## 4. Analytics (Self-Hosted)

### Database

SQLite via `better-sqlite3`:
- Table `page_views`: id, path, timestamp, referrer, country (from IP geo lookup)
- Table `subscribers`: id, email, created_at, unsubscribed_at

### Tracking

- API route `app/api/analytics/route.ts` (POST)
- Called from a client-side `useEffect` on every page load — no cookies, no fingerprinting
- IP → country lookup using a free GeoIP database or API

### Dashboard

- `app/admin/page.tsx` — protected by `ADMIN_PASSWORD` env var via `middleware.ts` (checks Authorization header or cookie against env var, redirects to login prompt if missing)
- Shows: total views (7d/30d/all), top pages, traffic over time (simple chart), top referrers, subscriber count
- Terminal-styled dashboard matching the site aesthetic

---

## 5. Newsletter + RSS

### RSS Feed

- `app/feed.xml/route.ts` — generates RSS 2.0 XML from all blog posts
- Includes: title, link, description, pubDate for each post
- Auto-discovery link tag in layout `<head>`

### Email Signup

- Component `components/newsletter-signup.tsx`
- Terminal-styled: `$ subscribe <email>` input
- Saves to SQLite `subscribers` table via `app/api/subscribe/route.ts`
- Confirmation response: "Subscribed. You'll get notified when I publish."

### Send Notifications

- Script `scripts/send-newsletter.mjs`
- Uses Resend API (free tier: 3K/month)
- Run manually after publishing: `npm run notify`
- Sends latest post title + summary + link to all subscribers
- Environment variable: `RESEND_API_KEY`

---

## 6. Social Identity

### Flags

- Add 🇮🇳 and 🇺🇸 emoji flags to the hero section after the name
- Also visible in the `neofetch` command output: `Location: Palo Alto, CA 🇺🇸 | From: India 🇮🇳`

### Share Cards

- Auto-generated OG images (covered in SEO section)
- Terminal-aesthetic share cards: dark bg, green text, post title

---

## 7. Hosting & Deployment

### Docker

`Dockerfile`:
- Multi-stage build: install deps → build Next.js → production image
- Node 22 Alpine base
- SQLite data volume for persistence

`docker-compose.yml`:
- App service (port 3000)
- SQLite volume mount
- Caddy service for reverse proxy + auto SSL

### Coolify Deployment

- Point Coolify to the GitHub repo
- Configure env vars (GEMINI_API_KEY, ADMIN_PASSWORD, RESEND_API_KEY)
- Auto-deploy on push to main

### GoDaddy DNS

- A record: `eshwarkolla.com` → Mac Mini public IP
- CNAME: `www.eshwarkolla.com` → `eshwarkolla.com`
- Caddy handles SSL via Let's Encrypt

### Environment Variables

```
GEMINI_API_KEY=<gcp-gemini-key>
ADMIN_PASSWORD=<dashboard-password>
RESEND_API_KEY=<resend-key>
SITE_URL=https://eshwarkolla.com
```

---

## New File Structure

```
app/
  api/
    chat/route.ts          # Gemini chatbot endpoint
    search/route.ts        # Semantic search endpoint
    analytics/route.ts     # Page view tracking
    subscribe/route.ts     # Newsletter signup
  admin/
    page.tsx               # Analytics dashboard
  blog/
    [slug]/
      opengraph-image.tsx  # Auto-generated OG image
  sitemap.ts               # Dynamic sitemap
  robots.ts                # Robots.txt
  feed.xml/route.ts        # RSS feed

components/
  ai-chat.tsx              # Replaces command-input (hybrid)
  newsletter-signup.tsx    # Email signup form
  search-bar.tsx           # Blog search

lib/
  context/
    resume.json            # Structured resume data
    blog-intelligence.json # Summaries, tags, related posts (build-time)
    blog-embeddings.json   # Semantic search embeddings (build-time)
  db.ts                    # SQLite connection + queries
  gemini.ts                # Gemini client wrapper

scripts/
  generate-blog-intelligence.mjs  # Build-time AI generation
  send-newsletter.mjs             # Manual newsletter sender

Dockerfile
docker-compose.yml
Caddyfile
```

---

## Implementation Phases

**Phase 1: SEO + SSR** — sitemap, robots, JSON-LD, OG images, hybrid rendering
**Phase 2: AI Chatbot** — Gemini integration, hybrid command input, streaming
**Phase 3: Smart Blog** — search, summaries, related posts, embeddings
**Phase 4: Analytics** — SQLite, tracking, admin dashboard
**Phase 5: Newsletter + RSS** — signup, RSS feed, Resend integration
**Phase 6: Social + Flags** — emoji flags, share cards
**Phase 7: Docker + Deploy** — Dockerfile, Caddy, Coolify setup, GoDaddy DNS
