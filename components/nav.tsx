"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "~" },
  { href: "/blog", label: "blog" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-terminal-border bg-terminal-bg">
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-6">
        <span className="text-dim text-sm">eshwar@kolla:</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-all ${
              pathname === link.href
                ? "text-foreground text-glow"
                : "text-muted hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
