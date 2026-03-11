import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b px-4 sm:px-8 lg:px-12 backdrop-blur-lg bg-white/80">
      <nav className="flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4 max-w-6xl mx-auto">
        <Link
          to="/"
          className="text-lg italic font-medium inline-flex gap-0.5 items-center"
        >
          <span className="inline-flex items-center justify-center px-1.5 border-[1.5px] border-gray-500">
            TS
          </span>{" "}
          Commerce
        </Link>
        <div className="flex items-center gap-8 lg:gap-12 text-xs sm:text-sm">
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
        <div className="flex items-center gap-2">
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
        </div>
      </nav>
    </header>
  );
}
