import { NextRequest, NextResponse } from "next/server";
import Promotion from "@/models/Promotion";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    console.log()

    if (!id) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    const code = id.toUpperCase();

    // ✅ FIX: match your DB field (promoCode, NOT code)
    const promo = await Promotion.findOne({
      promoCode: code,
    });

    if (!promo) {
      return NextResponse.json(
        { error: `Promotion '${code}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        promoCode: promo.promoCode,
        type: promo.type,
        value: promo.value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Promotion fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch promotion" },
      { status: 500 }
    );
  }
}