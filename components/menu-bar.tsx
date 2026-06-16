"use client";

import { useState, useEffect } from "react";
import { useWindowManagerSafe } from "./desktop/window-manager";

export default function MenuBar() {
  const [time, setTime] = useState("");
  const wm = useWindowManagerSafe();

  // Derive the active app name from the focused window, fall back to "Finder"
  const activeApp = (() => {
    if (!wm || !wm.focusedWindowId) return "Finder";
    const focused = wm.windows.find((w) => w.id === wm.focusedWindowId);
    return focused?.title ?? "Finder";
  })();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-7 flex items-center justify-between px-4 bg-black/60 backdrop-blur-xl border-b border-white/10 text-[#e0e0e0] text-xs select-none">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold"></span>
        <span className="font-semibold">{activeApp}</span>
        <span className="text-[#e0e0e0]/70 hover:text-[#e0e0e0] cursor-default">
          File
        </span>
        <span className="text-[#e0e0e0]/70 hover:text-[#e0e0e0] cursor-default">
          Edit
        </span>
        <span className="text-[#e0e0e0]/70 hover:text-[#e0e0e0] cursor-default">
          View
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Wi-Fi icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        >
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>
        {/* Battery icon */}
        <svg
          width="18"
          height="14"
          viewBox="0 0 28 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-70"
        >
          <rect x="1" y="1" width="22" height="12" rx="2" />
          <rect
            x="3"
            y="3"
            width="16"
            height="8"
            rx="1"
            fill="currentColor"
            opacity="0.5"
          />
          <path d="M25 5v4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="tabular-nums">{time}</span>
      </div>
    </div>
  );
}
