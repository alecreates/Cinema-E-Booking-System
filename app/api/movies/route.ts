import { NextRequest, NextResponse } from "next/server";
import * as MovieService from "@/services/MovieService";

/**
 * GET /api/movies
 * Fetch all movies
 */
export async function GET(req: NextRequest) {

    const movies = await MovieService.getAllMovies();

    return NextResponse.json({
      success: true,
      message: "Movies endpoint is live",
      data: movies,
    });
  }

/**
 * POST /api/movies
 * Create a movie
 */
export async function POST(req: NextRequest) {
    const body = await req.json();

    const newMovie = await MovieService.createMovie(body);
  
    return NextResponse.json({
      success: true,
      message: "Create movie endpoint is live",
      data: newMovie,
    });
  }



