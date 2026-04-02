import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import Movie from "../../../models/Movie";

export async function GET() {
  try {
    await dbConnect();

    const movies = await Movie.find().sort({ createdAt: -1 }).lean();

    // Convert _id to string for frontend
    const moviesWithId = movies.map(m => ({ ...m, id: m._id.toString() }));

    return NextResponse.json({ data: moviesWithId }, { status: 200 });
  } catch (error) {
    console.error("GET /api/movies error:", error);
    return NextResponse.json(
      { message: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

// add a movie to the DB
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const newMovie = await Movie.create(body);

    // Convert _id to string for frontend
    const movieWithId = { ...newMovie.toObject(), id: newMovie._id.toString() };

    return NextResponse.json(movieWithId, { status: 201 });
  } catch (error) {
    console.error("POST /api/movies error:", error);
    return NextResponse.json(
      { message: "Failed to create movie" },
      { status: 500 }
    );
  }
}