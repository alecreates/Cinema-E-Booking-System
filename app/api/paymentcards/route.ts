import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { customerId, cardNumber, billingAddress, expirationDate } =
      await req.json();

    if (!customerId || !cardNumber || !billingAddress || !expirationDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 STEP 1: count existing cards
    const cardCount = await PaymentCard.countDocuments({ customerId });

    // step 2: enforce limit
    if (cardCount >= 3) {
      return NextResponse.json(
        { error: "Maximum of 3 payment cards allowed" },
        { status: 403 }
      );
    }

    // ✅ STEP 3: create card
    const newCard = await PaymentCard.create({
      customerId,
      cardNumber,
      billingAddress,
      expirationDate,
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create payment card" },
      { status: 500 }
    );
  }
}