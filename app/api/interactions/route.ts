import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import MovieInteraction from "@/models/MovieInteractions";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const interaction = await MovieInteraction.create(body);

    return NextResponse.json(interaction);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}