import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Log in</h1>
          <p className="text-xs text-gray-500">
            Enter your email and password to access your account.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-black px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-gray-900"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
