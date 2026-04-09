import UserPreference from "@/models/UserPreference";
import Movie from "@/models/Movie";

export async function updateUserPreferences(userId: string, movieId: string) {
  const movie = await Movie.findById(movieId);

  if (!movie) return;

  let prefs = await UserPreference.findOne({ userId });

  if (!prefs) {
    prefs = await UserPreference.create({
      userId,
      favoriteGenres: [],
      genreScores: {},
    });
  }

  movie.genre.forEach((g: string) => {
    prefs.genreScores[g] = (prefs.genreScores[g] || 0) + 1;
  });

  await prefs.save();
}