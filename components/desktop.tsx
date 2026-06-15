"use client";

import MenuBar from "./menu-bar";
import Dock from "./dock";

export default function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at 30% 50%, #1a1a3e 0%, #0d0d1a 40%, #0a0a0f 100%)",
      }}
    >
      <MenuBar />
      <div className="flex-1 relative z-10">{children}</div>
      <Dock />
    </div>
  );
}
