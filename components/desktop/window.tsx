"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useWindowManager, type WindowState } from "./window-manager";
import { isOverTrash } from "./trash";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface WindowProps {
  windowId: string;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Inner component (receives a guaranteed non-null WindowState)
// ---------------------------------------------------------------------------

function WindowInner({
  win,
  windowId,
  children,
}: {
  win: WindowState;
  windowId: string;
  children: ReactNode;
}) {
  const {
    focusedWindowId,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
  } = useWindowManager();

  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Store drag origin so we can compute deltas without re-renders per-move
  const dragOrigin = useRef<{
    pointerX: number;
    pointerY: number;
    windowX: number;
    windowY: number;
  } | null>(null);

  // Trigger mount animation
  useEffect(() => {
    // requestAnimationFrame ensures the initial un-mounted classes are painted
    // before we flip to mounted, so the CSS transition actually fires.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const isFocused = focusedWindowId === windowId;

  // Position & size — maximized overrides stored values
  const posX = win.isMaximized ? 0 : win.position.x;
  const posY = win.isMaximized ? 0 : win.position.y;
  const width = win.isMaximized ? "100%" : win.size.width;
  const height = win.isMaximized
    ? "calc(100vh - 28px - 70px)"
    : win.size.height;

  // ---------------------------------------------------------------------------
  // Drag handlers (pointer events on title bar)
  // ---------------------------------------------------------------------------

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (win.isMaximized) return;

    dragOrigin.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      windowX: win.position.x,
      windowY: win.position.y,
    };
    setDragging(true);
    focusWindow(windowId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !dragOrigin.current) return;

    const dx = e.clientX - dragOrigin.current.pointerX;
    const dy = e.clientY - dragOrigin.current.pointerY;

    let newX = dragOrigin.current.windowX + dx;
    let newY = dragOrigin.current.windowY + dy;

    // Constrain: keep at least 50px of the window visible on each edge
    const winWidth = typeof width === "number" ? width : window.innerWidth;

    newX = Math.max(50 - winWidth, Math.min(newX, window.innerWidth - 50));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 50));

    moveWindow(windowId, newX, newY);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    dragOrigin.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Check if the window was dropped on the trash zone
    if (isOverTrash(e.clientX, e.clientY)) {
      closeWindow(windowId);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className={`
        absolute flex flex-col rounded-xl overflow-hidden
        border border-white/10 transition-shadow duration-200
        ${isFocused ? "shadow-2xl shadow-black/50" : "shadow-lg shadow-black/30"}
        ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        ${mounted ? "" : "transition-all duration-200 ease-out"}
      `}
      style={{
        left: posX,
        top: posY,
        width,
        height,
        zIndex: win.zIndex,
        transition: mounted
          ? "box-shadow 200ms"
          : "transform 200ms ease-out, opacity 200ms ease-out, box-shadow 200ms",
      }}
      onPointerDown={() => focusWindow(windowId)}
    >
      {/* ---- Title bar ---- */}
      <div
        className={`
          flex items-center h-9 px-3 shrink-0
          bg-[#2a2a2a]/95 backdrop-blur-md border-b border-white/10
          ${win.isMaximized ? "" : dragging ? "cursor-grabbing" : "cursor-grab"}
          select-none
        `}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Traffic light buttons */}
        <div className="group flex items-center gap-2">
          {/* Close */}
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(windowId);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Close window"
          >
            <span className="hidden group-hover:block text-[8px] leading-none text-black/80 font-bold">
              &times;
            </span>
          </button>

          {/* Minimize */}
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(windowId);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Minimize window"
          >
            <span className="hidden group-hover:block text-[8px] leading-none text-black/80 font-bold">
              &minus;
            </span>
          </button>

          {/* Maximize / restore */}
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(windowId);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Maximize window"
          >
            <span className="hidden group-hover:block text-[8px] leading-none text-black/80 font-bold">
              +
            </span>
          </button>
        </div>

        {/* Title */}
        <span className="flex-1 text-center text-xs text-[#e0e0e0]/80 truncate px-4">
          {win.title}
        </span>

        {/* Spacer to balance the traffic lights so the title stays centered */}
        <div className="w-[52px] shrink-0" />
      </div>

      {/* ---- Content area ---- */}
      <div className="flex-1 bg-[#1a1a1a] overflow-y-auto">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Outer component — handles lookup + null / hidden guard
// ---------------------------------------------------------------------------

export default function Window({ windowId, children }: WindowProps) {
  const { windows } = useWindowManager();
  const win = windows.find((w) => w.id === windowId);

  if (!win || !win.isOpen || win.isMinimized) return null;

  return (
    <WindowInner win={win} windowId={windowId}>
      {children}
    </WindowInner>
  );
}
