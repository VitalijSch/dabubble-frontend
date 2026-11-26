import type { Metadata } from "next";
import { Figtree, Nunito, Open_Sans } from "next/font/google";

import { introPlayedScript } from "@/features/intro";

import "./globals.css";

// Self-hosted at build time by next/font; no requests to Google at runtime.
const nunito = Nunito({ subsets: ["latin"], variable: "--next-font-nunito" });
const figtree = Figtree({ subsets: ["latin"], variable: "--next-font-figtree" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--next-font-open-sans" });

export const metadata: Metadata = {
  title: "DABubble",
  description: "Team chat with channels and direct messages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script below may add an attribute to <html>.
    <html
      lang="de"
      className={`${nunito.variable} ${figtree.variable} ${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Hides the intro before the first paint if it already played in this tab. */}
        <script dangerouslySetInnerHTML={{ __html: introPlayedScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
