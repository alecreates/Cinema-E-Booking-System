// app/api/reset-password/route.ts

import { NextResponse } from "next/server";
import { resetPassword } from "@/services/AuthService";

/**
 * Resets a user password.
 *
 * Reads reset credentials from the request body,
 * calls the service layer, and updates the user's
 * password if the token is valid.
 *
 * @param req - The incoming HTTP request.
 * @returns A JSON response containing status or error message.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await resetPassword(
      body.token,
      body.password,
      body.confirmPassword
    );

    return NextResponse.json(
      {
        message:
          "Password reset successful. Please log in.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Reset password error:",
      error
    );

    const status =
      error.message ===
        "Token, password, and confirm password are required." ||
        error.message ===
        "Passwords do not match." ||
        error.message ===
        "Password must be at least 6 characters long." ||
        error.message ===
        "Invalid or expired reset token."
        ? 400
        : 500;

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to reset password.",
      },
      { status }
    );
  }
}