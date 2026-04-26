// services/UserService.ts

import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "node:crypto";

/**
 * Verifies a user account using a verification token.
 *
 * Finds a user matching the provided token, activates
 * the account, and clears the stored token.
 *
 * @param token - The email verification token.
 * @returns A promise that resolves to the updated user or null.
 * @throws Error if no token is provided.
 */
export async function verifyUser(token: string) {
    await dbConnect();

    if (!token) {
        throw new Error("Invalid token");
    }

    return await User.findOneAndUpdate(
        { verificationToken: token },
        { status: "active", verificationToken: null },
        { new: true }
    );
}

/**
 * Sends a password reset email containing a reset link.
 *
 * Uses EmailJS to deliver the password reset message.
 *
 * @param email - The recipient email address.
 * @param resetUrl - The password reset URL.
 * @returns A promise that resolves when the email is sent.
 * @throws Error if email configuration is missing or sending fails.
 */
async function sendResetEmail(email: string, resetUrl: string) {
    const service_id = process.env.EMAILJS_SERVICE_ID;
    const template_id = process.env.EMAILJS_TEMPLATE_ID;
    const user_id = process.env.EMAILJS_PUBLIC_KEY;

    if (!service_id || !template_id || !user_id) {
        throw new Error("Missing email configuration");
    }

    const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
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
        }
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Email send failed: ${text}`);
    }
}

/**
 * Processes a forgot password request.
 *
 * If a matching account exists, generates a secure reset token,
 * stores its hash and expiration time, and emails a reset link.
 *
 * Always returns a generic success response for security.
 *
 * @param email - The submitted email address.
 * @returns A promise that resolves when processing is complete.
 */
export async function forgotPassword(email: string) {
    if (!email) return;

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpiresAt = new Date(
        Date.now() + 1000 * 60 * 30
    );

    await user.save();

    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

    const resetUrl = `${appUrl}/ResetPassword?token=${rawToken}`;

    await sendResetEmail(user.email, resetUrl);
}