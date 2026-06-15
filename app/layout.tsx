import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import BootSequence from "@/components/boot-sequence";
import Desktop from "@/components/desktop";
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
          <Desktop>
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 pb-24 relative">
              {children}
            </main>
          </Desktop>
        </BootSequence>
      </body>
    </html>
  );
}
