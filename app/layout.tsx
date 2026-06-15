import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Nav from "@/components/nav";
import MatrixRain from "@/components/matrix-rain";
import BootSequence from "@/components/boot-sequence";
import PageTracker from "@/components/page-tracker";
import { SITE_URL, BIO } from "@/lib/data/bio";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${BIO.name} — ${BIO.title} at ${BIO.company} | AI/ML Builder`,
    template: `%s — ${BIO.name}`,
  },
  description: `${BIO.title} at ${BIO.company}, building AlvvaOS — AI for immigration law firms. 12+ years in fintech, AI, ML & data. Sold Foresee Health to PE. Daily thoughts on AI/ML.`,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BIO.name} — ${BIO.title} at ${BIO.company}`,
    description: BIO.tagline,
    url: SITE_URL,
    siteName: BIO.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BIO.name} — ${BIO.title} at ${BIO.company}`,
    description: BIO.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full`}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`AI/ML Journal — ${BIO.name}`}
          href="/feed.xml"
        />
      </head>
      <body className="min-h-full flex flex-col font-mono bg-background text-foreground">
        <BootSequence>
          <PageTracker />
          <MatrixRain />
          <div className="scanlines" />
          <Nav />
          <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 relative z-10">
            {children}
          </main>
          <footer className="border-t border-terminal-border py-4 text-center text-xs text-dim relative z-10">
            <span className="text-muted">$</span> echo &quot;built by eshwar
            kolla&quot;
          </footer>
        </BootSequence>
      </body>
    </html>
  );
}
