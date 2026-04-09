import Recommendation from "@/models/Recommendations";
import UserPreference from "@/models/UserPreference";
import Movie from "@/models/Movie";

export async function GET(req: Request) {
  const { userId } = Object.fromEntries(new URL(req.url).searchParams);

  const prefs = await UserPreference.findOne({ userId });

  if (!prefs) return [];

  const topGenres = Object.entries(prefs.genreScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  const movies = await Movie.find({
    genre: { $in: topGenres },
  }).limit(10);

  return Response.json(movies);
}