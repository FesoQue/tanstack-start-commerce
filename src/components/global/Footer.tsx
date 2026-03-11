export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              TanStack Commerce
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
              A minimal, uncluttered space for exploring products and building a
              calm, considered wardrobe.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-neutral-600">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                Explore
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="/products" className="hover:text-neutral-900">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/lookbook" className="hover:text-neutral-900">
                    Lookbook
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                Company
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-neutral-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-100 pt-4 text-xs text-neutral-500 sm:flex-row">
          <p>© {year} TanStack Commerce. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-neutral-900">
              Privacy
            </a>
            <span className="h-3 w-px bg-neutral-300" />
            <a href="#" className="hover:text-neutral-900">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
