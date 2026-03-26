import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/types/User";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { verificationToken: token },
            { status: "active", verificationToken: null },
            { new: true } // return the updated document
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.redirect(new URL("/Verified", req.url));
    } catch (err) {
        console.error("Verify error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}