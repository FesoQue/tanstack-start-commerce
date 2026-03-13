import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "#/lib/db";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { emailOTP } from "better-auth/plugins";
import { otpTemplate } from "./email-templates";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

console.log("Resend key loaded:", !!process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link below to reset your password. If you did not request this, you can safely ignore this email.</p>
               <p><a href="${url}">Reset password</a></p>`,
      });
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 3600,
      allowedAttempts: 3,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          console.log("Sending OTP to:", email, "OTP:", otp);

          await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email",
            html: otpTemplate({
              subheading: "Email verification",
              heading: "Verify your email",
              body: "Use the code below to verify your email address. Expires in 1 hr.",
              otp,
            }),
          });
        }
      },
      sendVerificationOnSignUp: true,
    }),
    tanstackStartCookies(),
  ],
});
