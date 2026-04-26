// services/RecommendationService.ts

import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Movie from "@/models/Movie";
import { getRecommendations } from "@/lib/geminiRecommender";

/**
 * Generates personalized movie recommendations for a user.
 *
 * Retrieves the user and all movies, sends the data to the
 * recommendation engine, and returns matching movie records.
 *
 * @param userId - The user identifier.
 * @returns A promise that resolves to recommended movies.
 * @throws Error if the user cannot be found.
 */
export async function getUserRecommendations(
    userId: string
) {
    await dbConnect();

    const user = await User.findById(userId);
    const movies = await Movie.find({});

    if (!user) {
        throw new Error("User not found");
    }

    const aiResults = await getRecommendations(
        user,
        movies
    );

    const recommendedIds = aiResults
        .map((item: any) => item.movie?._id || item.movie?.id)
        .filter(Boolean);

    return await Movie.find({
        _id: { $in: [...new Set(recommendedIds)] },
    });
}