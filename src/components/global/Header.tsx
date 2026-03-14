import { useSession, signOut } from "#/lib/auth-client";
import { useCart, getCartCount } from "#/lib/api/cart";
import { useWishlist } from "#/lib/api/wishlist";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const { data: session, isPending } = useSession();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const wishlistCount = wishlist.items.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const cartCount = getCartCount(cart);
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    setIsNavOpen(false);
    await signOut();
    // Immediately wipe session-dependent caches (cart & wishlist) so stale data doesn't show
    const empty = {
      userId: null,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    queryClient.setQueryData(["cart"], empty);
    queryClient.setQueryData(["wishlist"], empty);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-b-gray-300 px-4 sm:px-8 lg:px-12 backdrop-blur-lg bg-white/80">
      <nav className="max-w-6xl mx-auto py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-lg italic font-medium inline-flex gap-0.5 items-center"
          >
            <span className="inline-flex items-center justify-center px-1.5 border-[1.5px] border-gray-500">
              TS
            </span>{" "}
            Commerce
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 text-xs sm:flex lg:gap-12 sm:text-sm">
            <Link
              to="/"
              activeProps={{ className: "font-bold" }}
              className="text-gray-700 hover:text-black"
            >
              Home
            </Link>
            <Link
              to="/products"
              activeProps={{ className: "font-bold" }}
              className="text-gray-700 hover:text-black"
            >
              Collection
            </Link>
            <Link
              to="/lookbook"
              activeProps={{ className: "font-bold" }}
              className="text-gray-700 hover:text-black"
            >
              Look Book
            </Link>
          </div>
          <div className="hidden items-center gap-4 text-xs sm:flex lg:gap-6 sm:text-sm">
            <Link to="/wishlist" className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                <Heart className="h-4 w-4" />
              </div>
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                <ShoppingCart className="h-4 w-4" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <div className="relative flex items-center gap-2">
              {isPending ? (
                <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
              ) : session?.user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
                      {session.user.name?.[0]?.toUpperCase() ??
                        session.user.email?.[0]?.toUpperCase() ??
                        "U"}
                    </span>
                    <span className="max-w-[120px] truncate">
                      {session.user.name ?? session.user.email}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-gray-200 bg-white py-2 text-xs shadow-lg">
                      <div className="px-3 pb-2 text-[11px] text-gray-500">
                        Signed in as
                        <div className="truncate text-gray-800">
                          {session.user.email}
                        </div>
                      </div>
                      <div className="my-1 h-px bg-gray-100" />
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center px-3 py-1.5 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-gray-700 hover:bg-gray-50"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-gray-700 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-black px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-gray-900"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* mobile nav items */}
          <div className="sm:hidden flex items-center gap-6">
            <Link
              to="/wishlist"
              className="relative text-gray-700 hover:text-black"
              onClick={() => setIsNavOpen(false)}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 text-gray-700 hover:text-black"
              onClick={() => setIsNavOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:hidden"
              onClick={() => setIsNavOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="flex flex-col gap-1.5">
                <span className="block h-[1.5px] w-4 bg-gray-800" />
                <span className="block h-[1.5px] w-4 bg-gray-800" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav menu list */}
        {isNavOpen && (
          <div className="mt-3 flex flex-col gap-3 border-t border-gray-200 pt-3 text-sm sm:hidden">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-black"
                onClick={() => setIsNavOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-black"
                onClick={() => setIsNavOpen(false)}
              >
                Collection
              </Link>
              <Link
                to="/lookbook"
                className="text-gray-700 hover:text-black"
                onClick={() => setIsNavOpen(false)}
              >
                Look Book
              </Link>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {isPending ? (
                <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
              ) : session?.user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-gray-700 hover:bg-gray-50"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 rounded-full border border-gray-300 px-3 py-1.5 text-center text-xs font-medium uppercase tracking-[0.16em] text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 rounded-full bg-black px-3 py-1.5 text-center text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-gray-900"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
