import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { requestPasswordReset } from "#/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const { error } = await requestPasswordReset({
      email: values.email,
      redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
    });

    if (error) {
      toast.error(error.message ?? "Error sending password reset email");
      return;
    }

    toast.success(
      "If an account exists for this email, a reset link will be sent."
    );
    router.navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Forgot password
          </h1>
          <p className="text-xs text-gray-500">
            Enter your email and we&apos;ll send you a link to reset your
            password.
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-black px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending link..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
