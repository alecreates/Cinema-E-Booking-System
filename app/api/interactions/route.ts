import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import MovieInteraction from "@/models/MovieInteractions";
import User from "@/models/User";
import Movie from "@/models/Movie";

export async function POST(req: Request) {
  try {
    const { userId, movieId, action } = await req.json();

    await dbConnect();

    if (!userId || !movieId || !action) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedActions = ["view", "purchase"];

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { message: "Invalid action type" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      );
    }

    const interaction = await MovieInteraction.create({
      userId,
      movieId,
      action,
      metadata: {
        timestamp: new Date(),
        genres: movie.genre,
      },
    });

    return NextResponse.json({
      success: true,
      interaction,
    });

  } catch (err) {
    console.error("Interaction API error:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}