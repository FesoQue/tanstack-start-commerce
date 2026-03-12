import { Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productQueries, type Product } from "#/lib/api/products";
import { ProductsSkeleton } from "#/components/products/product.skeleton";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(productQueries.detail(Number(params.id))),
  component: ProductDetailRouteComponent,
  pendingComponent: ProductsSkeleton,
});

function ProductDetailRouteComponent() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductDetailPage />
    </Suspense>
  );
}

function ProductDetailPage() {
  const { id } = Route.useParams();
  const { data: product } = useSuspenseQuery(
    productQueries.detail(Number(id))
  ) as { data: Product };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <Link
          to="/products"
          className="text-xs text-neutral-500 hover:text-neutral-900"
        >
          ← Back to products
        </Link>
      </header>

      <section className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
        <div className="aspect-square w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain p-8"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
              {product.category}
            </p>
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
              {product.title}
            </h1>
          </div>

          <p className="text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <p className="text-xl font-semibold text-neutral-900">
            ${product.price.toFixed(2)}
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <button className="rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800">
              Add to cart
            </button>
            <button className="rounded-full border border-neutral-200 px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900">
              Save for later
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
