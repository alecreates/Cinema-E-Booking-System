// app/api/register/route.ts

import { NextResponse } from "next/server";
import { registerUser } from "@/services/AuthService";

/**
 * Registers a new user.
 *
 * Reads registration data from the request body,
 * calls the service layer, and returns the created
 * user account information.
 *
 * @param req - The incoming HTTP request.
 * @returns A JSON response containing registration
 * status or an error message.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const user = await registerUser(body);

        return NextResponse.json(
            {
                message: "User registered successfully",
                user,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Register error:", error);

        const status =
            error.message ===
                "Name, email, and password are required" ||
                error.message ===
                "Password must be at least 6 characters long"
                ? 400
                : error.message ===
                    "Email already in use"
                    ? 409
                    : 500;

        return NextResponse.json(
            {
                message:
                    error.message ||
                    "Internal server error",
            },
            { status }
        );
    }
}