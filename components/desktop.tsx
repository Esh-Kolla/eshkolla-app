"use client";

import { usePathname } from "next/navigation";
import { WindowManagerProvider } from "./desktop/window-manager";
import MenuBar from "./menu-bar";
import DockNew from "./desktop/dock-new";
import DesktopCanvas from "./desktop/desktop-canvas";

const SONOMA_WALLPAPER = [
  "radial-gradient(ellipse at 20% 50%, rgba(120, 40, 200, 0.5) 0%, transparent 50%)",
  "radial-gradient(ellipse at 80% 20%, rgba(212, 98, 43, 0.4) 0%, transparent 40%)",
  "radial-gradient(ellipse at 60% 80%, rgba(196, 75, 140, 0.3) 0%, transparent 45%)",
  "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)",
].join(", ");

export default function Desktop({
  children,
  posts,
}: {
  children: React.ReactNode;
  posts?: { slug: string; title: string; date: string; summary: string; tags: string[] }[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <WindowManagerProvider>
      <div className="min-h-screen flex flex-col">
        <MenuBar />

        {isHome ? (
          <DesktopCanvas posts={posts} />
        ) : (
          <div
            className="flex-1 relative"
            style={{ background: SONOMA_WALLPAPER }}
          >
            <div className="max-w-3xl w-full mx-auto px-2 py-8 pb-20 md:px-6 md:py-16 md:pb-24 relative z-10">
              <div className="rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a]/95 backdrop-blur-md border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                </div>
                <div className="p-4 md:p-6">{children}</div>
              </div>
            </div>
          </div>
        )}

        <DockNew />
      </div>
    </WindowManagerProvider>
  );
}
