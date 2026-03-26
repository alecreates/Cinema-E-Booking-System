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

        const user = await User.findOne({ verificationToken: token });
        console.log(token)

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        user.status = "active";
        user.verificationToken = null;
        await user.save();

        return NextResponse.redirect(new URL("/verified", req.url));

    } catch (err) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}