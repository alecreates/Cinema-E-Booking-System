// services/AuthService.ts

import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

/**
 * Authenticates a user login request.
 *
 * Validates credentials, checks account status,
 * compares password hashes, and returns safe user data.
 *
 * @param email - The submitted email address.
 * @param password - The submitted password.
 * @returns A promise that resolves to authenticated user data.
 * @throws Error if credentials are invalid or account is inactive.
 */
export async function loginUser(
    email: string,
    password: string
) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    await dbConnect();

    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (user.status !== "active") {
        throw new Error(
            "Account is not active. Please verify your email."
        );
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    return {
        id: user._id,
        userType: user.userType,
        name: user.name,
        email: user.email,
        status: user.status,
        promoSub: user.promoSub,
        favoriteMovies: user.favoriteMovies,
        address: user.address,
    };
}