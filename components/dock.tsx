"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DockItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  external?: boolean;
}

const DOCK_ITEMS: DockItem[] = [
  {
    label: "Terminal",
    icon: (
      <span className="text-2xl leading-none flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 shadow-lg">
        <span className="text-[#00ff41] text-base font-bold">&gt;_</span>
      </span>
    ),
    href: "/",
  },
  {
    label: "Blog",
    icon: (
      <span className="text-2xl leading-none flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#f59e0b] to-[#d97706] shadow-lg">
        <span className="text-white text-lg">&#x1f4dd;</span>
      </span>
    ),
    href: "/blog",
  },
  {
    label: "GitHub",
    icon: (
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#333] to-[#1a1a1a] border border-white/10 shadow-lg">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </span>
    ),
    href: "https://github.com/eshwarkolla",
    external: true,
  },
  {
    label: "LinkedIn",
    icon: (
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#0077b5] to-[#005e93] shadow-lg">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </span>
    ),
    href: "https://linkedin.com/in/eshwarkolla",
    external: true,
  },
  {
    label: "X",
    icon: (
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#333] to-[#1a1a1a] border border-white/10 shadow-lg">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </span>
    ),
    href: "https://x.com/eshwarkolla",
    external: true,
  },
  {
    label: "Email",
    icon: (
      <span className="text-2xl leading-none flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#34a853] to-[#1e7e34] shadow-lg">
        <span className="text-white text-lg">&#x2709;</span>
      </span>
    ),
    href: "mailto:eshwar.kolla@outlook.com",
    external: true,
  },
];

function DockIcon({ item, isActive }: { item: DockItem; isActive: boolean }) {
  const content = (
    <div className="flex flex-col items-center gap-1 group cursor-pointer">
      <div className="transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-110">
        {item.icon}
      </div>
      <span className="text-[10px] text-[#e0e0e0]/60 group-hover:text-[#e0e0e0]/90 transition-colors">
        {item.label}
      </span>
      {isActive && (
        <div className="w-1 h-1 rounded-full bg-white/80 -mt-0.5" />
      )}
      {!isActive && <div className="w-1 h-1 -mt-0.5" />}
    </div>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={item.href}>{content}</Link>;
}

export default function Dock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        {DOCK_ITEMS.map((item) => {
          const isActive =
            !item.external &&
            (item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href));
          return <DockIcon key={item.label} item={item} isActive={isActive} />;
        })}
      </div>
    </div>
  );
}
