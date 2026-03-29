import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";

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

export async function PUT(req: NextRequest, { params }: any) {
    try {
        await dbConnect();

        const body = await req.json();

        const updated = await PaymentCard.findByIdAndUpdate(
            params.id,
            body,
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Card not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to update card" },
            { status: 500 }
        );
    }
}