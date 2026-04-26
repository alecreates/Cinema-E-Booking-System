// app/api/movies/[id]/route.ts

import { NextResponse } from "next/server";
import { getMovieById } from "@/services/MovieService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * Retrieves a specific movie by ID.
 *
 * Reads the movie ID from route parameters, calls the
 * service layer, and returns the movie as JSON.
 *
 * @param _req - The incoming HTTP request.
 * @param context - The route context containing params.
 * @returns A JSON response containing the movie or an error message.
 */
export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const movie = await getMovieById(id);

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