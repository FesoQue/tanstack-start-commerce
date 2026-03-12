export function otpTemplate({
  heading,
  subheading,
  body,
  otp,
}: {
  heading: string;
  subheading: string;
  body: string;
  otp: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #737373;">
        ${subheading}
      </p>
      <h2 style="font-size: 24px; font-weight: 500; color: #171717; margin: 8px 0;">
        ${heading}
      </h2>
      <p style="font-size: 14px; color: #525252;">${body}</p>
      <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px; text-align: center;">
        <span style="font-size: 32px; font-weight: 600; letter-spacing: 0.25em; color: #171717;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 12px; color: #737373;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}
