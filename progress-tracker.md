## Auth & Sessions

- **Better Auth integration**
  - Set up `betterAuth` in `src/lib/auth.ts` with:
    - `mongodbAdapter(db)` using a shared MongoDB client.
    - `emailAndPassword` auth enabled.
    - `emailOTP` plugin configured with 6-digit codes and 1-hour expiry.
    - Email delivery wired through Resend using the `otpTemplate` helper.
  - Created a production-ready MongoDB client in `src/lib/db.ts`:
    - Uses `DATABASE_URL` or `MONGODB_URI` + optional `MONGODB_DB`.
    - Caches a single `MongoClient` and connection promise on `globalThis`.
    - Exposes both async helpers (`getMongoClient`, `getDb`) and a synchronous `db` instance for libraries like Better Auth.

- **Auth client (frontend)**
  - Added `src/lib/auth-client.ts`:
    - Uses `createAuthClient` with `emailOTPClient` plugin.
    - Exports `useSession`, `signIn`, `signUp`, `signOut`, and `emailOtp`.

- **Auth routes & flow**
  - `/(auth)/login`:
    - Converted to React Hook Form + Zod:
      - Schema: `{ email, password }` with basic required and length rules.
    - Integrated with `signIn.email` from the auth client.
      - Shows errors via `react-hot-toast`.
      - Leave navigation hook ready (login success handling).
  - `/(auth)/signup`:
    - Converted to React Hook Form + Zod:
      - Schema: `{ name, email, password }` with validation.
    - Integrated with `signUp.email`:
      - On success, navigates to `/` after account creation (and email verification flow).
  - `/(auth)/verify` (OTP verification screen):
    - New route and screen for email verification codes.
    - Uses Zod + RHF for a 6-digit numeric `code` field.
    - Reads `email` from search params using `validateSearch`.
    - Calls `emailOtp.checkVerificationOtp` for verification.
    - On success, navigates to `/`.
    - Adds resend functionality:
      - `emailOtp.sendVerificationOtp` to resend codes.
      - 30s cooldown timer with disabled state and countdown label.
  - `/(auth)/route.tsx`:
    - Added but then commented-out a Better Auth-based `beforeLoad` guard that would redirect authenticated users away from auth routes.
    - Current version only renders the `Outlet`; guard can be re-enabled later if desired.

## Lookbook

- **Lookbook listing**
  - Implemented `src/components/lookbook/lookbook.content.tsx` to render:
    - Category filters derived from `CATEGORIES`.
    - Look cards (`LOOKS` + `Product` data) with expandable “View All” sections.
    - Integration with `productQueries.all()` to map look product IDs to actual products.
  - Hooked into `routes/lookbook/index.tsx`:
    - Uses TanStack Query + Suspense with `LookbookSkeleton` and `LookbookError`.

- **Lookbook detail**
  - Added `src/routes/lookbook/$id.tsx`:
    - Loader:
      - Parses `id`, finds corresponding `look` from `LOOKS`.
      - Throws `notFound()` if missing.
      - Prefetches all products via `productQueries.all()`.
    - Component:
      - Displays a hero image (from first associated product) with title, description, tag, and materials pills.
      - Renders “Pieces in this look” section with each product’s image, title, price, and a CTA button linking to `/products/$id`.
      - Back link to `/lookbook`.

## Products

- **Products API**
  - `src/lib/api/products.ts`:
    - Provides `productsApi` with `getAll`, `getById`, `create`, `update`, `delete`.
    - Wraps HTTP calls using a shared `redaxios` client and normalizes errors via an interceptor.
    - Uses `productQueries` helpers with TanStack Query to define `all` and `detail` query options.
    - 404 responses mapped to TanStack Router `notFound()` (after error normalization).

- **HTTP client & error handling**
  - Created `src/lib/api/client.ts` (later removed when not needed) then normalized error handling directly in the redaxios client:
    - Response interceptor populates `error.status` from `error.response?.status`.
    - Enables consistent error-based routing and UI flows.

- **Products list page**
  - `src/routes/products/index.tsx`:
    - Loader prefetches `productQueries.all()`.
    - Page:
      - Client-side search over title + description.
      - Derived category chips for filtering.
      - Live result count: “Showing X of Y products”.
      - Grid of `ProductCard` components for each filtered product.
      - Empty state for no matches.
    - Uses `ProductsSkeleton` for loading.
  - `src/components/products/product.card.tsx`:
    - Displays product image, title, price, and category.
    - Added a “View product” CTA button linking to `/products/$id`.
  - `src/components/products/product.skeleton.tsx`:
    - Skeleton UI reused for list/detail loading states.

- **Product detail page**
  - `src/routes/products/$id.tsx`:
    - Loader ensures `productQueries.detail(id)` is prefetched.
    - Uses Suspense + `ProductsSkeleton`.
    - Renders product image, category, title, description, and prominent price.
    - Includes “Add to cart” and “Save for later” buttons as primary CTAs.
    - Back link to `/products`.

## Global UI

- **Header**
  - Extended header (via `src/components/global/Header.tsx`) to include:
    - Navigation links to key sections (e.g., Products, Lookbook, Auth).
    - Session-aware controls (sign in/sign out) wired to the auth client (if configured).

- **Footer**
  - Rebuilt `src/components/global/Footer.tsx` into a minimal, structured footer:
    - Brand section with short description.
    - “Explore” links: Products and Lookbook.
    - “Company” links: About, Contact (placeholder URLs).
    - Bottom bar with © year + Privacy / Terms.

## Miscellaneous

- **Routing & Not Found**
  - `src/router.tsx`:
    - Uses TanStack Router with `defaultErrorComponent` and `defaultNotFoundComponent`.
  - Ensured APIs use `notFound()` where appropriate so 404s flow into route-level 404 UIs.

- **Form validation patterns**
  - Standardized on:
    - Zod for schemas.
    - React Hook Form with `zodResolver`.
    - `mode: "onBlur"` for a balance between UX and validation correctness.
    - Inline error messaging and red borders for invalid fields.
