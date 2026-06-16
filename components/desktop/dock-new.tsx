"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";
import { useWindowManagerSafe, type WindowState } from "./window-manager";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DockItemConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: "app" | "external";
  href?: string;
  windowId?: string;
}

// ---------------------------------------------------------------------------
// Icon components (44px base size, same gradient style as existing dock)
// ---------------------------------------------------------------------------

const TerminalIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 shadow-lg">
    <span className="text-[#00ff41] text-base font-bold">&gt;_</span>
  </span>
);

const BlogIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#f59e0b] to-[#d97706] shadow-lg">
    <span className="text-white text-lg">&#x1f4dd;</span>
  </span>
);

const ChatIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] shadow-lg">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="9" cy="10" r="1" fill="white" stroke="none" />
      <circle cx="12" cy="10" r="1" fill="white" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="white" stroke="none" />
    </svg>
  </span>
);

const ResumeIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] shadow-lg">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  </span>
);

const GitHubIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#333] to-[#1a1a1a] border border-white/10 shadow-lg">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  </span>
);

const LinkedInIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#0077b5] to-[#005e93] shadow-lg">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  </span>
);

const XIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#333] to-[#1a1a1a] border border-white/10 shadow-lg">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  </span>
);

const EmailIcon = (
  <span className="flex items-center justify-center w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#34a853] to-[#1e7e34] shadow-lg">
    <span className="text-white text-lg">&#x2709;</span>
  </span>
);

// ---------------------------------------------------------------------------
// Dock item definitions
// ---------------------------------------------------------------------------

const APP_ITEMS: DockItemConfig[] = [
  { id: "terminal", label: "Terminal", icon: TerminalIcon, type: "app", windowId: "terminal" },
  { id: "blog", label: "Blog", icon: BlogIcon, type: "app", windowId: "blog" },
  { id: "chat", label: "AI Chat", icon: ChatIcon, type: "app", windowId: "chat" },
  { id: "resume", label: "Resume", icon: ResumeIcon, type: "app", windowId: "resume" },
];

const SEPARATOR = "separator" as const;

const EXTERNAL_ITEMS: DockItemConfig[] = [
  { id: "github", label: "GitHub", icon: GitHubIcon, type: "external", href: "https://github.com/eshwarkolla" },
  { id: "linkedin", label: "LinkedIn", icon: LinkedInIcon, type: "external", href: "https://linkedin.com/in/eshwarkolla" },
  { id: "x", label: "X", icon: XIcon, type: "external", href: "https://x.com/eshwarkolla" },
  { id: "email", label: "Email", icon: EmailIcon, type: "external", href: "mailto:eshwar.kolla@outlook.com" },
];

const ALL_ITEMS: (DockItemConfig | "separator")[] = [
  ...APP_ITEMS,
  SEPARATOR,
  ...EXTERNAL_ITEMS,
];

// Fallback URLs when window manager is not available
const FALLBACK_URLS: Record<string, string> = {
  terminal: "/",
  blog: "/blog",
  chat: "/",
  resume: "/",
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_SLOT_WIDTH = 52; // icon (44px) + gap (~8px)

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DockNew() {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  // Safe window manager access — returns null when no provider is present
  const wm = useWindowManagerSafe();

  const isWindowOpen = useCallback(
    (windowId: string): boolean => {
      if (!wm) return false;
      const win = wm.windows.find((w: WindowState) => w.id === windowId);
      return win?.isOpen ?? false;
    },
    [wm],
  );

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const handleClick = useCallback(
    (item: DockItemConfig) => {
      // Trigger bounce animation
      setBouncingId(item.id);
      setTimeout(() => setBouncingId(null), 500);

      if (item.type === "external") {
        if (item.href?.startsWith("mailto:")) {
          window.location.href = item.href;
        } else {
          window.open(item.href, "_blank");
        }
      } else if (item.windowId) {
        if (wm) {
          wm.openWindow(item.windowId);
        } else {
          // Fallback: navigate via URL when outside WindowManagerProvider
          const url = FALLBACK_URLS[item.windowId] ?? "/";
          window.location.href = url;
        }
      }
    },
    [wm],
  );

  // Calculate parabolic magnification scale for a given icon index
  const getScale = useCallback(
    (iconIndex: number): number => {
      if (mouseX === null) return 1;

      // Calculate icon center X position within the dock container
      // Account for container padding (px-2 = 8px)
      const iconCenterX = 8 + iconIndex * ICON_SLOT_WIDTH + ICON_SLOT_WIDTH / 2;
      const distance = Math.abs(mouseX - iconCenterX) / ICON_SLOT_WIDTH;

      return 1 + 0.7 * Math.max(0, 1 - distance / 2.5);
    },
    [mouseX],
  );

  // Track icon index across the render loop (separator doesn't count)
  let iconIndex = 0;

  return (
    <>
      <style>{`
        @keyframes dock-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-20px); }
          60% { transform: translateY(-8px); }
        }
      `}</style>

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
        <div
          ref={dockRef}
          className="flex items-end gap-1 px-2 py-1.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {ALL_ITEMS.map((entry, i) => {
            if (entry === SEPARATOR) {
              return (
                <div
                  key="separator"
                  className="w-px h-8 bg-white/20 mx-1 self-center"
                />
              );
            }

            const item = entry;
            const currentIconIndex = iconIndex;
            iconIndex += 1;

            const scale = getScale(currentIconIndex);
            const isBouncing = bouncingId === item.id;
            const isHovered = hoveredId === item.id;
            const windowOpen =
              item.type === "app" && item.windowId
                ? isWindowOpen(item.windowId)
                : false;

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(item)}
                style={{ cursor: "pointer" }}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}

                {/* Icon with magnification + bounce */}
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "bottom",
                    transition: "transform 0.1s ease-out",
                    animation: isBouncing
                      ? "dock-bounce 0.5s ease"
                      : undefined,
                  }}
                >
                  {item.icon}
                </div>

                {/* Running indicator dot (app items only) */}
                {item.type === "app" ? (
                  <div
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      windowOpen ? "bg-white/80" : "bg-transparent"
                    }`}
                  />
                ) : (
                  <div className="w-1 h-1 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
