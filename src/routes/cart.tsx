import { createFileRoute } from "@tanstack/react-router";
// import {
//   useCart,
//   useRemoveFromCart,
//   useUpdateQuantity,
//   useClearCart,
// } from "#/lib/api/carts";
// import { cartQuery } from "#/lib/api/carts";
// import { getCartTotal } from "#/lib/server/cart";

export const Route = createFileRoute("/cart")({
  // loader: ({ context: { queryClient } }) =>
  //   queryClient.ensureQueryData(cartQuery),
  component: CartComponent,
});

function CartComponent() {
  // const { data: cart } = useCart();

  // const removeMutation = useRemoveFromCart();
  // const updateQuantityMutation = useUpdateQuantity();
  // const clearCartMutation = useClearCart();

  // const hasItems = cart.items.length > 0;
  // const subtotal = getCartTotal(cart);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
          Cart
        </h1>
        {/* <p className="text-sm text-neutral-600">
          {hasItems
            ? "Review the pieces in your cart before checking out."
            : "Your cart is empty. Add pieces from the collection to get started."}
        </p> */}
      </header>

      {/* {hasItems ? (
        <>
          <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
            <ul className="divide-y divide-neutral-100">
              {cart.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
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
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantityMutation.mutate({
                            productId: item.productId,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantityMutation.mutate({
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(item.productId)}
                      className="text-xs text-neutral-500 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-base font-medium text-neutral-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Taxes and shipping are calculated at checkout.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                type="button"
                className="w-full rounded-full bg-black px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-neutral-900"
              >
                Proceed to checkout
              </button>
              <button
                type="button"
                onClick={() => clearCartMutation.mutate()}
                className="w-full rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
              >
                Clear cart
              </button>
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-14 text-center">
          <p className="text-sm font-medium text-neutral-800">
            Your cart is empty.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Explore the collection and add items to your cart when you’re ready.
          </p>
        </section>
      )} */}
    </main>
  );
}
