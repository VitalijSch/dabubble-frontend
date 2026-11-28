"use client";

import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useLogError(error);
  const serverLogId = findServerLogId(error);

  return (
    <main
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-foreground/70">
        Please try again. If it keeps happening, reload the page.
      </p>
      {serverLogId && (
        <p className="text-foreground/50 font-mono text-xs">Error ID: {serverLogId}</p>
      )}
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

function useLogError(error: unknown) {
  useEffect(() => {
    console.error(error);
  }, [error]);
}

function findServerLogId(error: unknown): string | undefined {
  if (error instanceof Error && "digest" in error) return String(error.digest);
  return undefined;
}
