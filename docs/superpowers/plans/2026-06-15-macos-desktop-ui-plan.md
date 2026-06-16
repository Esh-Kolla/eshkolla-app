# Interactive macOS Desktop UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform eshwarkolla.com into a fully interactive macOS desktop with draggable windows, magnifying dock, desktop icons, trash bin, and polished UI/UX.

**Architecture:** React Context window manager on the home page. Each app is a draggable window. Other routes (blog, admin) use consistent window styling via layout. Sonoma-style gradient wallpaper. Magnifying dock replaces static dock.

**Tech Stack:** Next.js 16 App Router, React Context, Tailwind CSS v4, TypeScript

**Spec:** `docs/superpowers/specs/2026-06-15-macos-desktop-ui-design.md`

---

## Task 1: Window Manager Context

**Files:**
- Create: `components/desktop/window-manager.tsx`

Build the React Context that manages all window state.

- [ ] **Step 1: Create the window manager context**

```tsx
"use client";

import { createContext, useContext, useCallback, useState, type ReactNode } from "react";

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  focusedWindowId: string | null;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return ctx;
}
```

The provider should:
- Initialize with a default set of windows (Terminal open and centered, others closed)
- Track a `nextZIndex` counter for stacking
- `openWindow`: set isOpen=true, isMinimized=false, bring to front
- `closeWindow`: set isOpen=false
- `minimizeWindow`: set isMinimized=true
- `maximizeWindow`: toggle isMaximized
- `focusWindow`: increment nextZIndex, assign to window
- `moveWindow`: update position (only if not maximized)
- Derive `focusedWindowId` from highest zIndex among open, non-minimized windows

