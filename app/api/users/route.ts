import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, promoSub, currentPassword, newPassword, address } = body;

        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // ----------------------------
        // PASSWORD CHANGE LOGIC
        // ----------------------------
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { message: "Current password required" },
                    { status: 400 }
                );
            }

            // compare with passwordHash (NOT password)
            const isMatch = await bcrypt.compare(
                currentPassword,
                user.passwordHash
            );

            if (!isMatch) {
                return NextResponse.json(
                    { message: "Current password is incorrect" },
                    { status: 401 }
                );
            }

            // hash new password
            const hashed = await bcrypt.hash(newPassword, 10);

            user.passwordHash = hashed;
        }

        // ----------------------------
        // PROFILE UPDATES
        // ----------------------------
        if (name) user.name = name;
        if (promoSub !== undefined) user.promoSub = promoSub;
        if (address !== undefined) user.address = address;

        await user.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                promoSub: user.promoSub,
                address: user.address
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}