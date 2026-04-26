// services/MovieService.ts

import { dbConnect } from "@/lib/mongodb";
import Movie from "@/models/Movie";

/**
 * Retrieves all movies from the database.
 *
 * Results are sorted by most recently created first
 * and each movie includes a frontend-friendly id field.
 *
 * @returns A promise that resolves to an array of movies.
 */
export async function getAllMovies() {
  await dbConnect();

  const movies = await Movie.find()
    .sort({ createdAt: -1 })
    .lean();

  return movies.map((movie: any) => ({
    ...movie,
    id: movie._id.toString(),
  }));
}

/**
 * Retrieves a movie by its MongoDB identifier.
 *
 * Adds a frontend-friendly id field if found.
 *
 * @param id - The movie identifier.
 * @returns A promise that resolves to the movie or null.
 */
export async function getMovieById(id: string) {
  await dbConnect();

  const movie = await Movie.findById(id).lean();

  if (!movie) return null;

  return {
    ...movie,
    id: movie._id.toString(),
  };
}

/**
 * Creates a new movie record.
 *
 * Validates required fields and inserts the movie
 * into the database.
 *
 * @param data - The movie creation data.
 * @returns A promise that resolves to the created movie.
 * @throws Error if the title is missing.
 */
export async function createMovie(data: any) {
  await dbConnect();

  if (!data.title) {
    throw new Error("Title is required");
  }

  const newMovie = await Movie.create(data);

  return {
    ...newMovie.toObject(),
    id: newMovie._id.toString(),
  };
}