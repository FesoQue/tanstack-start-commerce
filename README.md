# TS Commerce

A minimalistic, full-stack e-commerce storefront built with TanStack Start, featuring authentication, a product catalogue, cart, wishlist, and checkout.

---

## Getting Started

```bash
npm install
npm run dev        # starts dev server on http://localhost:3000
```

```bash
npm run build      # production build
npm run preview    # preview production build locally
npm run test       # run tests with Vitest
```

---

## Environment Variables

Create a `.env` file in the project root. **Never commit real secrets.**

```env
# ── App ───────────────────────────────────────────────────────────────────────
# Public base URL used for server-side HTTP requests and Better Auth
VITE_APP_URL=http://localhost:3000
VITE_APP_NAME=TS Commerce

# ── MongoDB ───────────────────────────────────────────────────────────────────
# Connection string for your MongoDB cluster
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# ── Better Auth ───────────────────────────────────────────────────────────────
# Long, random secret used to sign session tokens — keep this private
BETTER_AUTH_SECRET=replace_with_a_long_random_string

# Public base URL that Better Auth uses for callbacks and redirects
BETTER_AUTH_URL=http://localhost:3000

# ── Resend (transactional email) ──────────────────────────────────────────────
# API key from https://resend.com — used for OTP and password reset emails
RESEND_API_KEY=re_replace_with_your_resend_api_key
```

---

## Features

### Storefront

- **Home page** — hero section, featured products grid, category filter pills, full product listing
- **Product listing** (`/products`) — client-side search by title and category filter
- **Product detail** (`/products/:id`) — image, description, price, add to cart, save to wishlist toggle with filled/outline heart state
- **Lookbook** (`/lookbook`) — editorial grid of curated looks
- **Lookbook detail** (`/lookbook/:id`) — hero section with products featured in the look

### Cart

- **Cart page** (`/cart`) — item list, quantity controls (increment / decrement), per-item remove, clear cart, subtotal
- Cart count badge on the nav icon updates in real time
- Cart state persisted to MongoDB per user session
- Guest-state handled gracefully (empty cart shown, sign-in prompt)

### Wishlist

- **Wishlist page** (`/wishlist`) — saved items list, move-to-cart per item, remove, clear all
- Wishlist count badge on the nav heart icon
- Toggle button on product detail page (outline → filled on save)
- Auth guard: unauthenticated users see a toast prompt instead of a silent failure

### Checkout

- **Checkout page** (`/checkout`) — contact, shipping address, and payment form
- Validates all fields with Zod before submission
- Auto-formats card number (`1234 5678 ...`) and expiry (`MM/YY`) on input
- Order summary panel with live item list, subtotal, shipping (free over $100), tax, and total
- Redirects guests to `/login?redirect=/checkout` and returns them after sign-in
- Redirects to `/cart` if the cart is empty

### Authentication (Better Auth)

- **Sign up** (`/signup`) — name, email, password with Zod + React Hook Form validation; triggers OTP email on registration
- **Log in** (`/login`) — email/password; invalidates cart & wishlist cache on success; respects `?redirect=` param
- **OTP verification** (`/verify`) — 6-digit code entry, resend with 60-second cooldown
- **Forgot password** (`/forgot-password`) — sends reset link via email
- **Reset password** (`/reset-password`) — token from URL, new password + confirmation
- Authenticated layout guard redirects logged-in users away from auth pages
- Logout wipes cart and wishlist caches immediately

### Navigation

- Sticky header with responsive hamburger menu on mobile
- Session-aware user profile dropdown (name initial, email, log out)
- Heart (wishlist) and cart icons with live count badges on both desktop and mobile
- Active link highlighting

---

## Tech Stack

### Framework & Routing

| Package                  | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `@tanstack/react-start`  | Full-stack React framework (SSR, server functions, API routes) |
| `@tanstack/react-router` | File-based type-safe routing, loaders, `beforeLoad` guards     |
| `vinxi`                  | Underlying build/dev server used by TanStack Start             |

### Data Fetching & State

