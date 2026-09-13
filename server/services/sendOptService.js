import { Resend } from "resend";
import OTP from "../models/otpModel.js";

export const sendOtpServService = async (email) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const otp = Math.floor(100000 + Math.random() * 900000);

  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true },
  );

  const html = `
    <div>
      <h2>Your One Time Password (OTP) is ${otp}</h2>
      <p>The password will expire in 5 minutes if not used.</p>
    </div>
  `;

  await resend.emails.send({
    from: "SynkDive <no-reply@hirepath.store>",
    to: email,
    subject: "SynkDive OTP",
    html,
  });

  return {
    success: true,
    message: "OTP sent successfully",
  };
};
