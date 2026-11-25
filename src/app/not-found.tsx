import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-foreground/50 font-mono text-sm">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-foreground/70">This page doesn&apos;t exist or was moved.</p>
      <Link
        href="/"
        className="bg-foreground text-background rounded-full px-5 py-2 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Back to home
      </Link>
    </main>
  );
}
