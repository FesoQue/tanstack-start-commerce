import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "#/lib/auth-client";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginFormValues) => {
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message ?? "Invalid credentials");
      return;
    }

    // router.navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Log in</h1>
          <p className="text-xs text-gray-500">
            Enter your email and password to access your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
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
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
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
              placeholder="••••••••"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900 ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-black px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
