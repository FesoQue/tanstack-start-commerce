import { CATEGORIES, LOOKS } from "#/lib/api/lookbook";
import { productQueries } from "#/lib/api/products";
import type { Product } from "#/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();

  return (
    <div className="group/card flex flex-col gap-2">
      <div className="aspect-square overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover/card:scale-105"
        />
      </div>
      <div className="space-y-0.5">
        <p className="line-clamp-2 text-xs leading-snug text-neutral-700">
          {product.title}
        </p>
        <p className="text-xs font-medium text-neutral-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <button
        onClick={() =>
          navigate({
            to: "/lookbook/$id",
            params: { id: product.id.toString() },
          })
        }
        className="mt-1 w-full rounded-lg border border-neutral-200 py-1.5 text-[10px] uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
      >
        Add to cart
      </button>
    </div>
  );
}

function LookCard({
  look,
  products,
}: {
  look: (typeof LOOKS)[0];
  products: Product[];
}) {
  const [expanded, setExpanded] = useState(false);

  const lookProducts = look.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-900">
      <Link to="/lookbook/$id" params={{ id: look.id.toString() }}>
        <div className="aspect-4/3 w-full overflow-hidden bg-neutral-100">
          <img
            src={lookProducts[0]?.image}
            alt={look.title}
            className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tag + toggle */}
        <div className="flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          <span>{look.tag}</span>
          <span className="mx-3 h-px flex-1 bg-neutral-200" />
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-neutral-400 transition-colors hover:text-neutral-900 border py-1 px-2 rounded-full"
          >
            {expanded ? "Close" : "View All"}
          </button>
        </div>

        {/* Title + description */}
        <div className="space-y-1">
          <h3 className="text-base font-medium text-neutral-900">
            {look.title}
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600">
            {look.description}
          </p>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 text-[11px] text-neutral-500">
          {look.materials.map((m) => (
            <span
              key={m}
              className="rounded-full border border-neutral-200 px-3 py-1"
            >
              {m}
            </span>
          ))}
        </div>

        {/* Expanded products */}
        {expanded && (
          <div className="mt-2 border-t border-neutral-100 pt-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Pieces in this look
            </p>
            <div className="grid grid-cols-3 gap-3">
              {lookProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function CategorySection({
  category,
  looks,
  products,
}: {
  category: (typeof CATEGORIES)[0];
  looks: typeof LOOKS;
  products: Product[];
}) {
  const categoryLooks = looks.filter((l) => l.category === category.key);
  if (categoryLooks.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Collection
          </p>
          <h2 className="text-xl font-medium tracking-tight text-neutral-900">
            {category.label}
          </h2>
          <p className="text-sm text-neutral-500">{category.description}</p>
        </div>
        <span className="text-[11px] text-neutral-400">
          {categoryLooks.length} {categoryLooks.length === 1 ? "look" : "looks"}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoryLooks.map((look) => (
          <LookCard key={look.id} look={look} products={products} />
        ))}
      </div>
    </section>
  );
}

export function LookbookContent() {
  const { data: products } = useSuspenseQuery(productQueries.all());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = activeCategory
    ? CATEGORIES.filter((c) => c.key === activeCategory)
    : CATEGORIES;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
          Lookbook
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
          Minimal wardrobe, maximal clarity
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          A rotating selection of pared-back looks focused on shape, texture,
          and proportion. Use this as a quiet guide for building your everyday
          uniform.
        </p>
      </header>

      {/* Category filter tabs */}
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
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() =>
              setActiveCategory(activeCategory === cat.key ? null : cat.key)
            }
            className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-colors ${
              activeCategory === cat.key
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category sections */}
      <div className="flex flex-col gap-16">
        {filteredCategories.map((category) => (
          <CategorySection
            key={category.key}
            category={category}
            looks={LOOKS}
            products={products}
          />
        ))}
      </div>
    </main>
  );
}
