import Movie from "@/models/Movie";

export async function getCandidateMovies(movie: any) {
  return await Movie.find({
    _id: { $ne: movie._id },
    genre: { $in: movie.genre }
  }).limit(20);
}