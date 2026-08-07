# PRD: Fix site navigation on mobile (and desktop non-home pages)

## Problem
On any non-home page (/blog, /blog/[slug], etc.) there is no working navigation:
1. The macOS-style MenuBar (File/Edit/View, app name, wifi/battery icons) is static decoration — nothing is clickable.
2. The Dock's app items (Terminal, Blog, AI Chat, Resume) call window-manager `openWindow()`, which only mutates in-memory window state. On routed pages there is no desktop canvas, so taps appear to do nothing. Users get trapped on a blog post with no way back except the tiny `$ cd ../` link.
3. The window-chrome traffic-light dots (red/yellow/green) on content pages look like macOS controls but are inert.
4. Desktop home (`/`) must keep its window-manager behavior — dock opens windows there. That is correct and must not regress.

## Goals
- Every page, mobile and desktop, has an obvious working way to reach: Home (/), Blog (/blog), AI Chat (home chat window), and external socials.
- Dead UI either becomes functional or stops pretending to be a control.
- Zero regression to the desktop window-manager experience on `/`.

## Non-goals
- Redesigning the desktop metaphor, adding new pages, changing blog content.

## UX decisions
1. **MenuBar app name becomes a real Home link** (both breakpoints). File/Edit/View stay hidden on mobile (already are) and remain decorative on desktop (standard for this aesthetic, low confusion since they're dimmed).
2. **Dock becomes context-aware:**
   - On `/` (home): unchanged — app icons open windows via the window manager.
   - On any other route: app icons become real navigation —
     - Terminal → `/`
     - Blog → `/blog`
     - AI Chat → `/?open=chat` (home opens the chat window on load via query param)
     - Resume → `/?open=resume`
   - External icons unchanged (real links already).
3. **Blog post page gets a visible back link.** The existing `$ cd ../` stays (it's thematic) but gets a clearer tap target; the fix is primarily carried by the working dock + menu bar.
4. **Traffic-light dots on content pages:** make the red dot a real "back to home" action with `cursor-pointer` + hover highlight + aria-label. Yellow/green stay inert but get `aria-hidden` so they stop announcing as controls. Keeps the aesthetic, removes the lie.

## Implementation plan
1. `components/menu-bar.tsx` — wrap app name in Next `<Link href="/">`; add `aria-label="Home"`.
2. `components/desktop/dock-new.tsx` — read `usePathname()`; when not `/`, route app clicks through `router.push()` to the targets above instead of `wm.openWindow`.
3. `components/desktop/desktop-canvas.tsx` (home) — on mount, read `?open=` param; if `chat` or `resume`, call `openWindow` for it, then strip the param (replaceState). Small, isolated.
4. `components/desktop.tsx` — content-page window chrome: red dot → `<Link href="/">` with padding, aria-label "Back to home", hover opacity; other dots aria-hidden.
5. Blog `[slug]` `$ cd ../` link: bump padding (`py-2 -my-2`) for a 44px-ish tap target.

## Testing (dev server, mobile + desktop emulation)
Mobile (375px):
- [ ] Open /blog/<post> → dock visible, tap Blog icon → lands on /blog
- [ ] Tap Terminal icon → lands on /
- [ ] Tap AI Chat icon → lands on / with chat window open
- [ ] Tap menu-bar app name → lands on /
- [ ] Tap red traffic-light dot → lands on /
- [ ] No horizontal overflow; dock fits 375px viewport
Desktop (1280px):
- [ ] Same five checks on /blog/<post>
- [ ] Home `/`: dock opens terminal/blog/chat/resume windows as before (window manager intact)
- [ ] Direct load of `/?open=chat` opens the chat window once
Then: `tsc --noEmit`, `npm run build`, commit, push, `docker compose up -d --build`, verify live on https://eshwarkolla.com/blog/<post> (200 + link markup present).

## Acceptance criteria
- From any page, one tap to Home and one tap to Blog, on 375px and 1280px.
- No console errors; build passes; live site verified.
