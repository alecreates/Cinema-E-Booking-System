import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

// edit user info here (profile updates)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, promoSub } = body;

        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Only allow specific fields to update
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                promoSub,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // 🔔 (Later) send email notification here

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    promoSub: updatedUser.promoSub,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}