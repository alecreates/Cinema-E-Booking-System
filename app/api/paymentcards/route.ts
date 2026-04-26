// app/api/paymentcards/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  createPaymentCard,
  getPaymentCardsByUserId,
} from "@/services/PaymentCardService";

/**
 * Creates a payment card.
 *
 * Reads request body data, calls the service layer,
 * and stores a new payment card.
 *
 * @param req - The incoming HTTP request.
 * @returns A JSON response containing the created card
 * or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const card = await createPaymentCard(body);

    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    const status =
      error.message === "Missing required fields"
        ? 400
        : error.message ===
          "Maximum of 3 payment cards allowed"
          ? 403
          : 500;

    return NextResponse.json(
      { error: error.message || "Failed to create payment card" },
      { status }
    );
  }
}

/**
 * Retrieves payment cards for a user.
 *
 * Reads the userId query parameter, calls the service layer,
 * and returns stored cards with masked numbers.
 *
 * @param req - The incoming HTTP request.
 * @returns A JSON response containing cards or an error message.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId") || "";

    const cards = await getPaymentCardsByUserId(userId);

    return NextResponse.json(cards, { status: 200 });
  } catch (error: any) {
    const status =
      error.message === "Missing userId"
        ? 400
        : 500;

    return NextResponse.json(
      { error: error.message || "Failed to fetch payment cards" },
      { status }
    );
  }
}