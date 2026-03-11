import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productQueries } from "#/lib/api/products";
import type { Product } from "#/lib/types";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(productQueries.all()),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();

  const { data } = useSuspenseQuery(productQueries.all());
  const products = data ?? [];
  const categories = Array.from(
    new Set(products.map((p: Product) => p.category))
  );

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const featured = visibleProducts.slice(0, 3);

  return (
    <main className="page-wrap px-4 pb-14 pt-16 space-y-12">
      <section className="mx-auto max-w-5xl text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
          {import.meta.env.VITE_APP_NAME}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Minimal store for everyday essentials
        </h1>
        <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
          Curated, simple products designed to fit into a calm, modern
          lifestyle.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            type="button"
            className="rounded-full bg-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-gray-900"
          >
            Shop collection
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/lookbook" })}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-50"
          >
            View lookbook
          </button>
        </div>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between border-y border-gray-100 py-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            Store overview
          </p>
          <p className="text-sm text-gray-600">
            {products.length} products · {categories.length} categories
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <span className="rounded-full border border-gray-200 px-3 py-1">
            Free shipping over $50
          </span>
          <span className="rounded-full border border-gray-200 px-3 py-1">
            Secure checkout
          </span>
          <span className="rounded-full border border-gray-200 px-3 py-1">
            30‑day returns
          </span>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600">
            Featured
          </h2>
          <Link
            to="/posts"
            className="text-xs font-medium text-gray-500 hover:text-gray-800 underline-offset-4 hover:underline"
          >
            View all stories
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((product: Product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
            >
              <div className="aspect-4/3 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full max-w-[250px] object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 px-4 py-3 text-left">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                  {product.category}
                </p>
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-800 hover:bg-gray-50"
                  >
                    Add to bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-5xl space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600">
              Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            button{" "}
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                activeCategory === null
                  ? "border-black bg-black text-white"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* All products grid */}
      <section className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600">
            All products
          </h2>
          <p className="text-xs text-gray-500">
            Showing {visibleProducts.length} items
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product: Product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-shadow"
            >
              <div className="aspect-4/5 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full max-w-[200px] object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 px-4 py-3 text-left">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                  {product.category}
                </p>
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                  {product.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-800 hover:bg-gray-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
