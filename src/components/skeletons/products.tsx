export const ProductsCardSkeleton = () => {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="aspect-4/3 bg-gray-50 animate-pulse" />
      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <div className="h-3 w-16 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-3 w-32 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-3 w-40 rounded-full bg-gray-100 animate-pulse" />
        <div className="mt-2 flex items-center justify-between">
          <div className="h-4 w-14 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-7 w-20 rounded-full bg-gray-100 animate-pulse" />
        </div>
      </div>
    </article>
  );
};