Default window configs:
- Terminal: `{ id: "terminal", title: "Terminal — eshwar@kolla", size: { width: 720, height: 520 }, position: centered }`
- Blog: `{ id: "blog", title: "Blog — AI/ML Journal", size: { width: 700, height: 500 }, position: offset }`
- Chat: `{ id: "chat", title: "AI Chat", size: { width: 500, height: 450 }, position: offset }`
- Resume: `{ id: "resume", title: "Resume", size: { width: 600, height: 500 }, position: offset }`

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: add window manager context for macOS desktop`

---

## Task 2: Draggable Window Component

**Files:**
- Create: `components/desktop/window.tsx`

Build the draggable window with macOS traffic light buttons.

- [ ] **Step 1: Create the window component**

Requirements:
- Accept `windowId: string` and `children: ReactNode`
- Read window state from `useWindowManager()`
- If not open or minimized, return null
- Render with:
  - Outer div positioned absolutely at `position.x, position.y` with `zIndex`
  - If maximized: position 0,0 with full width/height (minus menu bar and dock)
  - Title bar with frosted glass bg (`bg-[#2a2a2a]/90 backdrop-blur-md`)
  - Three traffic light circles: red (#ff5f57) close, yellow (#febc2e) minimize, green (#28c840) maximize
  - Hover on traffic lights shows icons (X, -, expand arrows) via CSS
  - Title text centered in title bar
  - Content area with dark bg, overflow auto, padding
  - Drop shadow: stronger when focused
  - Rounded corners (`rounded-xl`)
- Drag implementation:
  - `onPointerDown` on title bar starts drag, capture pointer
  - `onPointerMove` calculates delta, calls `moveWindow`
  - `onPointerUp` ends drag, release pointer
  - Constrain: keep at least 50px of title bar visible on screen
  - Do NOT drag if maximized
- `onPointerDown` on the entire window calls `focusWindow`
- Open animation: CSS transition `transform: scale(0.95) → scale(1)` and `opacity: 0 → 1`
- Close: just unmount (controlled by isOpen state)
- Touch support: pointer events handle both mouse and touch

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: add draggable window component with macOS chrome`

---

## Task 3: Desktop Icons

**Files:**
- Create: `components/desktop/desktop-icons.tsx`

Grid of app icons on the right side of the desktop.

- [ ] **Step 1: Create desktop icons component**

Requirements:
- Render a vertical grid of icons on the right side of the desktop
- Position: `absolute right-4 top-12` (below menu bar), flex-col with gap
- Each icon is 80px wide container with:
  - 56x56 icon (styled div with gradient bg + symbol, or SVG)
  - Label below (12px, white, text-center, truncate)
- Icons to render:
  1. Terminal: dark bg + green ">_" text
  2. Blog: orange/yellow bg + notepad emoji or "B"
  3. AI Chat: purple gradient bg + chat bubble or brain emoji
  4. Resume: blue gradient bg + document icon
  5. GitHub: dark bg + GitHub SVG (reuse from old dock)
  6. LinkedIn: blue bg + LinkedIn SVG (reuse from old dock)
- Click behavior:
  - Single click: select (add blue highlight ring `ring-2 ring-blue-400/50 bg-blue-500/20 rounded-lg`)
  - Track selected icon in local state, click on desktop clears selection
  - Double click on internal app: call `openWindow(id)` from window manager
  - Double click on external (GitHub, LinkedIn): `window.open(url, '_blank')`
- Click outside icons deselects (handled by desktop canvas)

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: add macOS desktop icons grid`

---

## Task 4: Dock with Magnification

**Files:**
- Create: `components/desktop/dock-new.tsx`

Dock with parabolic magnification effect.

- [ ] **Step 1: Create the magnifying dock**

Requirements:
- Fixed at bottom center, `z-40`
- Frosted glass container: `bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20`
- Dock items: Terminal, Blog, AI Chat, Resume, | separator |, GitHub, LinkedIn, X, Email
- Each item is a 48px base icon that scales on hover proximity

Magnification:
- Track mouse position via `onMouseMove` on the dock container
- For each icon, calculate distance from cursor to icon center (in icon-widths)
- Apply scale: `1 + 0.8 * Math.max(0, 1 - Math.abs(distance) / 2.5)`
  - This means: closest icon = 1.8x, 1 away = ~1.5x, 2 away = ~1.2x, 2.5+ away = 1x
- Apply scale via inline `transform: scale(...)` on each icon
- When mouse leaves dock, all icons return to scale 1
- Use `transform-origin: bottom` so icons grow upward

Other features:
- Running dot: white dot below icon for open windows (read from window manager)
- Tooltip: on hover, show app name above the icon (absolute positioned, small text)
- Click: internal apps call `openWindow(id)`, external apps open new tab
- Bounce animation: on click, apply a quick bounce keyframe to the icon
  - `@keyframes dock-bounce { 0%,100% { transform: translateY(0) } 30% { transform: translateY(-20px) } 60% { transform: translateY(-8px) } }`
- Separator: thin vertical line (`w-px h-8 bg-white/20`) between app icons and utility icons

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: add macOS dock with magnification effect`

---

## Task 5: Trash Bin

**Files:**
- Create: `components/desktop/trash.tsx`

Trash bin icon on the desktop.

- [ ] **Step 1: Create trash component**

Requirements:
- Positioned absolute `bottom-16 right-4` (above dock, right side)
- Renders a trash can icon (use a simple SVG trash can or styled div)
- Two states: empty and full (track via local state or context)
- When a window is closed, set trash to "full" state (different icon/fill)
- The trash icon is a desktop icon (same style as desktop-icons: 56x56 + label "Trash")
- Drop target for windows:
  - When a window is being dragged and hovers over the trash zone (within ~60px), highlight trash (scale up, glow border)
  - On drop (pointerUp while over trash), close the window
  - This requires the window component to check if its final position overlaps the trash zone, and if so, call `closeWindow`
- Visual: simple trash can SVG with lid. "Full" state shows crumpled paper peeking out or filled interior.

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: add trash bin with drag-to-close support`

---

## Task 6: Desktop Canvas & Wallpaper

**Files:**
- Create: `components/desktop/desktop-canvas.tsx`

The main desktop area that composes icons, windows, and trash.

- [ ] **Step 1: Create desktop canvas**

Requirements:
- Full viewport container (flex-1, relative, overflow-hidden)
- Wallpaper background (Sonoma-style gradient):
  ```css
  background:
    radial-gradient(ellipse at 20% 50%, rgba(120, 40, 200, 0.5) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(212, 98, 43, 0.4) 0%, transparent 40%),
    radial-gradient(ellipse at 60% 80%, rgba(196, 75, 140, 0.3) 0%, transparent 45%),
    linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%);
  ```
- Renders in order (bottom to top):
  1. `<DesktopIcons />`
  2. All open windows from window manager, each wrapped in `<Window windowId={id}>`
  3. `<Trash />`
- Click on empty desktop area deselects icons (pass a callback to DesktopIcons)
- Map window IDs to their content components:
  - "terminal" → `<HomeTerminalContent />` (the inner content of home-terminal, without outer wrappers)
  - "blog" → `<BlogWindowContent />` (blog listing rendered inline)
  - "chat" → `<ChatWindowContent />` (the command-input AI chat)
  - "resume" → `<ResumeWindowContent />` (simple resume/CV view)

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: add desktop canvas with Sonoma wallpaper`

---

## Task 7: App Content Components

**Files:**
- Modify: `components/home-terminal.tsx` — extract inner content into a version that doesn't include its own TerminalWindow wrapper
- Create: `components/apps/blog-window.tsx` — blog listing for desktop window
- Create: `components/apps/chat-window.tsx` — AI chat for desktop window
- Create: `components/apps/resume-window.tsx` — resume/CV content

- [ ] **Step 1: Refactor home-terminal.tsx**

The current `HomeTerminal` renders inside a `<TerminalWindow>`. For the desktop, the `<Window>` component provides the chrome. So extract the inner content:
- Keep `HomeTerminal` as-is for backwards compatibility
- Create a new export or component `HomeTerminalContent` that renders the same content but without the outer `<TerminalWindow>` wrapper and without the social links at the bottom (those are in the dock now)
- The content should be wrapped in a div with `font-mono text-sm leading-relaxed p-5` for proper styling inside the window

- [ ] **Step 2: Create blog-window.tsx**

Simple blog listing that works inside a window:
- Import `getAllPosts` — but since this is a client component, it can't call server functions
- Instead, accept `posts` as a prop (or fetch from a client-side API)
- Actually simpler: render a styled link list that navigates to `/blog` and `/blog/[slug]`
- Show list of posts with title, date, tags
- Click opens the blog URL (which opens blog page in window-styled layout)

- [ ] **Step 3: Create chat-window.tsx**

Extract the AI chat functionality:
- Reuse the chat logic from `command-input.tsx` but in a standalone chat UI
- Input at bottom, messages scrolling above
- Styled with terminal aesthetic inside the window

- [ ] **Step 4: Create resume-window.tsx**

Simple resume display:
- Import `BIO` from `lib/data/bio.ts`
- Render a clean, styled resume: name, title, education, experience highlights, skills
- Terminal-styled but formatted for readability
- Download link at top (placeholder for future PDF)

- [ ] **Step 5: Run `npm run build` to verify**
- [ ] **Step 6: Commit** `feat: add app content components for desktop windows`

---

## Task 8: Update Desktop Wrapper & Menu Bar

**Files:**
- Modify: `components/desktop.tsx` — integrate window manager
- Modify: `components/menu-bar.tsx` — show focused app name
- Delete: `components/dock.tsx` — replaced by dock-new.tsx

- [ ] **Step 1: Update desktop.tsx**

Rewrite to:
- Wrap everything in `<WindowManagerProvider>`
- On home page (detect via `usePathname() === "/"`): render `<DesktopCanvas />`
- On other pages: render children inside a static window-styled container
- Always render `<MenuBar />` at top and `<DockNew />` at bottom

- [ ] **Step 2: Update menu-bar.tsx**

- Import `useWindowManager` 
- Get `focusedWindowId` and find its title
- Display that title instead of hardcoded "Finder"
- When no window focused (or on non-home pages), show "Finder"
- Handle the case where window manager context is not available (non-home pages) — use a try/catch or optional context

- [ ] **Step 3: Delete old dock.tsx**

Remove `components/dock.tsx` (replaced by `components/desktop/dock-new.tsx`).

- [ ] **Step 4: Run `npm run build` to verify**
- [ ] **Step 5: Commit** `feat: integrate window manager into desktop shell`

---

## Task 9: Update Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update home page**

The home page should now:
- Keep the server component with JSON-LD and sr-only SEO section (unchanged)
- Remove direct `<HomeTerminal />` render — the desktop canvas handles it
- The page essentially just renders the SEO content; the interactive desktop is handled by the layout's Desktop component detecting `pathname === "/"`

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: update home page for desktop window system`

---

## Task 10: Favicon

**Files:**
- Create: `app/icon.svg`

- [ ] **Step 1: Create SVG favicon**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0a0a0a"/>
  <text x="4" y="22" font-family="monospace" font-size="16" font-weight="bold" fill="#00ff41">&gt;_</text>
</svg>
```

Next.js App Router auto-detects `app/icon.svg` as the favicon. Remove the old `app/favicon.ico` if it exists.

- [ ] **Step 2: Run `npm run build` to verify**
- [ ] **Step 3: Commit** `feat: add terminal-style SVG favicon`

---

## Task 11: Blog & Admin Page Styling

**Files:**
- Modify: `app/blog/page.tsx` — window-consistent styling
- Modify: `app/blog/[slug]/page.tsx` — window-consistent styling
- Modify: `app/layout.tsx` — ensure proper structure

- [ ] **Step 1: Update blog pages**

Blog pages already render inside the Desktop wrapper from layout. Since Desktop now renders non-home pages inside a window-styled container, the blog pages just need minor styling adjustments:
- Ensure padding works well inside the window
- Blog listing: keep search, posts, newsletter signup
- Blog post: keep TOC, reading progress, related posts
- Adjust max-width and padding if needed for window container

- [ ] **Step 2: Update layout.tsx if needed**

Ensure the layout properly passes children through the new Desktop component structure. The `<main>` tag should still wrap children for non-home pages.

- [ ] **Step 3: Run `npm run build` to verify**
- [ ] **Step 4: Commit** `feat: polish blog and admin page styling for window system`

---

## Task 12: Mobile Responsive & Final Polish

**Files:**
- Modify: various components as needed

- [ ] **Step 1: Mobile responsive**

In the window manager and desktop components:
- Detect screen size (use a `useMediaQuery` hook or check `window.innerWidth`)
- On mobile (< 768px):
  - Windows auto-maximize (fill available space)
  - Disable drag on windows
  - Hide desktop icons (use dock for navigation)
  - Dock: disable magnification, use smaller icons, simple horizontal layout
  - Menu bar: hide decorative items (File, Edit, View), just show Apple logo + clock

- [ ] **Step 2: Transition animations**

Ensure smooth transitions:
- Window open: scale(0.9) + opacity(0) → scale(1) + opacity(1), 200ms ease-out
- Window close: reverse, 150ms
- Window minimize: translate down + scale down, 300ms
- Dock magnification: smooth via CSS transition on transform, 100ms
- Desktop icon selection: 100ms transition on background/ring

- [ ] **Step 3: Final build and verify**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 4: Commit** `feat: add mobile responsive + animation polish`

---

## Key Decisions

- **Window manager as React Context** — simplest approach, no external state library needed. Windows are only on the home page, so the state scope is small.
- **Pointer Events API** for drag — handles both mouse and touch natively, no need for a drag library.
- **No resize** — windows have fixed sizes. Maximizing toggles between fixed and full-screen. Resize handles add complexity without much value for a portfolio site.
- **Blog pages as separate routes** — maintains SSR/SEO. They render inside window-styled containers but aren't managed by the window manager.
- **SVG favicon via app/icon.svg** — Next.js App Router convention, no build step needed.

## Verification

After all tasks:
- `npm run build` succeeds
- Home page shows interactive desktop with draggable windows
- Double-clicking desktop icons opens windows
- Dock magnification works smoothly
- Windows can be dragged, closed, minimized, maximized
- Trash accepts dragged windows
- Menu bar shows focused window name
- Blog/admin pages render in window-styled containers
- Favicon shows terminal prompt icon
- Mobile: windows auto-maximize, dock simplified
