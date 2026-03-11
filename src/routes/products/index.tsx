import { Suspense, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productQueries } from "#/lib/api/products";
import { ProductsSkeleton } from "#/components/products/product.skeleton";
import { ProductCard } from "#/components/products/product.card";

export const Route = createFileRoute("/products/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(productQueries.all()),
  component: ProductsRouteComponent,
});

function ProductsRouteComponent() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsPage />
    </Suspense>
  );
}

function ProductsPage() {
  const { data: products } = useSuspenseQuery(productQueries.all());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.category)
            .filter((c): c is string => Boolean(c?.trim()))
        )
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);

      const matchesCategory =
        !activeCategory || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
          Products
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
          All pieces in the collection
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Browse the full product catalog. Refine by category or search by name,
          description, or details.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 outline-none ring-0 transition focus:border-neutral-900 focus:bg-white"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.2em] text-neutral-400">
              Search
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            Showing{" "}
            <span className="font-medium text-neutral-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-neutral-900">
              {products.length}
            </span>{" "}
            products
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-colors ${
              activeCategory === null
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(activeCategory === category ? null : category)
              }
              className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-colors ${
                activeCategory === category
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section>
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-neutral-800">
              No products match your filters.
            </p>
            <p className="text-xs text-neutral-500">
              Try clearing the search or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
