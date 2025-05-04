import type { Metadata } from "next";
import "@/styles/fonts.css";
import "@/styles/tailwind.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "DABubble",
};

interface RootLayoutProps {
  children: Readonly<React.ReactNode>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
