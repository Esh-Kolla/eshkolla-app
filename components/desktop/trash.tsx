"use client";

import { createRef, useEffect, useRef, useState } from "react";
import { useWindowManager } from "./window-manager";

// ---------------------------------------------------------------------------
// Module-level ref for cross-component access
// ---------------------------------------------------------------------------

/**
 * A module-level ref that holds the trash container element.
 * Import this in window.tsx to check if a dragged window overlaps the trash.
 */
export const trashZoneRef = createRef<HTMLDivElement>();

/**
 * Check whether the given screen coordinates fall within the trash zone.
 */
export function isOverTrash(clientX: number, clientY: number): boolean {
  const el = trashZoneRef.current;
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

function EmptyTrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-7 h-7 text-[#888]"
      aria-hidden="true"
    >
      {/* Lid */}
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      {/* Body */}
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      {/* Vertical lines */}
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function FullTrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-7 h-7 text-[#aaa]"
      aria-hidden="true"
    >
      {/* Lid — slightly ajar */}
      <path
        d="M3 6h18"
        strokeLinecap="round"
        transform="rotate(-8 12 6)"
      />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      {/* Body */}
      <path
        d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
        fill="#888"
        fillOpacity="0.3"
      />
      {/* Paper peeking out */}
      <path
        d="M9 4l2-2 2 2"
        stroke="#aaa"
        strokeWidth="1"
        fill="none"
      />
      {/* Vertical lines */}
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Trash() {
  const { windows } = useWindowManager();
  const [isFull, setIsFull] = useState(false);
  const localRef = useRef<HTMLDivElement>(null);

  // Bridge the local ref to the module-level createRef.
  // createRef is mutable via (ref as MutableRefObject).current.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trashZoneRef as any).current = localRef.current;
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (trashZoneRef as any).current = null;
    };
  }, []);

  // Track when any window has been closed — mark trash as full.
  // We detect this by checking if any defined window has isOpen === false.
  useEffect(() => {
    const anyClosed = windows.some((w) => !w.isOpen);
    if (anyClosed) {
      setIsFull(true);
    }
  }, [windows]);

  return (
    <div
      ref={localRef}
      className="absolute bottom-20 right-6 flex flex-col items-center cursor-default select-none"
      aria-label="Trash"
    >
      {/* Icon container — matches desktop icon sizing */}
      <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 shadow-md">
        {isFull ? <FullTrashIcon /> : <EmptyTrashIcon />}
      </div>

      {/* Label */}
      <span className="mt-1 text-center text-[11px] leading-tight text-white/80">
        Trash
      </span>
    </div>
  );
}
