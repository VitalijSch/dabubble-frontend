export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div role="status" aria-live="polite" className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="border-foreground/20 border-t-foreground size-5 animate-spin rounded-full border-2 motion-reduce:animate-none"
        />
        <span className="text-foreground/70">Loading…</span>
      </div>
    </main>
  );
}
