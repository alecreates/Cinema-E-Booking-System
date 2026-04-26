// app/api/forgot-password/route.ts

import { NextResponse } from "next/server";
import { forgotPassword } from "@/services/UserService";

/**
 * Handles forgot password requests.
 *
 * Reads the submitted email address, calls the service
 * layer to process the request, and always returns a
 * generic success response for security purposes.
 *
 * @param req - The incoming HTTP request.
 * @returns A JSON response indicating the request was processed.
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await forgotPassword(email);

    return NextResponse.json(
      {
        message:
          "If an account exists for that email, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        message:
          "Failed to process forgot password request.",
      },
      { status: 500 }
    );
  }
}