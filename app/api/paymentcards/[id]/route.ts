import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";

import { encrypt } from "@/lib/encryption";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    const { params } = context;
    const { id } = await params;

    const exists = await PaymentCard.findById(id);

    const deleted = await PaymentCard.findByIdAndDelete(id);

    if (!deleted) {
        return NextResponse.json(
            { error: "Payment card not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { message: "Payment card deleted successfully" },
        { status: 200 }
    );
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;
        const body = await req.json();

        // 🔥 IMPORTANT: re-encrypt if cardNumber is being updated
        if (body.cardNumber) {
            body.cardNumber = encrypt(body.cardNumber);
        }

        const updated = await PaymentCard.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Card not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to update card" },
            { status: 500 }
        );
    }
}