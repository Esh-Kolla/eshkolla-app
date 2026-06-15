#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "..", "content", "posts");

const title = process.argv[2];

if (!title) {
  console.error("\x1b[31mUsage: npm run new-post \"Your Post Title\"\x1b[0m");
  process.exit(1);
}

const today = new Date().toISOString().split("T")[0];
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const filename = `${today}-${slug}.mdx`;
const filepath = path.join(postsDir, filename);

if (fs.existsSync(filepath)) {
  console.error(`\x1b[31mFile already exists: ${filename}\x1b[0m`);
  process.exit(1);
}

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

const template = `---
title: "${title}"
date: "${today}"
summary: ""
tags: []
---

Write your post here...
`;

fs.writeFileSync(filepath, template);
console.log(`\x1b[32m✓ Created:\x1b[0m content/posts/${filename}`);

if (process.env.EDITOR) {
  try {
    execSync(`${process.env.EDITOR} "${filepath}"`, { stdio: "inherit" });
  } catch {
    // editor closed, that's fine
  }
}
