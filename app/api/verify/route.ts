// app/api/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/services/UserService";

/**
 * Verifies a user account.
 *
 * Reads the token from query parameters, calls the
 * service layer to activate the user account, and
 * redirects to the verified page on success.
 *
 * @param req - The incoming HTTP request.
 * @returns A redirect response or JSON error response.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        const user = await verifyUser(token || "");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.redirect(new URL("/Verified", req.url));
    } catch (error: any) {
        console.error("Verify error:", error);

        return NextResponse.json(
            { message: error.message || "Server error" },
            { status: 400 }
        );
    }
}