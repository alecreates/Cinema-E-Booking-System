import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Promotion from "@/models/Promotion";

export async function GET() {
  try {
    await dbConnect();

    const promos = await Promotion.find();

    return NextResponse.json(promos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    if (!body.promoCode || !body.discount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPromo = await Promotion.create({
      promoCode: body.promoCode,
      discount: body.discount,
    });

    return NextResponse.json(newPromo, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create promotion" },
      { status: 500 }
    );
  }
}