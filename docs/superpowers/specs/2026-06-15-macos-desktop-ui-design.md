# Interactive macOS Desktop UI — Design Spec

## Goal

Transform eshwarkolla.com from a static desktop wrapper into a fully interactive macOS-like desktop experience with draggable windows, a magnifying dock, desktop app icons, a trash bin, and polished UI/UX across all pages. Add a proper favicon.

## Architecture

The home page (`/`) becomes a single-page desktop experience powered by a React Context window manager. Each "app" (Terminal, Blog, Chat, Resume) renders as a draggable, focusable window on a Sonoma-style gradient wallpaper. Desktop icons sit in a right-side grid (like real macOS). A dock with parabolic magnification sits at the bottom. A trash bin in the bottom-right accepts dragged windows.

Other routes (`/blog`, `/blog/[slug]`, `/admin`) remain real Next.js pages for SEO, but are styled with consistent window chrome via the layout wrapper.

## Tech Stack

- React Context for window state management
- CSS transforms + pointer events for drag, magnification, and animations
- No external libraries — pure React + Tailwind + vanilla JS events
- Next.js 16 App Router (existing)

---

## Components

### 1. Window Manager (`components/desktop/window-manager.tsx`)

React Context that manages all window state.

**State per window:**
- `id: string` — unique identifier (e.g., "terminal", "blog", "chat")
- `title: string` — window title bar text
- `isOpen: boolean`
- `isMinimized: boolean`
- `isMaximized: boolean`
- `position: { x: number, y: number }` — top-left corner
- `size: { width: number, height: number }` — window dimensions
- `zIndex: number` — stacking order
- `component: string` — which app component to render

**Actions:**
- `openWindow(id)` — open and focus
- `closeWindow(id)` — close (remove from view)
- `minimizeWindow(id)` — hide window, show in dock
- `maximizeWindow(id)` — toggle maximize/restore
- `focusWindow(id)` — bring to front (highest zIndex)
- `moveWindow(id, x, y)` — update position
- `bringAllToFront()` — reset z-ordering

**Initial state:** Terminal window open and centered.

### 2. Window Component (`components/desktop/window.tsx`)

Draggable, focusable window with macOS chrome.

