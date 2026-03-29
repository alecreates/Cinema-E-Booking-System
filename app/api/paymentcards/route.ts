import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";

import { encrypt, decrypt } from "@/lib/encryption";

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

    const cardCount = await PaymentCard.countDocuments({ customerId });

    if (cardCount >= 3) {
      return NextResponse.json(
        { error: "Maximum of 3 payment cards allowed" },
        { status: 403 }
      );
    }

    // 🔒 ENCRYPT CARD NUMBER
    const encryptedCardNumber = encrypt(cardNumber);

    const newCard = await PaymentCard.create({
      customerId,
      cardNumber: encryptedCardNumber,
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const cards = await PaymentCard.find({ customerId: userId });

    const safeCards = cards.map((card) => {
      const decrypted = decrypt(card.cardNumber);

      return {
        ...card.toObject(),

        // FULL value (for editing)
        cardNumber: decrypted,

        // MASKED value (for display only)
        cardNumberMasked: `**** **** **** ${decrypted.slice(-4)}`,
      };
    });

    return NextResponse.json(safeCards, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch payment cards" },
      { status: 500 }
    );
  }
}