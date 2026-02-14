"use client";
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import MovieHeader from "../MovieHeader/MovieHeader";
import { mockMovie } from "../mock/movieMock";

const MovieDetails = () => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    // fetch actual movies here when API is working
  }, []);

  return (
    <>
      <MovieHeader movie={mockMovie} />
      {/* other components */}
    </>
  );
};


export default MovieDetails;