| Package                 | Purpose                                                         |
| ----------------------- | --------------------------------------------------------------- |
| `@tanstack/react-query` | Server-state management, caching, mutations                     |
| `redaxios`              | Lightweight Axios-compatible HTTP client for external API calls |

### Authentication

| Package       | Purpose                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| `better-auth` | Authentication library — email/password, OTP, password reset, session management |
| `resend`      | Transactional email (OTP codes, password reset links)                            |

### Database

| Package   | Purpose                                                                        |
| --------- | ------------------------------------------------------------------------------ |
| `mongodb` | Official MongoDB Node.js driver — stores users, sessions, carts, and wishlists |

### Forms & Validation

| Package               | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `react-hook-form`     | Performant form state management          |
| `@hookform/resolvers` | Connects Zod schemas to React Hook Form   |
| `zod`                 | Schema declaration and runtime validation |

### UI

| Package           | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| `tailwindcss`     | Utility-first CSS framework                            |
| `lucide-react`    | Icon library (Heart, ShoppingCart, Trash2, Lock, etc.) |
| `react-hot-toast` | Toast notifications for success / error feedback       |

### Testing & Dev

| Package                    | Purpose                                 |
| -------------------------- | --------------------------------------- |
| `vitest`                   | Unit test runner                        |
| `@testing-library/react`   | React component testing utilities       |
| `@tanstack/react-devtools` | TanStack Query + Router dev tools panel |

---

## Project Structure

```
src/
├── components/
│   ├── global/
│   │   ├── Header.tsx          # Sticky nav, cart & wishlist badges, user dropdown
│   │   └── Footer.tsx          # Site footer with links
│   └── products/
│       ├── product.card.tsx    # Reusable product card
│       └── product.skeleton.tsx
├── lib/
│   ├── api/
│   │   ├── axios-client.ts     # Redaxios clients (external + internal)
│   │   ├── cart.ts             # Cart React Query hooks
│   │   ├── products.ts         # Products React Query hooks
│   │   └── wishlist.ts         # Wishlist React Query hooks
│   ├── server/
│   │   ├── cart.ts             # Cart server functions (getCartFn)
│   │   ├── session.ts          # Session server function (getSessionFn)
│   │   └── wishlist.ts         # Wishlist server functions
│   ├── auth.ts                 # Better Auth server configuration
│   ├── auth-client.ts          # Better Auth client (useSession, signIn, etc.)
│   └── db.ts                   # MongoDB client (singleton, production-ready)
└── routes/
    ├── __root.tsx              # Root layout (Header, Footer, Toaster)
    ├── index.tsx               # Home page
    ├── cart.tsx                # Cart page
    ├── checkout.tsx            # Checkout page
    ├── wishlist.tsx            # Wishlist page
    ├── (auth)/
    │   ├── route.tsx           # Auth layout guard
    │   ├── login.tsx
    │   ├── signup.tsx
    │   ├── verify.tsx
    │   ├── forgot-password.tsx
    │   └── reset-password.tsx
    ├── products/
    │   ├── index.tsx           # Product listing
    │   └── $id.tsx             # Product detail
    ├── lookbook/
    │   ├── index.tsx           # Lookbook grid
    │   └── $id.tsx             # Lookbook detail
    └── api/
        ├── cart.ts             # REST API route for cart mutations
        └── auth/$.ts           # Better Auth catch-all handler
```

---

## Data Architecture

- **Products** — fetched from [Fake Store API](https://fakestoreapi.com) (external)
- **Carts** — stored in MongoDB `carts` collection, keyed by `userId`
- **Wishlists** — stored in MongoDB `wishlists` collection, keyed by `userId`
- **Users & Sessions** — managed by Better Auth, stored in MongoDB via `mongodbAdapter`

Server functions (`createServerFn`) are used for all reads that run inside route loaders. They use `getRequest()` to access real session cookies, avoiding the cookie-forwarding problem that occurs with plain HTTP calls in SSR loaders.

---

## Learn More

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Better Auth](https://better-auth.com)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Resend](https://resend.com/docs)
