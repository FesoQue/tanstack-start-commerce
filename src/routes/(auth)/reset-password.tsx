import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { resetPassword } from "#/lib/auth-client";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const verifySearchSchema = z.object({
  token: z.string(),
});

export const Route = createFileRoute("/(auth)/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search) => verifySearchSchema.parse(search),
});

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = Route.useSearch();

  const { token } = searchParams;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const { error } = await resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      toast.error(error.message || "unable to reset password");
      return;
    }

    toast.success("Your password has been reset.");
    router.navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Reset password
          </h1>
          <p className="text-xs text-gray-500">
            Choose a new password for your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
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

          <div className="space-y-1.5 text-left">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              }`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-black px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
