import type { Product } from "#/lib/types";
import { Link } from "@tanstack/react-router";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-900">
      <div className="aspect-square overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1">
        <p className="line-clamp-2 text-xs leading-snug text-neutral-700">
          {product.title}
        </p>
        <p className="text-xs font-medium text-neutral-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
        {product.category}
      </p>
      <Link
        to="/products/$id"
        params={{ id: product.id.toString() }}
        className="mt-1 inline-flex items-center justify-center rounded-full border border-neutral-200 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
      >
        View product
      </Link>
    </article>
  );
}
