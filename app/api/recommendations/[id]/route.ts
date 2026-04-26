// app/api/recommendation/[id]/route.ts

import { NextResponse } from "next/server";
import { getUserRecommendations } from "@/services/RecommendationService";

/**
 * Retrieves personalized recommendations for a user.
 *
 * Reads the user ID from route parameters, calls the
 * service layer, and returns recommended movies.
 *
 * @param req - The incoming HTTP request.
 * @param context - Route context containing params.
 * @returns A JSON response containing recommendations
 * or an error message.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const results =
      await getUserRecommendations(id);

    return NextResponse.json(
      { results },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Recommendation error:",
      error
    );

    const status =
      error.message === "User not found"
        ? 404
        : 500;

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to generate recommendations",
      },
      { status }
    );
  }
}