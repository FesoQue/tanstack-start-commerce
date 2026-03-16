import {
  createFileRoute,
  Link,
  useRouter,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart, cartQuery, getCartTotal, useClearCart } from "#/lib/api/cart";
import { useSession } from "#/lib/auth-client";
import { redirect } from "@tanstack/react-router";
import { getSession } from "#/lib/server/session";
import toast from "react-hot-toast";
import { Lock as LockIcon } from "lucide-react";

const checkoutSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State / province is required"),
  zip: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Enter a valid 16-digit card number"),
  expiry: z
    .string()
    .min(1, "Expiry is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cvc: z
    .string()
    .min(3, "CVC is required")
    .max(4)
    .regex(/^\d{3,4}$/, "Invalid CVC"),
  nameOnCard: z.string().min(1, "Name on card is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const Route = createFileRoute("/checkout")({
  beforeLoad: async ({ context }) => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login", search: { redirect: "/checkout" } });
    }

    const cart = await context.queryClient.ensureQueryData(cartQuery);
    if (!cart.items.length) {
      throw redirect({ to: "/cart" });
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(cartQuery),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { data: cart } = useCart();
  const { data: session, isPending } = useSession();
  const clearCart = useClearCart();
  const router = useRouter();
  const navigate = useNavigate();

  // Redirect away if the user logs out while on this page
  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [session, isPending, navigate]);

  const subtotal = getCartTotal(cart);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email ?? "",
      firstName: session?.user?.name?.split(" ")[0] ?? "",
      lastName: session?.user?.name?.split(" ").slice(1).join(" ") ?? "",
      country: "United States",
    },
  });

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const onSubmit = async (_values: CheckoutFormValues) => {
    // Placeholder: in production, tokenise the card with Stripe / paystack / flutterwave and submit the order to your API before clearing the cart.

    await new Promise((r) => setTimeout(r, 1200)); // simulate network
    clearCart.mutate(undefined, {
      onSuccess: () => {
        toast.success("Order placed! Thank you for your purchase.");
        router.navigate({ to: "/" });
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        to="/cart"
        className="mb-8 inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← Back to cart
      </Link>

      <h1 className="mb-8 text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]"
      >
        {/* ── Left column ── */}
        <div className="flex flex-col gap-8">
          {/* Contact */}
          <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Contact
            </h2>
            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={input(!!errors.email)}
              />
            </Field>
          </section>

          {/* Shipping */}
          <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Shipping address
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName?.message}>
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  {...register("firstName")}
                  className={input(!!errors.firstName)}
                />
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Smith"
                  {...register("lastName")}
                  className={input(!!errors.lastName)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address" error={errors.address?.message}>
                  <input
                    type="text"
                    autoComplete="street-address"
                    placeholder="123 Main St"
                    {...register("address")}
                    className={input(!!errors.address)}
                  />
                </Field>
              </div>
              <Field label="City" error={errors.city?.message}>
                <input
                  type="text"
                  autoComplete="address-level2"
                  placeholder="New York"
                  {...register("city")}
                  className={input(!!errors.city)}
                />
              </Field>
              <Field label="State / Province" error={errors.state?.message}>
                <input
                  type="text"
                  autoComplete="address-level1"
                  placeholder="NY"
                  {...register("state")}
                  className={input(!!errors.state)}
                />
              </Field>
              <Field label="Postal code" error={errors.zip?.message}>
                <input
                  type="text"
                  autoComplete="postal-code"
                  placeholder="10001"
                  {...register("zip")}
                  className={input(!!errors.zip)}
                />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <select
                  autoComplete="country-name"
                  {...register("country")}
                  className={input(!!errors.country)}
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Nigeria</option>
                  <option>Other</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Payment
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                <LockIcon className="h-3 w-3" />
                Secured &amp; encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Card number" error={errors.cardNumber?.message}>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    {...register("cardNumber")}
                    onChange={(e) =>
                      setValue("cardNumber", formatCardNumber(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                    className={input(!!errors.cardNumber)}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Name on card" error={errors.nameOnCard?.message}>
                  <input
                    type="text"
                    autoComplete="cc-name"
                    placeholder="Jane Smith"
                    {...register("nameOnCard")}
                    className={input(!!errors.nameOnCard)}
                  />
                </Field>
              </div>
              <Field label="Expiry (MM/YY)" error={errors.expiry?.message}>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="08/27"
                  maxLength={5}
                  {...register("expiry")}
                  onChange={(e) =>
                    setValue("expiry", formatExpiry(e.target.value), {
                      shouldValidate: true,
                    })
                  }
                  className={input(!!errors.expiry)}
                />
              </Field>
              <Field label="CVC" error={errors.cvc?.message}>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  {...register("cvc")}
                  className={input(!!errors.cvc)}
                />
              </Field>
            </div>
          </section>
        </div>

        {/* ── Right column: Order summary ── */}
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Order summary
            </h2>

            <ul className="divide-y divide-neutral-100">
              {cart.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="relative shrink-0">
                    <div className="h-14 w-14 overflow-hidden rounded-md border border-neutral-100 bg-neutral-50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-600 px-1 text-[10px] font-medium text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-xs text-neutral-800">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {item.category}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-neutral-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2 text-sm font-medium text-neutral-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="mt-3 text-[11px] text-neutral-400">
                Free shipping on orders over $100.
              </p>
            )}
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-black px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Placing order…" : `Pay $${total.toFixed(2)}`}
          </button>

          <p className="text-center text-[11px] text-neutral-400">
            By placing your order you agree to our{" "}
            <span className="underline underline-offset-2">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline underline-offset-2">Privacy Policy</span>
            .
          </p>
        </div>
      </form>
    </main>
  );
}

// ── Small helpers ───

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const input = (hasError: boolean) =>
  `w-full rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-900 bg-white ${
    hasError ? "border-red-400" : "border-neutral-200"
  }`;
