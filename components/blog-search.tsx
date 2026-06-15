"use client";

import { useState } from "react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export default function BlogSearch({ onSearch }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }

  return (
    <div className="mb-6 rounded-lg border border-terminal-border bg-terminal-bg p-4">
      <div className="flex items-center gap-2">
        <span className="text-muted text-sm shrink-0">
          $ grep -i &quot;
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="search posts..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-dim caret-foreground"
          aria-label="Search blog posts"
        />
        <span className="text-muted text-sm shrink-0">
          &quot; posts/
        </span>
      </div>
    </div>
  );
}
