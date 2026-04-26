// services/UserService.ts

import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

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