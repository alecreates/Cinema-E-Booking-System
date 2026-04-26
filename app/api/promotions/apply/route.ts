import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Promotion from "@/models/Promotion";
import { applyPromotions } from "@/lib/pricing/applyPromotions";

export async function POST(req: Request) {
  await dbConnect();

  const { code, subtotal } = await req.json();

  const promo = await Promotion.findOne({ code });

  if (!promo) {
    return NextResponse.json({ message: "Invalid promo code" }, { status: 400 });
  }

  const total = applyPromotions(subtotal, [promo]);

  return NextResponse.json({ total });
}