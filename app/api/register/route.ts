import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "../../../lib/mongodb";
import User from "../../../types/User";

import crypto from "crypto";



export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, promoSub } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // generate verification token for email identity verification
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            userType: "customer",
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            status: "inactive",
            promoSub: promoSub ?? false,
            verificationToken
        });

        console.log("Saved user in DB:", await User.findOne({ email: email.toLowerCase().trim() }));

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: user._id,
                    userType: user.userType,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    promoSub: user.promoSub,
                    verificationToken
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}