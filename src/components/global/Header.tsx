import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b px-6 md:px-10 backdrop-blur-lg bg-white/80">
      <nav className="flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight italic">
          Tenue
        </Link>
        <div className="flex items-center gap-5 text-xs sm:text-sm">
          <Link
            to="/"
            activeProps={{ className: "font-bold" }}
            className="text-gray-700 hover:text-black"
          >
            Home
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
