import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailOtp } from "#/lib/auth-client";
import toast from "react-hot-toast";

const otpSchema = z.object({
  code: z
    .string()
    .min(6, "Enter the 6-digit code")
    .max(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const verifySearchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/(auth)/verify")({
  component: OtpVerifyPage,
  validateSearch: (search) => verifySearchSchema.parse(search),
});

function OtpVerifyPage() {
  const router = useRouter();
  const searchParams = Route.useSearch();

  const { email } = searchParams;

  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [cooldown]);

  const onSubmit = async (values: OtpFormValues) => {
    if (!email) return;

    const { error } = await emailOtp.verifyEmail({
      email,
      otp: values.code,
    });

    if (error) {
      toast.error(error.message || "unable to verify OTP");
      return;
    }

    toast.success("Your account has been successfully been verified!");
    router.navigate({ to: "/" });
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    if (!email) return;

    const { error } = await emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (error) {
      toast.error(error.message || "Unable to resend code");
      return;
    }

    toast.success("A new verification code has been sent");
    setCooldown(30);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="text-xs text-gray-500">
            Enter the 6-digit code we sent to your email address.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="code"
              className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500"
            >
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              className={`w-full rounded-lg border px-3 py-2 text-sm tracking-[0.4em] text-center outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900 ${
                errors.code ? "border-red-500" : "border-gray-200"
              }`}
              {...register("code")}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-black px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>

          <div className="pt-2 text-center text-[11px] text-gray-500">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="font-medium text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cooldown > 0
                ? `Resend code in ${cooldown}s`
                : "Resend verification code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
