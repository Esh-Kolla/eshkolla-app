"use client";

import { useCallback, useState } from "react";
import { useWindowManager } from "./window-manager";

// ---------------------------------------------------------------------------
// Icon definitions
// ---------------------------------------------------------------------------

interface DesktopIcon {
  id: string;
  label: string;
  type: "internal" | "external";
  url?: string;
  gradient: string;
  icon: React.ReactNode;
}

const GITHUB_PATH =
  "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z";

const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const ICONS: DesktopIcon[] = [
  {
    id: "terminal",
    label: "Terminal",
    type: "internal",
    gradient:
      "bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10",
    icon: (
      <span className="text-green-400 font-mono font-bold text-lg select-none">
        {">_"}
      </span>
    ),
  },
  {
    id: "blog",
    label: "Blog",
    type: "internal",
    gradient: "bg-gradient-to-b from-[#f59e0b] to-[#d97706]",
    icon: <span className="text-white text-2xl select-none">{"B"}</span>,
  },
  {
    id: "chat",
    label: "AI Chat",
    type: "internal",
    gradient: "bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9]",
    icon: <span className="text-white text-2xl select-none">{"🧠"}</span>,
  },
  {
    id: "resume",
    label: "Resume",
    type: "internal",
    gradient: "bg-gradient-to-b from-[#3b82f6] to-[#2563eb]",
    icon: <span className="text-white text-2xl select-none">{"R"}</span>,
  },
  {
    id: "github",
    label: "GitHub",
    type: "external",
    url: "https://github.com/eshwarkolla",
    gradient:
      "bg-gradient-to-b from-[#333] to-[#1a1a1a] border border-white/10",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-white"
        aria-hidden="true"
      >
        <path d={GITHUB_PATH} />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    type: "external",
    url: "https://linkedin.com/in/eshwarkolla",
    gradient: "bg-gradient-to-b from-[#0077b5] to-[#005e93]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-white"
        aria-hidden="true"
      >
        <path d={LINKEDIN_PATH} />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DesktopIcons() {
  const { openWindow } = useWindowManager();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent, icon: DesktopIcon) => {
      e.stopPropagation();
      setSelectedId(icon.id);
    },
    [],
  );

  const handleDoubleClick = useCallback(
    (icon: DesktopIcon) => {
      if (icon.type === "external" && icon.url) {
        window.open(icon.url, "_blank");
      } else {
        openWindow(icon.id);
      }
    },
    [openWindow],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, icon: DesktopIcon) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (icon.type === "external" && icon.url) {
          window.open(icon.url, "_blank");
        } else {
          openWindow(icon.id);
        }
      }
    },
    [openWindow],
  );

  return (
    <div
      className="absolute right-6 top-14 flex flex-col gap-4"
      onClick={() => setSelectedId(null)}
    >
      {ICONS.map((icon) => {
        const isSelected = selectedId === icon.id;

        return (
          <div
            key={icon.id}
            role="button"
            tabIndex={0}
            aria-label={icon.label}
            className={`
              flex flex-col items-center w-20 p-1.5 rounded-lg cursor-default
              transition-colors duration-100
              ${isSelected ? "ring-2 ring-blue-400/50 bg-blue-500/20" : ""}
            `}
            onClick={(e) => handleClick(e, icon)}
            onDoubleClick={() => handleDoubleClick(icon)}
            onKeyDown={(e) => handleKeyDown(e, icon)}
          >
            {/* Icon */}
            <div
              className={`
                w-14 h-14 rounded-xl shadow-md
                flex items-center justify-center
                ${icon.gradient}
              `}
            >
              {icon.icon}
            </div>

            {/* Label */}
            <span
              className={`
                mt-1 text-center text-[11px] leading-tight max-w-[80px] truncate
                transition-colors duration-100
                ${isSelected ? "text-white" : "text-white/80"}
              `}
            >
              {icon.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
