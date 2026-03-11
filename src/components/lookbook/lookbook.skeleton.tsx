export function LookbookSkeleton() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
        <div className="h-8 w-72 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-96 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-16 animate-pulse rounded-full bg-neutral-200"
          />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-5"
          >
            <div className="aspect-4/3 w-full animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
            <div className="h-5 w-40 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    </main>
  );
}