**Features:**
- Title bar with traffic light buttons (red/yellow/green circles)
- Red = close window (calls `closeWindow`)
- Yellow = minimize (calls `minimizeWindow`, window slides down to dock)
- Green = maximize/restore toggle (calls `maximizeWindow`)
- Draggable by title bar via `onPointerDown`/`onPointerMove`/`onPointerUp`
- Click anywhere on window to focus (bring to front)
- Drop shadow: `shadow-2xl` when focused, `shadow-lg` when not
- Rounded corners (`rounded-xl`), frosted glass title bar
- Smooth open animation: scale from 0.95 to 1 + opacity 0 to 1
- Smooth close animation: reverse
- Constrained to viewport (can't drag completely off-screen)
- Touch support for mobile drag

**Props:**
- `windowId: string`
- `children: React.ReactNode`

### 3. Desktop Canvas (`components/desktop/desktop-canvas.tsx`)

Full-viewport container that renders the complete desktop.

**Contains:**
- Wallpaper background (Sonoma gradient)
- `<DesktopIcons />` — right-side grid
- All open windows from window manager
- `<Trash />` — bottom-right corner
- Does NOT contain MenuBar or Dock (those are in the parent Desktop component)

### 4. Desktop Icons (`components/desktop/desktop-icons.tsx`)

Grid of app icons positioned on the right side of the desktop.

**Icons (top to bottom, right-aligned):**
1. Terminal — dark icon with green `>_`
2. Blog — yellow/orange notepad icon
3. AI Chat — purple/blue brain/chat icon
4. Resume — blue document icon
5. GitHub — dark GitHub logo icon
6. LinkedIn — blue LinkedIn logo icon

**Behavior:**
- Single click: select (blue highlight border + label highlight)
- Double click: open the app window (or focus if already open)
- External apps (GitHub, LinkedIn): open in new tab on double-click
- Icons are 64x64px with label below, spaced in a grid
- Selected state: light blue semi-transparent background

### 5. Dock (`components/desktop/dock-new.tsx`)

Bottom dock with macOS-style magnification.

**Magnification algorithm:**
- Track mouse X position relative to dock
- Each icon's scale is based on distance from cursor (parabolic curve)
- Closest icon scales to ~1.8x, neighbors scale proportionally
- Icons further than ~3 positions away stay at 1x
- Formula: `scale = 1 + maxScale * Math.max(0, 1 - Math.abs(distance) / range)`

**Items:** Terminal, Blog, AI Chat, Resume, GitHub, LinkedIn, | separator, Trash

**Visual:**
- Frosted glass background (`bg-white/10 backdrop-blur-2xl rounded-2xl`)
- Separator line before Trash
- Running dot indicator (white dot below icon) for open windows
- Tooltip appears above icon on hover
- Bounce animation on click (translate-y keyframes)

**Behavior:**
- Click opens/focuses the window
- External links open in new tab
- Minimized windows can be restored by clicking their dock icon

### 6. Trash Bin (`components/desktop/trash.tsx`)

Desktop icon in bottom-right corner.

**Visual:**
- macOS trash can icon (empty state / full state)
- Positioned fixed in bottom-right, above the dock

**Behavior:**
- Dragging a window over trash highlights it (lid opens visual)
- Dropping a window on trash closes it
- The trash icon shows "full" state when windows have been closed in this session
- Clicking trash does nothing (decorative — no "restore from trash" needed)

### 7. Menu Bar (`components/menu-bar.tsx` — updated)

**Changes from current:**
- Shows the focused window's app name instead of always "Finder"
- When no windows focused, shows "Finder"
- Apple logo () stays
- Right side: Wi-Fi, battery, clock (unchanged)

### 8. Wallpaper

Sonoma-style gradient using CSS:
```css
background:
  radial-gradient(ellipse at 20% 50%, rgba(120, 40, 200, 0.5) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(212, 98, 43, 0.4) 0%, transparent 40%),
  radial-gradient(ellipse at 60% 80%, rgba(196, 75, 140, 0.3) 0%, transparent 45%),
  linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%);
```

### 9. Favicon

SVG favicon: terminal prompt `>_` in green (#00ff41) on a dark (#0a0a0a) rounded-rect background. Saved as `app/icon.svg` (Next.js App Router convention for favicon).

### 10. Updated Desktop Wrapper (`components/desktop.tsx`)

The existing `Desktop` component updated to use the new window manager:
- Wraps children in `<WindowManagerProvider>`
- Renders `<MenuBar />` at top
- Renders `<DesktopCanvas />` for home page (when no children/route is `/`)
- Renders children inside a `<Window>` for other routes (blog, admin)
- Renders `<Dock />` at bottom

### 11. Home Page Updates (`app/page.tsx`, `components/home-terminal.tsx`)

- `app/page.tsx`: Remove the `<HomeTerminal />` direct render. Instead, the desktop canvas auto-opens Terminal window.
- `components/home-terminal.tsx`: Content stays the same, but wrapped by the window manager's Terminal window instead of self-managing layout.

---

## UI/UX Polish

### Blog Pages
- Blog listing and post pages render inside window-styled containers
- Consistent traffic light buttons (decorative on non-home pages)
- Better padding and max-width for readability
- Tags get subtle hover glow

### All Pages
- Smooth page transitions (fade in)
- Consistent frosted glass aesthetic on interactive elements
- Better form styling (newsletter signup, search input)
- Hover states on all clickable elements

### Mobile Responsive
- Windows auto-maximize on screens < 768px (no drag on mobile)
- Dock simplifies: no magnification, smaller icons, horizontal scroll
- Desktop icons hidden on mobile (use dock only)
- Menu bar stays but simplified

---

## Routing Strategy

- **Home (`/`)**: Full desktop with window manager. Terminal opens by default.
- **Blog (`/blog`)**: Desktop background visible, blog content renders in a window-styled container via layout.
- **Blog Post (`/blog/[slug]`)**: Same — window-styled container.
- **Admin (`/admin`)**: Window-styled container.
- Desktop icons and dock items on non-home pages navigate via Next.js `<Link>`.

SEO is unaffected: the `sr-only` section and JSON-LD remain in the server-rendered page.

---

## File Changes

### New Files
- `components/desktop/window-manager.tsx`
- `components/desktop/window.tsx`
- `components/desktop/desktop-canvas.tsx`
- `components/desktop/desktop-icons.tsx`
- `components/desktop/dock-new.tsx`
- `components/desktop/trash.tsx`
- `app/icon.svg` (favicon)

### Modified Files
- `components/desktop.tsx` — rewrite to use window manager
- `components/menu-bar.tsx` — show focused app name
- `components/home-terminal.tsx` — remove outer layout wrapper (window provides it)
- `app/page.tsx` — integrate with desktop canvas
- `app/layout.tsx` — adjust for new desktop system
- `app/blog/page.tsx` — window styling
- `app/blog/[slug]/page.tsx` — window styling

### Deleted Files
- `components/dock.tsx` — replaced by `desktop/dock-new.tsx`
