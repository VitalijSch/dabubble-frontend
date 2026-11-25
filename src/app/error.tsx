"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Replace with an error reporting service once one is set up.
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;

  return (
    <main
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-foreground/70">
        Please try again. If it keeps happening, reload the page.
      </p>
      {digest && <p className="text-foreground/50 font-mono text-xs">Error ID: {digest}</p>}
      <button
        type="button"
        onClick={() => retry()}
        className="bg-foreground text-background rounded-full px-5 py-2 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Try again
      </button>
    </main>
  );
}
