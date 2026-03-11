export function LookbookError() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
        Error
      </p>
      <h2 className="text-xl font-medium text-neutral-900">
        Failed to load lookbook
      </h2>
      <p className="text-sm text-neutral-500">
        Could not fetch products. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 rounded-full border border-neutral-900 px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
      >
        Retry
      </button>
    </main>
  );
}
