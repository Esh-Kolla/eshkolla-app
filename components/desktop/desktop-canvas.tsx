"use client";

import { useWindowManager } from "./window-manager";
import DesktopIcons from "./desktop-icons";
import Window from "./window";
import Trash from "./trash";
import { HomeTerminalContent } from "@/components/home-terminal";
import BlogWindow from "@/components/apps/blog-window";
import ChatWindow from "@/components/apps/chat-window";
import ResumeWindow from "@/components/apps/resume-window";

interface DesktopCanvasProps {
  posts?: { slug: string; title: string; date: string; summary: string; tags: string[] }[];
}

const SONOMA_WALLPAPER = [
  "radial-gradient(ellipse at 20% 50%, rgba(120, 40, 200, 0.5) 0%, transparent 50%)",
  "radial-gradient(ellipse at 80% 20%, rgba(212, 98, 43, 0.4) 0%, transparent 40%)",
  "radial-gradient(ellipse at 60% 80%, rgba(196, 75, 140, 0.3) 0%, transparent 45%)",
  "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)",
].join(", ");

function WindowContent({ windowId, posts }: { windowId: string; posts?: DesktopCanvasProps["posts"] }) {
  switch (windowId) {
    case "terminal":
      return <HomeTerminalContent />;
    case "blog":
      return <BlogWindow posts={posts ?? []} />;
    case "chat":
      return <ChatWindow />;
    case "resume":
      return <ResumeWindow />;
    default:
      return null;
  }
}

export default function DesktopCanvas({ posts }: DesktopCanvasProps) {
  const { windows } = useWindowManager();

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{ background: SONOMA_WALLPAPER }}
    >
      <DesktopIcons />

      {windows
        .filter((w) => w.isOpen)
        .map((w) => (
          <Window key={w.id} windowId={w.id}>
            <WindowContent windowId={w.id} posts={posts} />
          </Window>
        ))}

      <Trash />
    </div>
  );
}
