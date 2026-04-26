// app/api/movies/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAllMovies, createMovie } from "@/services/MovieService";

/**
 * Retrieves all movies.
 *
 * Calls the service layer to fetch all movies
 * and returns them as JSON.
 *
 * @returns A JSON response containing all movies or an error message.
 */
export async function GET() {
  try {
    const movies = await getAllMovies();

    return NextResponse.json({ data: movies }, { status: 200 });
  } catch (error) {
    console.error("GET /api/movies error:", error);

    return NextResponse.json(
      { message: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

/**
 * Creates a new movie.
 *
 * Reads request body data, sends it to the service layer,
 * and returns the created movie as JSON.
 *
 * @param req - The incoming HTTP request containing movie data.
 * @returns A JSON response containing the created movie or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const movie = await createMovie(body);

    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/movies error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to create movie" },
      { status: 400 }
    );
  }
}