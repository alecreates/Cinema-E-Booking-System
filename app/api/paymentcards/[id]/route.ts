import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    const { params } = context;
    const { id } = await params; // ✅ THIS IS THE FIX

    console.log("ID from URL:", id);

    const exists = await PaymentCard.findById(id);
    console.log("Exists before delete:", exists);

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