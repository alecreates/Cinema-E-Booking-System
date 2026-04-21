import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Movie from "@/models/Movie";
import { getRecommendations } from "@/lib/geminiRecommender";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // ✅ FIX: await params
    const { id: userId } = await context.params;

    const user = await User.findById(userId);
    const movies = await Movie.find({});

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const aiResults = await getRecommendations(user, movies);

    const recommendedIds = aiResults
      .map((r: any) => r.movie?._id || r.movie?.id)
      .filter(Boolean);

    const results = await Movie.find({
      _id: { $in: [...new Set(recommendedIds)] },
    });

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("Recommendation error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}