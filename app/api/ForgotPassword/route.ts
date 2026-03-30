import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { dbConnect } from "../../../lib/mongodb";
import User from "../../../models/User";

async function sendResetEmail(email: string, resetUrl: string) {
  const service_id = process.env.EMAILJS_SERVICE_ID;
  const template_id = process.env.EMAILJS_TEMPLATE_ID;
  const user_id = process.env.EMAILJS_PUBLIC_KEY;

  if (!service_id || !template_id || !user_id) {
    throw new Error("missing env importes");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id,
      template_id,
      user_id,
      template_params: {
        to_email: email,
        reset_link: resetUrl,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EmailJS send failed: ${text}`);
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const genericResponse = NextResponse.json(
      { message: "If an account exists for that email, a reset link has been sent." },
      { status: 200 }
    );

    if (!email) {
      return genericResponse;
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/ResetPassword?token=${rawToken}`;

    await sendResetEmail(user.email, resetUrl);

    return genericResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to process forgot password request." },
      { status: 500 }
    );
  }
}