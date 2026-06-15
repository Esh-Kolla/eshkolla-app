"use client";

import { useEffect, useState } from "react";

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Wait for MDX content to render
    const timer = setTimeout(() => {
      const prose = document.querySelector(".prose-terminal");
      if (!prose) return;

      const elements = prose.querySelectorAll("h2, h3");
      const items: TocHeading[] = [];

      elements.forEach((el, index) => {
        // Generate an id if not present
        if (!el.id) {
          el.id = `heading-${index}-${el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || index}`;
        }

        items.push({
          id: el.id,
          text: el.textContent || "",
          level: el.tagName === "H2" ? 2 : 3,
        });
      });

      setHeadings(items);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-terminal-border bg-terminal-bg overflow-hidden">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1a1a1a] transition-colors cursor-pointer"
      >
        <span className="text-xs text-dim">
          <span className="text-muted">$</span> tree ./sections
        </span>
        <span className="text-xs text-dim">
          {isCollapsed ? "[+]" : "[-]"}
        </span>
      </button>

      {!isCollapsed && (
        <nav className="px-4 pb-4">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{
                  paddingLeft: heading.level === 3 ? "1rem" : "0",
                }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(heading.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`text-xs block py-0.5 transition-colors ${
                    activeId === heading.id
                      ? "text-foreground text-glow"
                      : "text-muted hover:text-accent"
                  }`}
                >
                  {heading.level === 2 ? "|-- " : "|   |-- "}
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
