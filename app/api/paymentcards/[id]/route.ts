// app/api/paymentcards/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
    deletePaymentCard,
    updatePaymentCard,
} from "@/services/PaymentCardService";

/**
 * Deletes a payment card.
 *
 * Reads the card ID from route parameters, calls the
 * service layer, and removes the payment card.
 *
 * @param req - The incoming HTTP request.
 * @param context - Route context containing params.
 * @returns A JSON response indicating success or failure.
 */
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const deleted = await deletePaymentCard(id);

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
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete payment card" },
            { status: 500 }
        );
    }
}

/**
 * Updates a payment card.
 *
 * Reads the card ID and request body, calls the service
 * layer, and returns the updated payment card.
 *
 * @param req - The incoming HTTP request.
 * @param context - Route context containing params.
 * @returns A JSON response containing the updated card
 * or an error message.
 */
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const body = await req.json();

        const updated = await updatePaymentCard(id, body);

        if (!updated) {
            return NextResponse.json(
                { error: "Card not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update card" },
            { status: 500 }
        );
    }
}