// app/api/interactions/route.ts

import { NextResponse } from "next/server";
import { createMovieInteraction } from "@/services/MovieInteractionService";

/**
 * Creates a movie interaction.
 *
 * Reads request body data, calls the service layer,
 * and stores a movie interaction event.
 *
 * @param req - The incoming HTTP request.
 * @returns A JSON response containing the created interaction
 * or an error message.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const interaction = await createMovieInteraction(body);

    return NextResponse.json({
      success: true,
      interaction,
    });
  } catch (error: any) {
    console.error("Interaction API error:", error);

    const status =
      error.message === "Missing required fields" ||
        error.message === "Invalid action type"
        ? 400
        : error.message === "User not found" ||
          error.message === "Movie not found"
          ? 404
          : 500;

    return NextResponse.json(
      { message: error.message || "Server error" },
      { status }
    );
  }
}