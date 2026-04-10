import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Promotion from "@/models/Promotion";

export async function GET() {
  try {
    await dbConnect();

    const promos = await Promotion.find();

    return NextResponse.json({
      success: true,
      data: promos,
    });
  } catch (error) {
    console.error("GET promotions error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    if (!body.promoCode || body.discount == null) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPromo = await Promotion.create({
      promoCode: body.promoCode,
      discount: body.discount,
    });

    return NextResponse.json({
      success: true,
      data: newPromo,
    }, { status: 201 });

  } catch (error) {
    console.error("POST promotions error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create promotion" },
      { status: 500 }
    );
  }
}