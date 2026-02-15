"use client";
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import MovieHeader from "./MovieHeader/MovieHeader";
import { mockMovie } from "../mock/movieMock";
import { Card } from "react-bootstrap";
import MovieSynopsis from "./MovieSynopsisCard/MovieSynopsis";
import MovieInfoCard from "./MovieInfoCard/MovieInfo";
import Cast from "./CastCard/Cast";

const MovieDetails = () => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    // fetch actual movies here when API is working
  }, []);

  return (
    <>
      <h1>Movie Details</h1>
      <Card className="shadow-sm ">
        <div className="d-flex flex-wrap align-items-stretch">
          {/* Movie Header */}
          <div className="flex-shrink-0" style={{ minWidth: "200px" }}>
            <MovieHeader movie={mockMovie} />
          </div>

          {/* Movie Info */}
          <div className="flex-grow-1">
            <MovieInfoCard movie={mockMovie} />
          </div>
        </div>
   
        <MovieSynopsis movie={mockMovie} />
        <div className="d-flex flex-wrap align-items-stretch">
          <div className="flex-shrink-0">
            <Cast movie={mockMovie}></Cast>
          </div>
        </div>
        

      </Card>


      {/* other components */}
    </>
  );
};


export default MovieDetails;