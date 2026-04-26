// app/api/login/route.ts

import { NextResponse } from "next/server";
import { loginUser } from "@/services/AuthService";

/**
 * Logs a user into the system.
 *
 * Reads login credentials from the request body,
 * calls the service layer for authentication,
 * and returns user data on success.
 *
 * @param req - The incoming HTTP request.
 * @returns A JSON response containing login status or error message.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const user = await loginUser(
            body.email,
            body.password
        );

        return NextResponse.json(
            {
                message: "Login successful",
                user,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Login error:", error);

        const status =
            error.message === "Email and password are required"
                ? 400
                : error.message ===
                    "Account is not active. Please verify your email."
                    ? 403
                    : error.message === "Invalid email or password"
                        ? 401
                        : 500;

        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status }
        );
    }
}