import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await dbConnect();

    const movie = await Movie.findOne({ id }).lean();

    if (!movie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("GET /api/movies/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}