"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface WindowManagerContextValue {
  windows: WindowState[];
  focusedWindowId: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
}

// ---------------------------------------------------------------------------
// Default window definitions
// ---------------------------------------------------------------------------

const DEFAULT_WINDOWS: WindowState[] = [
  {
    id: "terminal",
    title: "Terminal — eshwar@kolla",
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    position: { x: 100, y: 60 },
    size: { width: 720, height: 520 },
    zIndex: 10,
  },
  {
    id: "blog",
    title: "Blog — AI/ML Journal",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 140, y: 100 },
    size: { width: 700, height: 500 },
    zIndex: 0,
  },
  {
    id: "chat",
    title: "AI Chat",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 180, y: 140 },
    size: { width: 500, height: 450 },
    zIndex: 0,
  },
  {
    id: "resume",
    title: "Resume — Eshwar Kolla",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 220, y: 180 },
    size: { width: 620, height: 500 },
    zIndex: 0,
  },
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>(DEFAULT_WINDOWS);
  const [nextZIndex, setNextZIndex] = useState(11); // Terminal starts at 10

  // Derive the focused window: highest zIndex among open, non-minimized windows
  const focusedWindowId: string | null = (() => {
    let best: WindowState | null = null;
    for (const w of windows) {
      if (w.isOpen && !w.isMinimized) {
        if (!best || w.zIndex > best.zIndex) {
          best = w;
        }
      }
    }
    return best?.id ?? null;
  })();

  const assignNextZIndex = useCallback((): number => {
    const z = nextZIndex;
    setNextZIndex((prev) => prev + 1);
    return z;
  }, [nextZIndex]);

  const openWindow = useCallback(
    (id: string) => {
      const z = assignNextZIndex();
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: z }
            : w,
        ),
      );
    },
    [assignNextZIndex],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)),
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      const z = assignNextZIndex();
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
      );
    },
    [assignNextZIndex],
  );

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id || w.isMaximized) return w;
        return { ...w, position: { x, y } };
      }),
    );
  }, []);

  return (
    <WindowManagerContext value={{
      windows,
      focusedWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      moveWindow,
    }}>
      {children}
    </WindowManagerContext>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWindowManager(): WindowManagerContextValue {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error(
      "useWindowManager must be used within a <WindowManagerProvider>",
    );
  }
  return ctx;
}

/**
 * Safe variant that returns null when used outside a WindowManagerProvider.
 * Useful for components like the dock that may render on pages without the provider.
 */
export function useWindowManagerSafe(): WindowManagerContextValue | null {
  return useContext(WindowManagerContext);
}
