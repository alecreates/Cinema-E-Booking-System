import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";
import { ObjectId } from "mongodb";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await dbConnect();

    // Find movie by MongoDB ObjectId
    const movie = await Movie.findOne({ _id: new ObjectId(id) }).lean();

    if (!movie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      );
    }

    // Convert _id to string for frontend
    const movieWithId = { ...movie, id: movie._id.toString() };

    return NextResponse.json(movieWithId, { status: 200 });
  } catch (error) {
    console.error("GET /api/movies/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}