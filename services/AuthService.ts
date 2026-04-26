// services/AuthService.ts

import bcrypt from "bcrypt";
import crypto from "crypto";
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

/**
 * Registers a new user account.
 *
 * Validates input, checks for duplicate email addresses,
 * hashes the password, generates an email verification token,
 * and creates a new inactive customer account.
 *
 * @param data - Registration data.
 * @param data.name - The user's name.
 * @param data.email - The user's email address.
 * @param data.password - The user's password.
 * @param data.promoSub - Promotional email preference.
 * @param data.address - The user's address.
 * @returns A promise that resolves to the created user response data.
 * @throws Error if validation fails or email already exists.
 */
export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
    promoSub?: boolean;
    address?: string;
}) {
    const {
        name,
        email,
        password,
        promoSub,
        address,
    } = data;

    if (!name || !email || !password) {
        throw new Error(
            "Name, email, and password are required"
        );
    }

    if (password.length < 6) {
        throw new Error(
            "Password must be at least 6 characters long"
        );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(
        password,
        10
    );

    const verificationToken = crypto
        .randomBytes(32)
        .toString("hex");

    const user = await User.create({
        userType: "customer",
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        status: "inactive",
        promoSub: promoSub ?? false,
        verificationToken,
        address: address?.trim() || "",
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
    });

    return {
        id: user._id,
        userType: user.userType,
        name: user.name,
        email: user.email,
        status: user.status,
        promoSub: user.promoSub,
        verificationToken,
        address: user.address,
    };
}