import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import Movie from "../../../models/Movie";

export async function GET() {
  try {
    await dbConnect();

    const movies = await Movie.find().sort({ id: 1 }).lean();

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("GET /api/movies error:", error);
    return NextResponse.json(
      { message: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}