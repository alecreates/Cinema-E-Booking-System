import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (user.status !== "active") {
            return NextResponse.json(
                { message: "Account is not active. Please verify your email." },
                { status: 403 }
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
            
        }

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id,
                    userType: user.userType,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    promoSub: user.promoSub,
                    favoriteMovies: user.favoriteMovies,
                    address: user.address
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}