import type { Metadata } from "next";
import { Figtree, Nunito, Open_Sans } from "next/font/google";

import { hideIntroIfAlreadyPlayedScript } from "@/features/intro";

import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--next-font-nunito" });
const figtree = Figtree({ subsets: ["latin"], variable: "--next-font-figtree" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--next-font-open-sans" });

export const metadata: Metadata = {
  title: "DABubble",
  description: "Team chat with channels and direct messages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${nunito.variable} ${figtree.variable} ${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: hideIntroIfAlreadyPlayedScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
