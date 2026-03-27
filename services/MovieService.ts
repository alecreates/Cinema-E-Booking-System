import { dbConnect } from "../lib/mongodb";
import Movie from "../models/Movie";

export async function getAllMovies() {
  await dbConnect();
  return await Movie.find().sort({ id: 1 }).lean();
}

export async function getMovieById(id: string) {
  await dbConnect();
  return await Movie.findOne({ id }).lean();
}