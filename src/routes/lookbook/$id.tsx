import { Suspense } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LOOKS } from "#/lib/api/lookbook";
import { productQueries, type Product } from "#/lib/api/products";
import { LookbookSkeleton } from "#/components/lookbook/lookbook.skeleton";
import { LookbookError } from "#/components/lookbook/lookbook.error";

export const Route = createFileRoute("/lookbook/$id")({
  loader: async ({ params, context: { queryClient } }) => {
    const lookId = Number(params.id);
    const look = LOOKS.find((item) => item.id === lookId);

    if (!look) {
      throw notFound();
    }

    // Ensure products are prefetched for this look
    await queryClient.ensureQueryData(productQueries.all());

    return { look };
  },
  component: LookBookDetailPage,
  pendingComponent: LookbookSkeleton,
  errorComponent: LookbookError,
});

function LookBookDetailPage() {
  const { look } = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productQueries.all());

  const lookProducts = look.productIds
    .map((id: number) => products.find((p: Product) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <Suspense fallback={<LookbookSkeleton />}>
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <Link
            to="/lookbook"
            className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-900"
          >
            <span className="mr-1 text-lg">←</span> Back to lookbook
          </Link>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
              {look.tag}
            </p>
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
              {look.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
              {look.description}
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-neutral-500">
              {look.materials.map((material: string) => (
                <span
                  key={material}
                  className="rounded-full border border-neutral-200 px-3 py-1"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
          <div className="aspect-4/3 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
            {lookProducts[0] ? (
              <img
                src={lookProducts[0].image}
                alt={look.title}
                className="h-full w-full object-contain p-8"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Image placeholder
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
              Pieces in this look
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lookProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-50">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="line-clamp-2 text-xs leading-snug text-neutral-800">
                      {product.title}
                    </p>
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-xs font-medium text-neutral-900">
                        ${product.price.toFixed(2)}
                      </p>
                      <Link
                        to="/products/$id"
                        params={{ id: product.id.toString() }}
                        className="rounded-full border border-neutral-200 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                      >
                        View product
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Suspense>
  );
}
