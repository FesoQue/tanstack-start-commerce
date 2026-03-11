export function ProductsSkeleton() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
        <div className="h-8 w-64 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-80 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-9 w-full max-w-sm animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-16 animate-pulse rounded-full bg-neutral-100"
            />
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4"
          >
            <div className="aspect-square w-full animate-pulse rounded-lg bg-neutral-100" />
            <div className="h-3 w-32 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
