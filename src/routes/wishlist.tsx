import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useWishlist,
  useClearWishlist,
  useRemoveFromWishlist,
  wishlistQuery,
} from "#/lib/api/wishlist";
import { useAddToCart } from "#/lib/api/cart";
import { useSession } from "#/lib/auth-client";
import toast from "react-hot-toast";
import { Trash2, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(wishlistQuery),
  component: WishlistPage,
});

function WishlistPage() {
  const { data: wishlist } = useWishlist();
  const { data: session } = useSession();
  const removeMutation = useRemoveFromWishlist();
  const clearMutation = useClearWishlist();
  const addToCartMutation = useAddToCart();

  const hasItems = wishlist.items.length > 0;

  const handleMoveToCart = (item: (typeof wishlist.items)[number]) => {
    addToCartMutation.mutate(
      {
        productId: item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
      },
      {
        onSuccess: () => {
          removeMutation.mutate(item.productId);
          toast.success("Moved to cart");
        },
        onError: () => toast.error("Failed to add to cart"),
      }
    );
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
          Wishlist
        </h1>
        <p className="text-sm text-neutral-600">
          {hasItems
            ? `${wishlist.items.length} saved ${wishlist.items.length === 1 ? "piece" : "pieces"}`
            : "You haven't saved any pieces yet."}
        </p>
      </header>

      {hasItems ? (
        <>
          <section className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
            <ul className="divide-y divide-neutral-100">
              {wishlist.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Product info */}
                  <Link
                    to="/products/$id"
                    params={{ id: String(item.productId) }}
                    className="flex items-start gap-3 hover:opacity-80"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-neutral-100 bg-neutral-50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-900 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.category}
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      disabled={addToCartMutation.isPending}
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-neutral-800 disabled:opacity-60"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        removeMutation.mutate(item.productId, {
                          onSuccess: () =>
                            toast.success("Removed from wishlist"),
                        })
                      }
                      disabled={removeMutation.isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:border-red-300 hover:text-red-500 disabled:opacity-60"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                clearMutation.mutate(undefined, {
                  onSuccess: () => toast.success("Wishlist cleared"),
                })
              }
              disabled={clearMutation.isPending}
              className="text-xs text-neutral-400 underline-offset-2 hover:text-neutral-700 hover:underline"
            >
              Clear wishlist
            </button>
          </div>
        </>
      ) : (
        <section className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-14 text-center">
          <p className="text-sm font-medium text-neutral-800">
            Your wishlist is empty.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Browse the collection and save pieces you love.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {!session?.user && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-neutral-900"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
            >
              Browse collection
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
