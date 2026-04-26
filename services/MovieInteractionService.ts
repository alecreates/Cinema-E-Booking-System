// services/MovieInteractionService.ts

import { dbConnect } from "@/lib/mongodb";
import MovieInteraction from "@/models/MovieInteractions";
import User from "@/models/User";
import Movie from "@/models/Movie";

/**
 * Creates a movie interaction record.
 *
 * Validates request data, ensures the user and movie exist,
 * and stores the interaction with metadata.
 *
 * @param data - The interaction data.
 * @param data.userId - The user identifier.
 * @param data.movieId - The movie identifier.
 * @param data.action - The interaction type.
 * @returns A promise that resolves to the created interaction.
 * @throws Error if fields are missing or invalid.
 */
export async function createMovieInteraction(data: {
    userId: string;
    movieId: string;
    action: string;
}) {
    await dbConnect();

    const { userId, movieId, action } = data;

    if (!userId || !movieId || !action) {
        throw new Error("Missing required fields");
    }

    const allowedActions = ["view", "purchase"];

    if (!allowedActions.includes(action)) {
        throw new Error("Invalid action type");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new Error("Movie not found");
    }

    return await MovieInteraction.create({
        userId,
        movieId,
        action,
        metadata: {
            timestamp: new Date(),
            genres: movie.genre,
        },
    });
}